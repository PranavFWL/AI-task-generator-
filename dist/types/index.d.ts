export interface ProjectBrief {
    description: string;
    requirements?: string[];
    constraints?: string[];
    timeline?: string;
}
export interface TechnicalTask {
    id: string;
    title: string;
    description: string;
    type: 'frontend' | 'backend' | 'general';
    priority: 'high' | 'medium' | 'low';
    estimatedHours?: number;
    dependencies?: string[];
    acceptance_criteria: string[];
}
export interface AgentResponse {
    success: boolean;
    output: string;
    files?: GeneratedFile[];
    error?: string;
}
export interface GeneratedFile {
    path: string;
    content: string;
    type: 'component' | 'api' | 'schema' | 'config' | 'other';
}
export interface FrontendTaskDetails {
    components: string[];
    styling: 'css' | 'styled-components' | 'tailwind' | 'material-ui';
    responsive: boolean;
    accessibility: boolean;
}
export interface BackendTaskDetails {
    apiType: 'REST' | 'GraphQL';
    database: 'MongoDB' | 'PostgreSQL' | 'MySQL' | 'SQLite';
    authentication: boolean;
    middleware: string[];
}
//# sourceMappingURL=index.d.ts.map