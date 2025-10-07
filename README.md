# AgentTask-AI

**AI-Powered Project Brief to Technical Task Breakdown System**

AgentTask-AI is an intelligent agent system that transforms high-level project descriptions into actionable technical tasks using Google's Gemini AI. It analyzes project requirements, generates structured task breakdowns with priority levels, and provides intelligent insights for software development projects.

## What It Does

Simply describe your project idea in plain English, and AgentTask-AI will:
- **Analyze** your project requirements using Gemini AI
- **Break down** the project into detailed technical tasks
- **Prioritize** tasks based on dependencies and importance
- **Estimate** development effort for each task
- **Generate** execution plans with specialized agent recommendations

Perfect for developers, project managers, and teams who want to quickly structure their ideas into actionable development plans.

## Features

- **AI-Powered Analysis**: Uses Google Gemini 2.5 Flash for intelligent project breakdown
- **Intelligent Task Generation**: Automatically generates frontend, backend, database, testing, and deployment tasks
- **Priority & Time Estimation**: Each task includes priority level and estimated hours
- **Specialized Agents**: Delegates tasks to appropriate specialist agents (React, Express, Database, etc.)
- **Fallback Mode**: Rule-based processing when AI is unavailable
- **Flexible Input**: Simple command-line interface for custom prompts
- **TypeScript Support**: Fully typed codebase for better development experience

## Quick Start

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/AgentTask-AI.git
cd AgentTask-AI
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Build the project:
```bash
npm run build
```

### Usage

#### Test with Custom Prompts

```bash
node test-real-ai.js "Create a todo app with user authentication"
```

#### Example Prompts

```bash
# E-commerce platform
node test-real-ai.js "Build an e-commerce store with shopping cart and payment integration"

# Social media app
node test-real-ai.js "Create a Twitter-like social media platform with posts, likes, and comments"

# Dashboard application
node test-real-ai.js "Develop a real-time analytics dashboard for business metrics"

# Mobile app backend
node test-real-ai.js "Design a REST API for a fitness tracking mobile app"
```

## Project Structure

```
AgentTask-AI/
├── src/
│   ├── agents/              # Specialized agent implementations
│   │   ├── AICoordinatorAgent.ts    # Main AI coordinator
│   │   ├── CoordinatorAgent.ts      # Fallback coordinator
│   │   ├── ReactAgent.ts            # Frontend specialist
│   │   ├── ExpressAgent.ts          # Backend specialist
│   │   ├── DatabaseAgent.ts         # Database specialist
│   │   └── TestingAgent.ts          # Testing specialist
│   ├── types.ts             # TypeScript type definitions
│   └── AIAgentSystem.ts     # Main system orchestrator
├── dist/                    # Compiled JavaScript output
├── examples/                # Usage examples
├── test-real-ai.js          # Quick test script
└── package.json
```

## How It Works

1. **Input**: You provide a project description via command line
2. **AI Analysis**: Gemini AI analyzes the requirements and technical needs
3. **Task Generation**: System generates structured tasks with:
   - Task type (frontend, backend, database, testing, deployment)
   - Priority level (high, medium, low)
   - Estimated effort in hours
   - Detailed description
   - Dependencies
4. **Output**: Displays organized task breakdown with execution plan

## Example Output

```
🚀 Testing REAL Gemini AI Connection...

📋 Brief: Create a todo app with user authentication

⚡ Asking Gemini AI to analyze...

✅ SUCCESS! Real AI is working!

📊 AI Generated Tasks:

1. Setup React Frontend Structure
   Type: frontend
   Priority: high
   Description: Initialize React app with routing and state management setup

2. Create Authentication API
   Type: backend
   Priority: high
   Description: Implement JWT-based authentication endpoints (login, register, logout)

3. Design Database Schema
   Type: database
   Priority: high
   Description: Create user and todo tables with proper relationships

4. Build Todo CRUD Operations
   Type: backend
   Priority: medium
   Description: Implement API endpoints for creating, reading, updating, and deleting todos

5. Implement Testing Suite
   Type: testing
   Priority: medium
   Description: Write unit and integration tests for authentication and todo features

🤖 AI Analysis:
The project requires a full-stack implementation with user management and task tracking...

🎉 GEMINI AI IS WORKING PERFECTLY!
✅ API Key: Valid
✅ Model: gemini-2.5-flash
✅ Connection: Successful
```

