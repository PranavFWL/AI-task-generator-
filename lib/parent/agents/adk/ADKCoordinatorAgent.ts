import { LlmAgent, Runner, InMemorySessionService } from '@google/adk';
import { z } from 'zod';
import { ADKFrontendAgent } from './ADKFrontendAgent';
import { ADKBackendAgent } from './ADKBackendAgent';
import { ProjectBrief, TechnicalTask, AgentResponse } from '../../types';

/**
 * ADK-based Coordinator Agent that orchestrates multi-agent task generation
 * Uses Google ADK framework for intelligent project breakdown and coordination
 */
export class ADKCoordinatorAgent {
  private plannerAgent: LlmAgent;
  private frontendAgent: ADKFrontendAgent;
  private backendAgent: ADKBackendAgent;

  constructor() {
    // Create planner agent for task breakdown
    this.plannerAgent = new LlmAgent({
      name: 'project_planner',
      description: 'Expert software architect for breaking down projects into technical tasks',
      model: 'gemini-2.0-flash',
      instruction: `You are an expert software architect and project planner.

Your role is to analyze project descriptions and break them down into specific, actionable technical tasks.

Guidelines:
1. Create 4-8 technical tasks that cover the full project scope
2. Each task should be EITHER 'frontend' OR 'backend' type
3. Assign priority: 'high', 'medium', or 'low'
4. Include 3-6 specific acceptance criteria for each task
5. Estimate hours realistically (2-16 hours per task)
6. Consider dependencies between tasks
7. Follow modern web development best practices

Task Categories:
- Frontend: UI components, forms, displays, user interactions
- Backend: APIs, authentication, database operations, business logic

Output ONLY valid JSON in this exact format:
{
  "tasks": [
    {
      "title": "Clear, specific task title",
      "description": "Detailed description of what needs to be built",
      "type": "frontend",
      "priority": "high",
      "acceptance_criteria": [
        "Specific deliverable 1",
        "Specific deliverable 2",
        "Specific deliverable 3"
      ],
      "estimatedHours": 8
    }
  ],
  "analysis": "Brief analysis of the project complexity and approach"
}

Important:
- Output ONLY the JSON, no additional text
- Ensure all JSON is properly formatted
- Include realistic estimates
- Make tasks specific and actionable`,
    });

    this.frontendAgent = new ADKFrontendAgent();
    this.backendAgent = new ADKBackendAgent();
  }

  async processProjectBrief(brief: ProjectBrief): Promise<{
    tasks: TechnicalTask[];
    executionPlan: string;
    aiAnalysis: string;
  }> {
    console.log('[System] ADK Coordinator analyzing project brief...');

    try {
      // Use planner agent to break down the project
      const prompt = this.createPlanningPrompt(brief);

      // Create session service and runner
      const sessionService = new InMemorySessionService();
      const userId = 'system';
      const sessionId = `project_${Date.now()}`;

      // Create session before running
      await sessionService.createSession({
        userId,
        sessionId,
        agentId: this.plannerAgent.name
      });

      const runner = new Runner({
        appName: 'adk-coordinator',
        agent: this.plannerAgent,
        sessionService
      });

      // Run the ADK planner agent and collect events
      let responseContent = '';
      for await (const event of runner.runAsync({
        userId,
        sessionId,
        newMessage: {
          role: 'user',
          parts: [{ text: prompt }]
        }
      })) {
        if (event.author === this.plannerAgent.name && event.content) {
          const parts = event.content.parts || [];
          for (const part of parts) {
            if ('text' in part && part.text) {
              responseContent += part.text;
            }
          }
        }
      }

      // Parse the response
      const result = this.parseTasksFromResponse(responseContent);

      // Generate execution plan
      const executionPlan = this.createExecutionPlan(result.tasks, brief);

      console.log(`[Success] ADK Coordinator generated ${result.tasks.length} technical tasks`);

      return {
        tasks: result.tasks,
        executionPlan,
        aiAnalysis: result.analysis || 'Project analyzed and tasks generated using ADK multi-agent system'
      };

    } catch (error) {
      console.error('[Error] ADK Coordinator error:', error);

      // Fallback to basic task generation
      const fallbackTasks = this.generateFallbackTasks(brief);
      const executionPlan = this.createExecutionPlan(fallbackTasks, brief);

      return {
        tasks: fallbackTasks,
        executionPlan,
        aiAnalysis: 'Used fallback task generation due to error'
      };
    }
  }

