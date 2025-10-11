import { AICoordinatorAgent } from './agents/AICoordinatorAgent';
import { CoordinatorAgent } from './agents/CoordinatorAgent';
import { ProjectBrief, TechnicalTask, AgentResponse } from './types';

export class AIAgentSystem {
  private aiCoordinator: AICoordinatorAgent;
  private fallbackCoordinator: CoordinatorAgent;
  private useAI: boolean;

  constructor(useAI: boolean = true) {
    this.useAI = useAI;
    this.aiCoordinator = new AICoordinatorAgent();
    this.fallbackCoordinator = new CoordinatorAgent();
  }

  async processProject(brief: ProjectBrief): Promise<{
    tasks: TechnicalTask[];
    executionPlan: string;
    results: AgentResponse[];
    summary: string;
    aiAnalysis?: string;
    aiInsights?: string;
  }> {
    console.log('🤖 Enhanced AI Agent System - Processing project brief...');
    console.log(`📋 Project: ${brief.description}`);
    console.log(`🧠 AI Mode: ${this.useAI ? 'ENABLED' : 'DISABLED'}`);

    try {
      if (this.useAI) {
        return await this.processWithAI(brief);
      } else {
        return await this.processWithFallback(brief);
      }
    } catch (error) {
      console.warn('⚠️ AI processing failed, switching to fallback mode...');
      return await this.processWithFallback(brief);
    }
  }

  private async processWithAI(brief: ProjectBrief): Promise<{
    tasks: TechnicalTask[];
    executionPlan: string;
    results: AgentResponse[];
    summary: string;
    aiAnalysis: string;
    aiInsights: string;
  }> {
    console.log('🚀 Using AI-powered processing...');

    // Break down the project with AI analysis
    const { tasks, executionPlan, aiAnalysis } = await this.aiCoordinator.processProjectBrief(brief);

    console.log(`\n📊 AI generated ${tasks.length} enhanced technical tasks:`);
    tasks.forEach((task, index) => {
      console.log(`  ${index + 1}. [${task.type.toUpperCase()}] ${task.title} (${task.priority} priority)`);
      if (task.estimatedHours) {
        console.log(`     ⏱️ Estimated: ${task.estimatedHours} hours`);
      }
    });

    console.log('\n⚡ Executing AI-enhanced tasks...');

    // Execute the project with AI
    const { results, summary, aiInsights } = await this.aiCoordinator.executeProject(brief);

    console.log('\n✅ AI project execution completed!');
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

  private async processWithFallback(brief: ProjectBrief): Promise<{
    tasks: TechnicalTask[];
    executionPlan: string;
    results: AgentResponse[];
    summary: string;
  }> {
    console.log('🔄 Using fallback processing...');

    // Break down the project using rule-based approach
    const { tasks, executionPlan } = await this.fallbackCoordinator.processProjectBrief(brief);

    console.log(`\n📊 Generated ${tasks.length} technical tasks:`);
    tasks.forEach((task, index) => {
      console.log(`  ${index + 1}. [${task.type.toUpperCase()}] ${task.title}`);
    });

    console.log('\n⚡ Executing tasks...');

    // Execute the project
    const { results, summary } = await this.fallbackCoordinator.executeProject(brief);

    console.log('\n✅ Project execution completed!');
    console.log(summary);

    return {
      tasks,
      executionPlan,
      results,
      summary
    };
  }

  async breakdownOnly(brief: ProjectBrief): Promise<{
    tasks: TechnicalTask[];
    executionPlan: string;
    aiAnalysis?: string;
  }> {
    console.log('🧠 Enhanced AI Agent System - Analyzing project brief...');

    try {
      if (this.useAI) {
        console.log('🤖 Using AI analysis...');
        return await this.aiCoordinator.processProjectBrief(brief);
      } else {
        console.log('🔄 Using rule-based analysis...');
        return await this.fallbackCoordinator.processProjectBrief(brief);
      }
    } catch (error) {
      console.warn('⚠️ AI analysis failed, using fallback...');
      return await this.fallbackCoordinator.processProjectBrief(brief);
    }
  }

  async executeSpecificTasks(tasks: TechnicalTask[]): Promise<AgentResponse[]> {
    console.log('🚀 Enhanced AI Agent System - Executing specific tasks...');

    const results: AgentResponse[] = [];
    const coordinator = this.useAI ? this.aiCoordinator : this.fallbackCoordinator;

    for (const task of tasks) {
      console.log(`\n🔧 Processing: ${task.title}`);
      try {
        const result = await coordinator.executeTask(task);
        results.push(result);

        if (result.success) {
          console.log(`✅ Task completed successfully`);
          if (result.files && result.files.length > 0) {
            console.log(`📁 Generated ${result.files.length} files`);
          }
        } else {
          console.log(`❌ Task failed: ${result.error}`);
        }
      } catch (error) {
        console.log(`💥 Task error: ${error}`);
        results.push({
          success: false,
          output: '',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  // Switch between AI and fallback modes
  setAIMode(enabled: boolean): void {
    this.useAI = enabled;
    console.log(`🔄 AI mode ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }

  // Get system status
  getSystemStatus(): {
    aiMode: boolean;
    geminiConnected: boolean;
    version: string;
  } {
    return {
      aiMode: this.useAI,
      geminiConnected: process.env.GEMINI_API_KEY ? true : false,
      version: '2.0.0-AI'
    };
  }

  // Test AI connectivity
  async testAIConnection(): Promise<boolean> {
    try {
      const testBrief: ProjectBrief = {
        description: 'Simple test project to verify AI connectivity'
      };

      await this.aiCoordinator.processProjectBrief(testBrief);
      console.log('✅ AI connection test successful');
      return true;
    } catch (error) {
      console.log('❌ AI connection test failed:', error);
      return false;
    }
  }
}