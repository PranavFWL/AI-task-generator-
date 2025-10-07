import { BaseAgent } from './BaseAgent';
import { TechnicalTask, AgentResponse } from '../types';
export declare class FrontendAgent extends BaseAgent {
    constructor();
    executeTask(task: TechnicalTask): Promise<AgentResponse>;
    private generateReactComponents;
    private generateAuthComponents;
    private generateTaskComponents;
    private generateSharingComponents;
    private generateTaskOutput;
}
//# sourceMappingURL=FrontendAgent.d.ts.map