  async executeProject(brief: ProjectBrief): Promise<{
    results: AgentResponse[];
    summary: string;
    aiInsights: string;
  }> {
    console.log('[Starting] ADK Coordinator executing project...');

    const { tasks } = await this.processProjectBrief(brief);
    const results: AgentResponse[] = [];

    for (const task of tasks) {
      console.log(`\n[Processing] ADK processing: ${task.title}`);

      try {
        const result = await this.executeTask(task);
        results.push(result);

        if (result.success) {
          console.log(`[Success] ADK completed: ${task.title}`);
        } else {
          console.log(`[Error] ADK failed: ${task.title} - ${result.error}`);
        }
      } catch (error) {
        console.log(`[Error] ADK error: ${task.title} - ${error}`);
        results.push({
          success: false,
          output: '',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const summary = this.generateProjectSummary(results);
    const aiInsights = this.generateAIInsights(results, tasks);

    return { results, summary, aiInsights };
  }

  async executeTask(task: TechnicalTask): Promise<AgentResponse> {
    try {
      if (task.type === 'frontend') {
        return await this.frontendAgent.executeTask(task);
      } else if (task.type === 'backend') {
        return await this.backendAgent.executeTask(task);
      } else {
        return {
          success: false,
          output: '',
          error: `Unknown task type: ${task.type}`
        };
      }
    } catch (error) {
      console.error(`Task execution error:`, error);
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Task execution failed'
      };
    }
  }

  private createPlanningPrompt(brief: ProjectBrief): string {
    let prompt = `Analyze this project and break it down into technical tasks:\n\n`;
    prompt += `Project: ${brief.description}\n\n`;

    if (brief.requirements && brief.requirements.length > 0) {
      prompt += `Requirements:\n`;
      brief.requirements.forEach(req => prompt += `- ${req}\n`);
      prompt += `\n`;
    }

    if (brief.constraints && brief.constraints.length > 0) {
      prompt += `Constraints:\n`;
      brief.constraints.forEach(con => prompt += `- ${con}\n`);
      prompt += `\n`;
    }

    if (brief.timeline) {
      prompt += `Timeline: ${brief.timeline}\n\n`;
    }

    prompt += `Generate a comprehensive breakdown with specific tasks for both frontend and backend development.`;

    return prompt;
  }

  private parseTasksFromResponse(content: string): {
    tasks: TechnicalTask[];
    analysis: string;
  } {
    try {
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      const tasks = parsed.tasks.map((taskData: any, index: number) => ({
        id: `adk_task_${Date.now()}_${index}`,
        title: taskData.title || `Task ${index + 1}`,
        description: taskData.description || 'No description provided',
        type: taskData.type === 'frontend' ? 'frontend' as const : 'backend' as const,
        priority: ['high', 'medium', 'low'].includes(taskData.priority)
          ? taskData.priority
          : 'medium' as const,
        acceptance_criteria: Array.isArray(taskData.acceptance_criteria)
          ? taskData.acceptance_criteria
          : ['Task completion criteria to be defined'],
        estimatedHours: taskData.estimatedHours || 4
      }));

      return {
        tasks,
        analysis: parsed.analysis || 'Tasks generated successfully'
      };

    } catch (error) {
      console.error('[Error] Failed to parse tasks from response:', error);
      throw new Error('Failed to parse AI-generated tasks');
    }
  }

  private generateFallbackTasks(brief: ProjectBrief): TechnicalTask[] {
    const tasks: TechnicalTask[] = [];
    const description = brief.description.toLowerCase();

    // Basic task generation based on keywords
    if (description.includes('auth') || description.includes('login') || description.includes('user')) {
      tasks.push({
        id: `fallback_${Date.now()}_1`,
        title: 'Implement User Authentication System',
        description: 'Create user registration, login, and authentication',
        type: 'backend',
        priority: 'high',
        acceptance_criteria: [
          'User registration endpoint',
          'Login endpoint with JWT',
          'Password hashing',
          'Authentication middleware'
        ],
        estimatedHours: 8
      });

      tasks.push({
        id: `fallback_${Date.now()}_2`,
        title: 'Create Login UI Components',
        description: 'Build login and registration forms',
        type: 'frontend',
        priority: 'high',
        acceptance_criteria: [
          'Login form component',
          'Registration form component',
          'Form validation',
          'Error handling'
        ],
        estimatedHours: 6
      });
    }

    if (description.includes('dashboard') || description.includes('ui')) {
      tasks.push({
        id: `fallback_${Date.now()}_3`,
        title: 'Build Main Dashboard UI',
        description: 'Create responsive dashboard interface',
        type: 'frontend',
        priority: 'medium',
        acceptance_criteria: [
          'Dashboard layout',
          'Navigation components',
          'Responsive design',
          'Data display components'
        ],
        estimatedHours: 10
      });
    }

    if (tasks.length === 0) {
      tasks.push({
        id: `fallback_${Date.now()}_default`,
        title: 'Project Setup and Initial Structure',
        description: 'Set up basic project structure',
        type: 'frontend',
        priority: 'high',
        acceptance_criteria: [
          'Project initialized',
          'Basic components created',
          'Routing configured'
        ],
        estimatedHours: 4
      });
    }

    return tasks;
  }

  private createExecutionPlan(tasks: TechnicalTask[], brief: ProjectBrief): string {
    const backendTasks = tasks.filter(t => t.type === 'backend');
    const frontendTasks = tasks.filter(t => t.type === 'frontend');

    let plan = `[AI] ADK Multi-Agent Execution Plan\n`;
    plan += `=====================================\n\n`;

    plan += `[Project] Project Overview:\n`;
    plan += `${brief.description}\n\n`;

    plan += `[Phase] Phase 1 - Backend Development (${backendTasks.length} tasks):\n`;
    backendTasks.forEach((task, index) => {
      plan += `  ${index + 1}. ${task.title} [${task.priority} priority, ~${task.estimatedHours}h]\n`;
    });

    plan += `\n[Frontend] Phase 2 - Frontend Development (${frontendTasks.length} tasks):\n`;
    frontendTasks.forEach((task, index) => {
      plan += `  ${index + 1}. ${task.title} [${task.priority} priority, ~${task.estimatedHours}h]\n`;
    });

    const totalHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
    plan += `\n[Time] Total Estimated Time: ${totalHours} hours\n`;
    plan += `[Data] Total Tasks: ${tasks.length}\n`;
    plan += `\n[AI] Powered by Google ADK Multi-Agent System`;

    return plan;
  }

  private generateProjectSummary(results: AgentResponse[]): string {
    const successful = results.filter(r => r.success).length;
    const failed = results.length - successful;
    const totalFiles = results.reduce((sum, r) => sum + (r.files?.length || 0), 0);

    let summary = `[AI] ADK Project Execution Summary\n`;
    summary += `================================\n`;
    summary += `[Data] Total tasks: ${results.length}\n`;
    summary += `[Success] Successful: ${successful}\n`;
    summary += `[Error] Failed: ${failed}\n`;
    summary += `[Files] Files generated: ${totalFiles}\n`;

    return summary;
  }

  private generateAIInsights(results: AgentResponse[], tasks: TechnicalTask[]): string {
    const successful = results.filter(r => r.success).length;
    const successRate = Math.round((successful / results.length) * 100);

    let insights = `[Insights] ADK Multi-Agent Insights\n`;
    insights += `===========================\n\n`;
    insights += `[Stats] Success Rate: ${successRate}%\n`;
    insights += `[AI] Agent Coordination: Multi-agent orchestration successful\n`;
    insights += `[Executing] Google ADK Framework: Production-ready code generation\n\n`;

    if (successRate === 100) {
      insights += `[Info] Recommendations:\n`;
      insights += `  - All tasks completed successfully\n`;
      insights += `  - Review generated code for customization\n`;
      insights += `  - Add tests and documentation\n`;
      insights += `  - Deploy to staging environment\n`;
    }

    return insights;
  }
}
