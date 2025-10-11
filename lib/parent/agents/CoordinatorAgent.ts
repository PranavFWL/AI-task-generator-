import { BaseAgent } from './BaseAgent';
import { FrontendAgent } from './FrontendAgent';
import { BackendAgent } from './BackendAgent';
import { ProjectBrief, TechnicalTask, AgentResponse } from '../types';

export class CoordinatorAgent extends BaseAgent {
  private frontendAgent: FrontendAgent;
  private backendAgent: BackendAgent;
  private taskQueue: TechnicalTask[] = [];
  private completedTasks: TechnicalTask[] = [];

  constructor() {
    super('Coordinator', ['coordination', 'task_breakdown', 'project_management']);
    this.frontendAgent = new FrontendAgent();
    this.backendAgent = new BackendAgent();
  }

  async processProjectBrief(brief: ProjectBrief): Promise<{
    tasks: TechnicalTask[];
    executionPlan: string;
  }> {
    const tasks = this.breakdownProject(brief);
    const executionPlan = this.createExecutionPlan(tasks);

    return {
      tasks,
      executionPlan
    };
  }

  async executeProject(brief: ProjectBrief): Promise<{
    results: AgentResponse[];
    summary: string;
  }> {
    const { tasks } = await this.processProjectBrief(brief);
    const results: AgentResponse[] = [];

    for (const task of tasks) {
      try {
        const result = await this.executeTask(task);
        results.push(result);

        if (result.success) {
          this.completedTasks.push(task);
        }
      } catch (error) {
        results.push({
          success: false,
          output: '',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const summary = this.generateProjectSummary(results);
    return { results, summary };
  }

  async executeTask(task: TechnicalTask): Promise<AgentResponse> {
    if (!this.validateTask(task)) {
      return {
        success: false,
        output: '',
        error: 'Invalid task provided'
      };
    }

    switch (task.type) {
      case 'frontend':
        return await this.frontendAgent.executeTask(task);
      case 'backend':
        return await this.backendAgent.executeTask(task);
      default:
        return {
          success: false,
          output: '',
          error: `Unknown task type: ${task.type}`
        };
    }
  }

  private breakdownProject(brief: ProjectBrief): TechnicalTask[] {
    const tasks: TechnicalTask[] = [];
    const description = brief.description.toLowerCase();

    if (description.includes('auth') || description.includes('login') || description.includes('user')) {
      tasks.push({
        id: this.generateTaskId(),
        title: 'Implement User Authentication',
        description: 'Create user registration, login, and authentication system',
        type: 'backend',
        priority: 'high',
        acceptance_criteria: [
          'User registration endpoint',
          'User login endpoint',
          'JWT token generation',
          'Password hashing',
          'Authentication middleware'
        ]
      });

      tasks.push({
        id: this.generateTaskId(),
        title: 'Create Authentication UI',
        description: 'Build login and registration forms',
        type: 'frontend',
        priority: 'high',
        acceptance_criteria: [
          'Login form component',
          'Registration form component',
          'Form validation',
          'Error handling',
          'Responsive design'
        ]
      });
    }

    if (description.includes('task') || description.includes('todo') || description.includes('management')) {
      tasks.push({
        id: this.generateTaskId(),
        title: 'Implement Task Management API',
        description: 'Create CRUD operations for task management',
        type: 'backend',
        priority: 'high',
        acceptance_criteria: [
          'Create task endpoint',
          'Read tasks endpoint',
          'Update task endpoint',
          'Delete task endpoint',
          'Task model/schema'
        ]
      });

      tasks.push({
        id: this.generateTaskId(),
        title: 'Build Task Management UI',
        description: 'Create components for task CRUD operations',
        type: 'frontend',
        priority: 'high',
        acceptance_criteria: [
          'Task list component',
          'Task creation form',
          'Task editing functionality',
          'Task deletion',
          'Task status updates'
        ]
      });
    }

    if (description.includes('shar') || description.includes('collaborat')) {
      tasks.push({
        id: this.generateTaskId(),
        title: 'Implement Task Sharing',
        description: 'Allow users to share tasks with other users',
        type: 'backend',
        priority: 'medium',
        acceptance_criteria: [
          'Share task endpoint',
          'User permissions system',
          'Shared task visibility',
          'Notification system'
        ]
      });

      tasks.push({
        id: this.generateTaskId(),
        title: 'Create Sharing UI',
        description: 'Build interface for sharing tasks',
        type: 'frontend',
        priority: 'medium',
        acceptance_criteria: [
          'Share task modal',
          'User search/selection',
          'Permission settings',
          'Shared task indicators'
        ]
      });
    }

    if (description.includes('api') || description.includes('rest') || description.includes('graphql')) {
      tasks.push({
        id: this.generateTaskId(),
        title: 'Setup API Foundation',
        description: 'Create basic API structure and middleware',
        type: 'backend',
        priority: 'high',
        acceptance_criteria: [
          'Express/Fastify server setup',
          'Middleware configuration',
          'Error handling',
          'Request validation',
          'API documentation'
        ]
      });
    }

    if (description.includes('database') || description.includes('data')) {
      tasks.push({
        id: this.generateTaskId(),
        title: 'Design Database Schema',
        description: 'Create optimized database schema',
        type: 'backend',
        priority: 'high',
        acceptance_criteria: [
          'Database schema design',
          'Relationship definitions',
          'Indexing strategy',
          'Migration scripts',
          'Seed data'
        ]
      });
    }

    return tasks;
  }

  private createExecutionPlan(tasks: TechnicalTask[]): string {
    const backendTasks = tasks.filter(t => t.type === 'backend');
    const frontendTasks = tasks.filter(t => t.type === 'frontend');

    let plan = `Execution Plan:\n\n`;
    plan += `Phase 1 - Backend Development (${backendTasks.length} tasks):\n`;
    backendTasks.forEach((task, index) => {
      plan += `  ${index + 1}. ${task.title}\n`;
    });

    plan += `\nPhase 2 - Frontend Development (${frontendTasks.length} tasks):\n`;
    frontendTasks.forEach((task, index) => {
      plan += `  ${index + 1}. ${task.title}\n`;
    });

    plan += `\nTotal estimated tasks: ${tasks.length}`;
    return plan;
  }

  private generateProjectSummary(results: AgentResponse[]): string {
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;

    let summary = `Project Execution Summary:\n`;
    summary += `- Total tasks: ${results.length}\n`;
    summary += `- Successful: ${successful}\n`;
    summary += `- Failed: ${failed}\n`;

    if (failed > 0) {
      summary += `\nFailed tasks:\n`;
      results.forEach((result, index) => {
        if (!result.success) {
          summary += `- Task ${index + 1}: ${result.error}\n`;
        }
      });
    }

    return summary;
  }
}