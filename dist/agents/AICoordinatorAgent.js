"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AICoordinatorAgent = void 0;
const BaseAgent_1 = require("./BaseAgent");
const AIFrontendAgent_1 = require("./AIFrontendAgent");
const AIBackendAgent_1 = require("./AIBackendAgent");
const GeminiService_1 = require("../services/GeminiService");
class AICoordinatorAgent extends BaseAgent_1.BaseAgent {
    constructor() {
        super('AI Coordinator', ['ai_coordination', 'intelligent_task_breakdown', 'project_analysis']);
        this.taskQueue = [];
        this.completedTasks = [];
        this.geminiService = new GeminiService_1.GeminiService();
        this.frontendAgent = new AIFrontendAgent_1.AIFrontendAgent(this.geminiService);
        this.backendAgent = new AIBackendAgent_1.AIBackendAgent(this.geminiService);
    }
    async processProjectBrief(brief) {
        console.log('🧠 AI Coordinator analyzing project brief...');
        try {
            // Use Gemini AI to analyze the project and generate tasks
            const aiTasks = await this.geminiService.analyzeProjectBrief(brief);
            // Enhance each task with more detailed requirements
            const enhancedTasks = await Promise.all(aiTasks.map(task => this.geminiService.enhanceTaskDescription(task)));
            const executionPlan = this.createAIExecutionPlan(enhancedTasks, brief);
            const aiAnalysis = this.generateAIAnalysis(brief, enhancedTasks);
            console.log(`✅ AI generated ${enhancedTasks.length} enhanced technical tasks`);
            return {
                tasks: enhancedTasks,
                executionPlan,
                aiAnalysis
            };
        }
        catch (error) {
            console.warn('⚠️ AI analysis failed, using fallback approach:', error);
            // Fallback to rule-based approach
            const fallbackTasks = this.fallbackBreakdownProject(brief);
            const executionPlan = this.createAIExecutionPlan(fallbackTasks, brief);
            return {
                tasks: fallbackTasks,
                executionPlan,
                aiAnalysis: 'Used fallback analysis due to AI service error.'
            };
        }
    }
    async executeProject(brief) {
        console.log('🚀 AI Coordinator executing project...');
        const { tasks, aiAnalysis } = await this.processProjectBrief(brief);
        const results = [];
        for (const task of tasks) {
            console.log(`\n🔧 AI processing: ${task.title}`);
            try {
                const result = await this.executeTask(task);
                results.push(result);
                if (result.success) {
                    this.completedTasks.push(task);
                    console.log(`✅ AI completed: ${task.title}`);
                }
                else {
                    console.log(`❌ AI failed: ${task.title} - ${result.error}`);
                }
            }
            catch (error) {
                console.log(`💥 AI error: ${task.title} - ${error}`);
                results.push({
                    success: false,
                    output: '',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
        const summary = this.generateProjectSummary(results);
        const aiInsights = this.generateAIInsights(results, tasks);
        return { results, summary, aiInsights };
    }
    async executeTask(task) {
        if (!this.validateTask(task)) {
            return {
                success: false,
                output: '',
                error: 'Invalid task provided'
            };
        }
        try {
            switch (task.type) {
                case 'frontend':
                    return await this.frontendAgent.executeTask(task);
                case 'backend':
                    return await this.backendAgent.executeTask(task);
                default:
                    return {
                        success: false,
                        output: '',
                        error: `Unknown task type: ${task.type}`
                    };
            }
        }
        catch (error) {
            console.error(`Task execution error:`, error);
            return {
                success: false,
                output: '',
                error: error instanceof Error ? error.message : 'Task execution failed'
            };
        }
    }
    createAIExecutionPlan(tasks, brief) {
        const backendTasks = tasks.filter(t => t.type === 'backend');
        const frontendTasks = tasks.filter(t => t.type === 'frontend');
        let plan = `🤖 AI-Generated Execution Plan\n`;
        plan += `=====================================\n\n`;
        plan += `📋 Project Overview:\n`;
        plan += `${brief.description}\n\n`;
        if (brief.requirements && brief.requirements.length > 0) {
            plan += `📌 Key Requirements:\n`;
            brief.requirements.forEach(req => plan += `• ${req}\n`);
            plan += `\n`;
        }
        plan += `🏗️ Phase 1 - Backend Development (${backendTasks.length} tasks):\n`;
        backendTasks.forEach((task, index) => {
            plan += `  ${index + 1}. ${task.title} [${task.priority} priority]\n`;
            if (task.estimatedHours) {
                plan += `     ⏱️ Estimated: ${task.estimatedHours} hours\n`;
            }
        });
        plan += `\n🎨 Phase 2 - Frontend Development (${frontendTasks.length} tasks):\n`;
        frontendTasks.forEach((task, index) => {
            plan += `  ${index + 1}. ${task.title} [${task.priority} priority]\n`;
            if (task.estimatedHours) {
                plan += `     ⏱️ Estimated: ${task.estimatedHours} hours\n`;
            }
        });
        const totalEstimated = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
        if (totalEstimated > 0) {
            plan += `\n⏰ Total Estimated Time: ${totalEstimated} hours\n`;
        }
        plan += `\n📊 Total Tasks: ${tasks.length}`;
        return plan;
    }
    generateAIAnalysis(brief, tasks) {
        let analysis = `🧠 AI Project Analysis\n`;
        analysis += `======================\n\n`;
        analysis += `🎯 Project Complexity: ${this.assessComplexity(tasks)}\n`;
        analysis += `🏗️ Architecture Pattern: ${this.identifyArchitecture(brief, tasks)}\n`;
        analysis += `🔧 Technology Stack: ${this.identifyTechStack(tasks)}\n`;
        analysis += `⚠️ Risk Factors: ${this.identifyRisks(brief, tasks)}\n`;
        analysis += `💡 Recommendations: ${this.generateRecommendations(brief, tasks)}\n`;
        return analysis;
    }
    generateAIInsights(results, tasks) {
        const successful = results.filter(r => r.success).length;
        const failed = results.length - successful;
        const totalFiles = results.reduce((sum, r) => sum + (r.files?.length || 0), 0);
        let insights = `🔮 AI Execution Insights\n`;
        insights += `========================\n\n`;
        insights += `📈 Success Rate: ${Math.round((successful / results.length) * 100)}%\n`;
        insights += `📁 Files Generated: ${totalFiles}\n`;
        insights += `🎯 Task Completion: ${successful}/${results.length}\n\n`;
        if (failed > 0) {
            insights += `⚠️ Areas for Improvement:\n`;
            results.forEach((result, index) => {
                if (!result.success) {
                    insights += `• ${tasks[index]?.title}: ${result.error}\n`;
                }
            });
            insights += `\n`;
        }
        insights += `💡 AI Recommendations:\n`;
        if (successful === results.length) {
            insights += `• Excellent execution! All tasks completed successfully.\n`;
            insights += `• Consider adding automated testing for the generated code.\n`;
            insights += `• Review code quality and optimize for production deployment.\n`;
        }
        else {
            insights += `• Review failed tasks and retry with more specific requirements.\n`;
            insights += `• Consider breaking down complex tasks into smaller chunks.\n`;
            insights += `• Verify API connections and dependencies.\n`;
        }
        return insights;
    }
    assessComplexity(tasks) {
        const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;
        const totalTasks = tasks.length;
        if (totalTasks <= 3)
            return 'Simple';
        if (totalTasks <= 6)
            return 'Moderate';
        if (highPriorityTasks > totalTasks * 0.6)
            return 'High';
        return 'Complex';
    }
    identifyArchitecture(brief, tasks) {
        const hasAuth = tasks.some(t => t.title.toLowerCase().includes('auth'));
        const hasAPI = tasks.some(t => t.type === 'backend');
        const hasFrontend = tasks.some(t => t.type === 'frontend');
        if (hasAuth && hasAPI && hasFrontend)
            return 'Full-Stack MVC';
        if (hasAPI && hasFrontend)
            return 'Client-Server';
        if (hasAPI)
            return 'API-First';
        return 'Component-Based';
    }
    identifyTechStack(tasks) {
        const stack = [];
        if (tasks.some(t => t.type === 'frontend'))
            stack.push('React+TypeScript');
        if (tasks.some(t => t.type === 'backend'))
            stack.push('Node.js+Express');
        if (tasks.some(t => t.title.toLowerCase().includes('database')))
            stack.push('Database');
        if (tasks.some(t => t.title.toLowerCase().includes('auth')))
            stack.push('JWT Auth');
        return stack.join(', ') || 'To be determined';
    }
    identifyRisks(brief, tasks) {
        const risks = [];
        if (tasks.length > 8)
            risks.push('Scope complexity');
        if (tasks.filter(t => t.priority === 'high').length > 4)
            risks.push('High priority overload');
        if (brief.timeline && brief.timeline.includes('week'))
            risks.push('Tight timeline');
        if (!tasks.some(t => t.title.toLowerCase().includes('test')))
            risks.push('No testing strategy');
        return risks.length > 0 ? risks.join(', ') : 'Low risk project';
    }
    generateRecommendations(brief, tasks) {
        const recommendations = [];
        if (!tasks.some(t => t.title.toLowerCase().includes('test'))) {
            recommendations.push('Add testing tasks');
        }
        if (!tasks.some(t => t.title.toLowerCase().includes('deploy'))) {
            recommendations.push('Consider deployment strategy');
        }
        if (tasks.length > 6) {
            recommendations.push('Consider MVP approach for initial release');
        }
        recommendations.push('Implement CI/CD pipeline');
        recommendations.push('Add error monitoring and logging');
        return recommendations.join(', ');
    }
    fallbackBreakdownProject(brief) {
        // Same logic as original CoordinatorAgent but with AI-enhanced structure
        const tasks = [];
        const description = brief.description.toLowerCase();
        if (description.includes('auth') || description.includes('login') || description.includes('user')) {
            tasks.push({
                id: this.generateTaskId(),
                title: 'Implement User Authentication System',
                description: 'Create comprehensive user registration, login, and authentication system with security best practices',
                type: 'backend',
                priority: 'high',
                acceptance_criteria: [
                    'User registration endpoint with validation',
                    'Secure login endpoint with rate limiting',
                    'JWT token generation and refresh',
                    'Password hashing with bcrypt',
                    'Authentication middleware for protected routes',
                    'User profile management endpoints'
                ],
                estimatedHours: 12
            });
        }
        return tasks;
    }
    generateProjectSummary(results) {
        const successful = results.filter(r => r.success).length;
        const failed = results.length - successful;
        const totalFiles = results.reduce((sum, r) => sum + (r.files?.length || 0), 0);
        let summary = `🤖 AI Project Execution Summary\n`;
        summary += `================================\n`;
        summary += `📊 Total tasks: ${results.length}\n`;
        summary += `✅ Successful: ${successful}\n`;
        summary += `❌ Failed: ${failed}\n`;
        summary += `📁 Files generated: ${totalFiles}\n`;
        if (failed > 0) {
            summary += `\n⚠️ Failed tasks:\n`;
            results.forEach((result, index) => {
                if (!result.success) {
                    summary += `• Task ${index + 1}: ${result.error}\n`;
                }
            });
        }
        return summary;
    }
}
exports.AICoordinatorAgent = AICoordinatorAgent;
//# sourceMappingURL=AICoordinatorAgent.js.map