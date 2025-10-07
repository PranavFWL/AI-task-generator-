import { BaseAgent } from './BaseAgent';
import { ProjectBrief, TechnicalTask, AgentResponse } from '../types';
export declare class CoordinatorAgent extends BaseAgent {
    private frontendAgent;
    private backendAgent;
    private taskQueue;
    private completedTasks;
    constructor();
    processProjectBrief(brief: ProjectBrief): Promise<{
        tasks: TechnicalTask[];
        executionPlan: string;
    }>;
    executeProject(brief: ProjectBrief): Promise<{
        results: AgentResponse[];
        summary: string;
    }>;
    executeTask(task: TechnicalTask): Promise<AgentResponse>;
    private breakdownProject;
    private createExecutionPlan;
    private generateProjectSummary;
}
//# sourceMappingURL=CoordinatorAgent.d.ts.map