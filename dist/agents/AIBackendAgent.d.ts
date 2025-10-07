import { BaseAgent } from './BaseAgent';
import { GeminiService } from '../services/GeminiService';
import { TechnicalTask, AgentResponse } from '../types';
export declare class AIBackendAgent extends BaseAgent {
    private geminiService;
    constructor(geminiService?: GeminiService);
    executeTask(task: TechnicalTask): Promise<AgentResponse>;
    private processAIGeneratedFiles;
    private enhanceAICode;
    private addErrorHandling;
    private addInputValidation;
    private addSecurityFeatures;
    private addLoggingAndMonitoring;
    private addAPIDocumentation;
    private enhanceTypeScript;
    private extractRequiredFields;
    private extractModelName;
    private generateModelInterface;
    private determineFileType;
    private ensureProperPath;
    private generateAdditionalFiles;
    private generateMiddlewareFile;
    private generateValidationFile;
    private generateEnvConfigFile;
    private generateMigrationFile;
    private generateTestFile;
    private getEnhancedAuthMiddleware;
    private generateFallbackBackend;
    private getFallbackAuthController;
    private getFallbackTaskController;
    private generateTaskOutput;
}
//# sourceMappingURL=AIBackendAgent.d.ts.map