import { BaseAgent } from './BaseAgent';
import { TechnicalTask, AgentResponse } from '../types';
export declare class BackendAgent extends BaseAgent {
    constructor();
    executeTask(task: TechnicalTask): Promise<AgentResponse>;
    private generateBackendCode;
    private generateAuthBackend;
    private generateTaskBackend;
    private generateSharingBackend;
    private generateAPIFoundation;
    private generateDatabaseSchema;
    private generateTaskOutput;
}
//# sourceMappingURL=BackendAgent.d.ts.map