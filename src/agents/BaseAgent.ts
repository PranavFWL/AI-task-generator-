import { TechnicalTask, AgentResponse } from '../types';

export abstract class BaseAgent {
  protected name: string;
  protected capabilities: string[];

  constructor(name: string, capabilities: string[]) {
    this.name = name;
    this.capabilities = capabilities;
  }

  abstract executeTask(task: TechnicalTask): Promise<AgentResponse>;

  getName(): string {
    return this.name;
  }

  getCapabilities(): string[] {
    return this.capabilities;
  }

  canHandleTask(task: TechnicalTask): boolean {
    return this.capabilities.includes(task.type);
  }

  protected generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  protected validateTask(task: TechnicalTask): boolean {
    return !!(task.title && task.description && task.type);
  }
}