## API Usage

### Programmatic Usage

```typescript
import { AIAgentSystem } from './dist/AIAgentSystem';

const agentSystem = new AIAgentSystem(true); // Enable AI

const projectBrief = {
  description: 'Create a blog platform with CMS',
  requirements: ['User authentication', 'Rich text editor', 'Comment system'],
  constraints: ['Use React and Node.js', 'Deploy on AWS']
};

// Get task breakdown
const result = await agentSystem.breakdownOnly(projectBrief);

console.log('Generated Tasks:', result.tasks);
console.log('AI Analysis:', result.aiAnalysis);
console.log('Execution Plan:', result.executionPlan);
```

### Full Project Execution

```typescript
// Process and execute the entire project
const execution = await agentSystem.processProject(projectBrief);

console.log('Tasks:', execution.tasks);
console.log('Results:', execution.results);
console.log('Summary:', execution.summary);
console.log('AI Insights:', execution.aiInsights);
```

## Configuration

### Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key (required for AI mode)

### AI Mode Toggle

```typescript
const agentSystem = new AIAgentSystem(true);  // AI enabled
const agentSystem = new AIAgentSystem(false); // Fallback mode

// Toggle at runtime
agentSystem.setAIMode(false); // Switch to fallback
agentSystem.setAIMode(true);  // Switch back to AI
```

## Available Scripts

```bash
npm run build        # Compile TypeScript to JavaScript
npm start           # Run the compiled application
npm run dev         # Run in development mode with ts-node
npm run dev:watch   # Run with auto-reload on changes
npm run clean       # Remove compiled files
```

## Task Types

The system generates tasks across multiple categories:

- **Frontend**: React components, UI/UX, state management
- **Backend**: API development, business logic, server setup
- **Database**: Schema design, migrations, queries
- **Testing**: Unit tests, integration tests, E2E tests
- **Deployment**: CI/CD, hosting, monitoring
- **DevOps**: Infrastructure, security, performance optimization

## Technology Stack

- **Language**: TypeScript/JavaScript
- **Runtime**: Node.js
- **AI Model**: Google Gemini 2.5 Flash
- **Core Dependencies**:
  - `@google/generative-ai` - Gemini AI integration
  - `express` - Backend framework (for generated code)
  - `dotenv` - Environment configuration

## System Requirements

- **Node.js**: 16.0.0 or higher
- **npm**: 8.0.0 or higher
- **OS**: Linux, macOS, Windows (WSL supported)
- **Memory**: Minimum 512MB RAM
- **Network**: Internet connection for AI API calls

## Troubleshooting

### AI Connection Fails

```bash
# Test your API key
node test-api-direct.js

# Check environment variables
echo $GEMINI_API_KEY
```

### Build Errors

```bash
# Clean and rebuild
npm run clean
npm run build
```

### Missing Dependencies

```bash
# Reinstall all packages
rm -rf node_modules package-lock.json
npm install
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- [ ] Support for multiple AI providers (OpenAI, Claude, etc.)
- [ ] Web-based UI interface
- [ ] Task execution automation
- [ ] Code generation for common patterns
- [ ] Integration with project management tools (Jira, Trello)
- [ ] Export to various formats (JSON, Markdown, PDF)
- [ ] Team collaboration features
- [ ] Cost estimation based on market rates

## Acknowledgments

- Google Gemini AI for powering the intelligent analysis
- The open-source community for inspiration and tools

## Contact

For questions, issues, or suggestions, please open an issue on GitHub.

---

**Made with AI-powered intelligence for developers who want to move fast and build things.**
