import { BaseAgent } from './BaseAgent';
import { ProjectBrief, TechnicalTask, AgentResponse } from '../types';
export declare class AICoordinatorAgent extends BaseAgent {
    private frontendAgent;
    private backendAgent;
    private geminiService;
    private taskQueue;
    private completedTasks;
    constructor();
    processProjectBrief(brief: ProjectBrief): Promise<{
        tasks: TechnicalTask[];
        executionPlan: string;
        aiAnalysis: string;
    }>;
    executeProject(brief: ProjectBrief): Promise<{
        results: AgentResponse[];
        summary: string;
        aiInsights: string;
    }>;
    executeTask(task: TechnicalTask): Promise<AgentResponse>;
    private createAIExecutionPlan;
    private generateAIAnalysis;
    private generateAIInsights;
    private assessComplexity;
    private identifyArchitecture;
    private identifyTechStack;
    private identifyRisks;
    private generateRecommendations;
    private fallbackBreakdownProject;
    private generateProjectSummary;
}
//# sourceMappingURL=AICoordinatorAgent.d.ts.map