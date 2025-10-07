import { BaseAgent } from '../src/agents/BaseAgent';
import { TechnicalTask, AgentResponse, GeneratedFile } from '../src/types';
import { CoordinatorAgent } from '../src/agents/CoordinatorAgent';

// Example of creating a custom agent for DevOps tasks
class DevOpsAgent extends BaseAgent {
  constructor() {
    super('DevOps Agent', ['devops', 'deployment', 'infrastructure', 'monitoring']);
  }

  async executeTask(task: TechnicalTask): Promise<AgentResponse> {
    if (!this.validateTask(task) || !this.canHandleTask(task)) {
      return {
        success: false,
        output: '',
        error: 'Cannot handle this task type'
      };
    }

    try {
      const files = await this.generateDevOpsFiles(task);

      return {
        success: true,
        output: `DevOps Agent completed: ${task.title}`,
        files
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'DevOps task failed'
      };
    }
  }

  private async generateDevOpsFiles(task: TechnicalTask): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Docker configuration
    if (task.title.toLowerCase().includes('docker') || task.title.toLowerCase().includes('container')) {
      files.push({
        path: 'Dockerfile',
        type: 'config',
        content: `FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]`
      });

      files.push({
        path: 'docker-compose.yml',
        type: 'config',
        content: `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=task_management
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  db_data:`
      });
    }

    // CI/CD Pipeline
    if (task.title.toLowerCase().includes('ci') || task.title.toLowerCase().includes('deploy')) {
      files.push({
        path: '.github/workflows/ci-cd.yml',
        type: 'config',
        content: `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3

    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run tests
      run: npm test

    - name: Build application
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'

    - name: Install dependencies
      run: npm ci

    - name: Build application
      run: npm run build

    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # Add your deployment commands here`
      });
    }

    // Monitoring configuration
    if (task.title.toLowerCase().includes('monitor') || task.title.toLowerCase().includes('observability')) {
      files.push({
        path: 'monitoring/prometheus.yml',
        type: 'config',
        content: `global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node-app'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/metrics'
    scrape_interval: 10s

  - job_name: 'postgres'
    static_configs:
      - targets: ['db:5432']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:6379']`
      });

      files.push({
        path: 'monitoring/docker-compose.monitoring.yml',
        type: 'config',
        content: `version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  grafana_data:`
      });
    }

    return files;
  }
}

// Example of extending the coordinator to include custom agents
class ExtendedCoordinatorAgent extends CoordinatorAgent {
  private devopsAgent: DevOpsAgent;

  constructor() {
    super();
    this.devopsAgent = new DevOpsAgent();
  }

  async executeTask(task: TechnicalTask): Promise<AgentResponse> {
    // Check if it's a DevOps task
    if (task.type === 'devops' ||
        task.title.toLowerCase().includes('deploy') ||
        task.title.toLowerCase().includes('docker') ||
        task.title.toLowerCase().includes('ci')) {
      return await this.devopsAgent.executeTask(task);
    }

    // Otherwise use the parent implementation
    return await super.executeTask(task);
  }
}

// Example usage of custom agents
async function customAgentExample() {
  console.log('🔧 Custom Agent Example\n');

  const extendedCoordinator = new ExtendedCoordinatorAgent();

  // Create a DevOps task
  const devopsTask: TechnicalTask = {
    id: 'devops-1',
    title: 'Setup Docker containerization and CI/CD pipeline',
    description: 'Create Docker configuration and GitHub Actions workflow for the application',
    type: 'devops' as any, // Extending the type system
    priority: 'high',
    acceptance_criteria: [
      'Dockerfile for application containerization',
      'Docker Compose for local development',
      'GitHub Actions CI/CD pipeline',
      'Production deployment configuration'
    ]
  };

  try {
    console.log('🚀 Executing DevOps task...');
    const result = await extendedCoordinator.executeTask(devopsTask);

    if (result.success) {
      console.log('✅ DevOps task completed successfully!');
      console.log(`📁 Generated ${result.files?.length || 0} configuration files:`);

      result.files?.forEach(file => {
        console.log(`   - ${file.path}`);
      });
    } else {
      console.log('❌ DevOps task failed:', result.error);
    }

  } catch (error) {
    console.error('💥 Error executing custom agent:', error);
  }
}

// Standalone agent usage
async function standaloneAgentExample() {
  console.log('\n🎯 Standalone Agent Example\n');

  const devopsAgent = new DevOpsAgent();

  const monitoringTask: TechnicalTask = {
    id: 'monitoring-1',
    title: 'Setup application monitoring with Prometheus and Grafana',
    description: 'Configure monitoring stack for observability',
    type: 'devops' as any,
    priority: 'medium',
    acceptance_criteria: [
      'Prometheus configuration',
      'Grafana dashboard setup',
      'Application metrics collection'
    ]
  };

  try {
    console.log('📊 Setting up monitoring...');
    const result = await devopsAgent.executeTask(monitoringTask);

    if (result.success) {
      console.log('✅ Monitoring setup completed!');
      console.log('📈 Monitoring stack ready with:');
      result.files?.forEach(file => {
        console.log(`   - ${file.path}`);
      });
    }

  } catch (error) {
    console.error('💥 Error setting up monitoring:', error);
  }
}

async function runCustomAgentExamples() {
  await customAgentExample();
  await standaloneAgentExample();
}

if (require.main === module) {
  runCustomAgentExamples().catch(console.error);
}

export { DevOpsAgent, ExtendedCoordinatorAgent, customAgentExample };