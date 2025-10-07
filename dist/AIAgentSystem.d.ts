import { ProjectBrief, TechnicalTask, AgentResponse } from './types';
export declare class AIAgentSystem {
    private aiCoordinator;
    private fallbackCoordinator;
    private useAI;
    constructor(useAI?: boolean);
    processProject(brief: ProjectBrief): Promise<{
        tasks: TechnicalTask[];
        executionPlan: string;
        results: AgentResponse[];
        summary: string;
        aiAnalysis?: string;
        aiInsights?: string;
    }>;
    private processWithAI;
    private processWithFallback;
    breakdownOnly(brief: ProjectBrief): Promise<{
        tasks: TechnicalTask[];
        executionPlan: string;
        aiAnalysis?: string;
    }>;
    executeSpecificTasks(tasks: TechnicalTask[]): Promise<AgentResponse[]>;
    setAIMode(enabled: boolean): void;
    getSystemStatus(): {
        aiMode: boolean;
        geminiConnected: boolean;
        version: string;
    };
    testAIConnection(): Promise<boolean>;
}
//# sourceMappingURL=AIAgentSystem.d.ts.map