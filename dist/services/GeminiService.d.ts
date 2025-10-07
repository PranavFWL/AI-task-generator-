import { ProjectBrief, TechnicalTask } from '../types';
export declare class GeminiService {
    private genAI;
    private model;
    private mockService;
    private modelInitialized;
    constructor();
    private ensureModelInitialized;
    private listAvailableModels;
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
    private createProjectAnalysisPrompt;
    private createCodeGenerationPrompt;
    private parseTasksFromResponse;
    private parseCodeFromResponse;
    private parseEnhancedTask;
    private fallbackTaskGeneration;
}
//# sourceMappingURL=GeminiService.d.ts.map