import { BaseAgent } from './BaseAgent';
import { GeminiService } from '../services/GeminiService';
import { TechnicalTask, AgentResponse } from '../types';
export declare class AIFrontendAgent extends BaseAgent {
    private geminiService;
    constructor(geminiService?: GeminiService);
    executeTask(task: TechnicalTask): Promise<AgentResponse>;
    private processAIGeneratedFiles;
    private enhanceAICode;
    private generatePropsInterface;
    private inferPropType;
    private addErrorHandling;
    private enhanceAccessibility;
    private addResponsiveDesign;
    private determineFileType;
    private ensureProperPath;
    private extractComponentName;
    private generateAdditionalFiles;
    private generateTypesFile;
    private generateIndexFile;
    private generateStoryFile;
    private generateFallbackComponents;
    private getFallbackLoginComponent;
    private getFallbackTaskComponent;
    private generateTaskOutput;
}
//# sourceMappingURL=AIFrontendAgent.d.ts.map