import { TechnicalTask, AgentResponse } from '../types';
export declare abstract class BaseAgent {
    protected name: string;
    protected capabilities: string[];
    constructor(name: string, capabilities: string[]);
    abstract executeTask(task: TechnicalTask): Promise<AgentResponse>;
    getName(): string;
    getCapabilities(): string[];
    canHandleTask(task: TechnicalTask): boolean;
    protected generateTaskId(): string;
    protected validateTask(task: TechnicalTask): boolean;
}
//# sourceMappingURL=BaseAgent.d.ts.map