import { ADKCoordinatorAgent } from './agents/adk/ADKCoordinatorAgent';
import { ProjectBrief, TechnicalTask, AgentResponse } from './types';

/**
 * Google ADK-powered Multi-Agent System
 *
 * This system uses Google's Agent Development Kit (ADK) to orchestrate
 * multiple specialized AI agents for comprehensive project generation.
 */
export class ADKAgentSystem {
  private coordinator: ADKCoordinatorAgent;
  private useADK: boolean;

  constructor(useADK: boolean = true) {
    this.useADK = useADK;
    this.coordinator = new ADKCoordinatorAgent();
  }

  async processProject(brief: ProjectBrief): Promise<{
    tasks: TechnicalTask[];
    executionPlan: string;
    results: AgentResponse[];
    summary: string;
    aiAnalysis?: string;
    aiInsights?: string;
  }> {
    console.log('[AI] Google ADK Multi-Agent System - Processing project...');
    console.log(`[Project] Project: ${brief.description}`);
    console.log(`[System] ADK Mode: ${this.useADK ? 'ENABLED [Success]' : 'DISABLED'}`);

    try {
      return await this.processWithADK(brief);
    } catch (error) {
      console.error('[Warning] ADK processing failed:', error);
      throw error;
    }
  }

  private async processWithADK(brief: ProjectBrief): Promise<{
    tasks: TechnicalTask[];
    executionPlan: string;
    results: AgentResponse[];
    summary: string;
    aiAnalysis: string;
    aiInsights: string;
  }> {
    console.log('[Starting] Using Google ADK Multi-Agent System...');

    // Phase 1: Task Breakdown with ADK Coordinator
    const { tasks, executionPlan, aiAnalysis } = await this.coordinator.processProjectBrief(brief);

    console.log(`\n[Data] ADK generated ${tasks.length} technical tasks:`);
    tasks.forEach((task, index) => {
      console.log(`  ${index + 1}. [${task.type.toUpperCase()}] ${task.title}`);
      console.log(`     Priority: ${task.priority} | Est: ${task.estimatedHours}h`);
    });

    console.log('\n[Executing] Executing ADK multi-agent tasks...');

    // Phase 2: Execute tasks with specialized ADK agents
    const { results, summary, aiInsights } = await this.coordinator.executeProject(brief);

    console.log('\n[Success] ADK project execution completed!');
    console.log(summary);

    return {
      tasks,
      executionPlan,
      results,
      summary,
      aiAnalysis,
      aiInsights
    };
  }

  async breakdownOnly(brief: ProjectBrief): Promise<{
    tasks: TechnicalTask[];
    executionPlan: string;
    aiAnalysis?: string;
  }> {
    console.log('[System] Google ADK Multi-Agent System - Analyzing project...');

    try {
      console.log('[AI] Using ADK Coordinator for analysis...');
      return await this.coordinator.processProjectBrief(brief);
    } catch (error) {
      console.error('[Warning] ADK analysis failed:', error);
      throw error;
    }
  }

  async executeSpecificTasks(tasks: TechnicalTask[]): Promise<AgentResponse[]> {
    console.log('[Starting] Google ADK - Executing specific tasks...');

    const results: AgentResponse[] = [];

    for (const task of tasks) {
      console.log(`\n[Processing] Processing: ${task.title}`);
      try {
        const result = await this.coordinator.executeTask(task);
        results.push(result);

        if (result.success) {
          console.log(`[Success] Task completed successfully`);
          if (result.files && result.files.length > 0) {
            console.log(`[Files] Generated ${result.files.length} files`);
          }
        } else {
          console.log(`[Error] Task failed: ${result.error}`);
        }
      } catch (error) {
        console.log(`[Error] Task error: ${error}`);
        results.push({
          success: false,
          output: '',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  // Switch ADK mode on/off
  setADKMode(enabled: boolean): void {
    this.useADK = enabled;
    console.log(`[Fallback] ADK mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  // Get system status
  getSystemStatus(): {
    adkMode: boolean;
    apiKeyConfigured: boolean;
    version: string;
    framework: string;
  } {
    return {
      adkMode: this.useADK,
      apiKeyConfigured: process.env.GOOGLE_API_KEY ? true : false,
      version: '3.0.0-ADK',
      framework: 'Google Agent Development Kit (ADK)'
    };
  }

  // Test ADK connectivity
  async testADKConnection(): Promise<boolean> {
    try {
      const testBrief: ProjectBrief = {
        description: 'Simple test project to verify ADK connectivity'
      };

      await this.coordinator.processProjectBrief(testBrief);
      console.log('[Success] ADK connection test successful');
      return true;
    } catch (error) {
      console.log('[Error] ADK connection test failed:', error);
      return false;
    }
  }

  // Get ADK agent information
  getAgentInfo(): {
    coordinator: string;
    frontendAgent: string;
    backendAgent: string;
    framework: string;
  } {
    return {
      coordinator: 'ADK Coordinator Agent - Project breakdown and orchestration',
      frontendAgent: 'ADK Frontend Agent - React/TypeScript UI generation',
      backendAgent: 'ADK Backend Agent - Node.js/Express API generation',
      framework: 'Google Agent Development Kit (ADK) v0.1.2'
    };
  }
}
