import { ProjectBrief, TechnicalTask } from '../types';
export declare class MockGeminiService {
    private isConnected;
    constructor();
    analyzeProjectBrief(brief: ProjectBrief): Promise<TechnicalTask[]>;
    generateCode(task: TechnicalTask, agentType: 'frontend' | 'backend'): Promise<{
        files: Array<{
            path: string;
            content: string;
            type: string;
        }>;
        explanation: string;
    }>;
    enhanceTaskDescription(task: TechnicalTask): Promise<TechnicalTask>;
    private delay;
    private generateEnhancedTasks;
    private generateMockFrontendCode;
    private generateMockBackendCode;
    private calculateEstimatedHours;
    private generateTaskId;
    private getEnhancedLoginComponent;
    private getModernAuthStyles;
    private getAdvancedDashboardComponent;
    private getEnhancedAuthController;
    private getAdvancedAuthMiddleware;
    private getAdvancedTaskController;
}
//# sourceMappingURL=MockGeminiService.d.ts.map