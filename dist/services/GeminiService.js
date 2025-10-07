"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
// Try to import Gemini AI, fallback to mock if not available
let GoogleGenerativeAI;
let dotenv;
try {
    GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
    dotenv = require('dotenv');
}
catch (error) {
    console.log('📦 Gemini AI dependencies not found, using mock implementation');
    // Use dynamic import to avoid compilation errors
}
const MockGeminiService_1 = require("./MockGeminiService");
// Configure dotenv if available
if (dotenv) {
    dotenv.config();
}
class GeminiService {
    constructor() {
        this.mockService = null;
        this.modelInitialized = false;
        // Check if Gemini AI is available
        if (!GoogleGenerativeAI) {
            console.log('🔄 Using Mock Gemini Service (dependencies not installed)');
            this.mockService = new MockGeminiService_1.MockGeminiService();
            return;
        }
        const apiKey = process.env.GEMINI_API_KEY;
        console.log(`🔑 API Key status: ${apiKey ? 'Found (length: ' + apiKey.length + ')' : 'Not found'}`);
        if (!apiKey) {
            console.log('⚠️ GEMINI_API_KEY not found, using Mock Gemini Service');
            this.mockService = new MockGeminiService_1.MockGeminiService();
            return;
        }
        try {
            this.genAI = new GoogleGenerativeAI(apiKey);
            console.log('✅ Gemini AI client initialized (model will be tested on first use)');
        }
        catch (error) {
            console.log('❌ Failed to initialize Gemini AI, using mock service:', error);
            this.mockService = new MockGeminiService_1.MockGeminiService();
        }
    }
    async ensureModelInitialized() {
        if (this.modelInitialized) {
            return;
        }
        // Try different model names in order of preference
        const modelNames = [
            'gemini-2.5-flash',
            'gemini-2.0-flash',
            'gemini-2.5-pro',
            'models/gemini-2.5-flash',
            'models/gemini-2.0-flash',
            'models/gemini-2.5-pro',
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-pro'
        ];
        for (const modelName of modelNames) {
            try {
                console.log(`🧪 Testing model: ${modelName}`);
                const testModel = this.genAI.getGenerativeModel({ model: modelName });
                // Actually test the model with a simple request
                const result = await testModel.generateContent('Hello');
                await result.response; // Ensure we can get the response
                // If we get here, the model works
                this.model = testModel;
                this.modelInitialized = true;
                console.log(`✅ Gemini AI model validated: ${modelName}`);
                return;
            }
            catch (modelError) {
                console.log(`❌ Model ${modelName} failed test: ${modelError.message || modelError}`);
            }
        }
        throw new Error('No working Gemini model found');
    }
    async listAvailableModels() {
        try {
            const models = await this.genAI.listModels();
            console.log('📋 Available models:');
            models.forEach((model) => {
                console.log(`  - ${model.name} (${model.displayName})`);
            });
        }
        catch (error) {
            console.log('❌ Could not list models:', error);
        }
    }
    async analyzeProjectBrief(brief) {
        // Use mock service if Gemini AI is not available
        if (this.mockService) {
            return await this.mockService.analyzeProjectBrief(brief);
        }
        try {
            await this.ensureModelInitialized();
        }
        catch (error) {
            console.log('❌ Failed to initialize working model, using enhanced fallback');
            // Use the enhanced MockGeminiService instead of basic fallback
            if (!this.mockService) {
                this.mockService = new MockGeminiService_1.MockGeminiService();
            }
            return await this.mockService.analyzeProjectBrief(brief);
        }
        const prompt = this.createProjectAnalysisPrompt(brief);
        try {
            console.log('🤖 Analyzing project with Gemini AI...');
            const result = await this.model.generateContent(prompt);
            const response = result.response.text();
            // Parse the AI response and extract tasks
            const tasks = this.parseTasksFromResponse(response);
            console.log(`✅ Gemini generated ${tasks.length} technical tasks`);
            return tasks;
        }
        catch (error) {
            console.error('❌ Gemini AI error:', error);
            // Use enhanced MockGeminiService instead of basic fallback
            console.log('🔄 Using enhanced fallback service...');
            if (!this.mockService) {
                this.mockService = new MockGeminiService_1.MockGeminiService();
            }
            return await this.mockService.analyzeProjectBrief(brief);
        }
    }
    async generateCode(task, agentType) {
        // Use mock service if Gemini AI is not available
        if (this.mockService) {
            return await this.mockService.generateCode(task, agentType);
        }
        try {
            await this.ensureModelInitialized();
        }
        catch (error) {
            console.log('❌ Failed to initialize working model for code generation, using enhanced fallback');
            if (!this.mockService) {
                this.mockService = new MockGeminiService_1.MockGeminiService();
            }
            return await this.mockService.generateCode(task, agentType);
        }
        const prompt = this.createCodeGenerationPrompt(task, agentType);
        try {
            console.log(`🎨 Generating ${agentType} code with Gemini AI...`);
            const result = await this.model.generateContent(prompt);
            const response = result.response.text();
            return this.parseCodeFromResponse(response, agentType);
        }
        catch (error) {
            console.error(`❌ Gemini code generation error:`, error);
            console.log('🔄 Using enhanced fallback for code generation...');
            if (!this.mockService) {
                this.mockService = new MockGeminiService_1.MockGeminiService();
            }
            return await this.mockService.generateCode(task, agentType);
        }
    }
    async enhanceTaskDescription(task) {
        // Use mock service if Gemini AI is not available
        if (this.mockService) {
            return await this.mockService.enhanceTaskDescription(task);
        }
        try {
            await this.ensureModelInitialized();
        }
        catch (error) {
            console.log('❌ Failed to initialize working model for task enhancement, using enhanced fallback');
            if (!this.mockService) {
                this.mockService = new MockGeminiService_1.MockGeminiService();
            }
            return await this.mockService.enhanceTaskDescription(task);
        }
        const prompt = `
Enhance this technical task with more detailed requirements and acceptance criteria:

Task: ${task.title}
Description: ${task.description}
Type: ${task.type}
Priority: ${task.priority}

Provide:
1. Enhanced description with technical details
2. Comprehensive acceptance criteria (5-8 items)
3. Estimated complexity (1-10 scale)
4. Dependencies or prerequisites
5. Testing considerations

Format as JSON with fields: title, description, acceptance_criteria, estimated_hours, dependencies, testing_notes
`;
        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response.text();
            const enhancedData = this.parseEnhancedTask(response);
            return {
                ...task,
                ...enhancedData
            };
        }
        catch (error) {
            console.error('❌ Task enhancement error:', error);
            console.log('🔄 Using enhanced fallback for task enhancement...');
            if (!this.mockService) {
                this.mockService = new MockGeminiService_1.MockGeminiService();
            }
            return await this.mockService.enhanceTaskDescription(task);
        }
    }
    createProjectAnalysisPrompt(brief) {
        return `
You are an expert software architect. Analyze this project brief and break it down into specific technical tasks.

PROJECT BRIEF:
Description: ${brief.description}
Requirements: ${brief.requirements?.join(', ') || 'None specified'}
Constraints: ${brief.constraints?.join(', ') || 'None specified'}
Timeline: ${brief.timeline || 'Not specified'}

INSTRUCTIONS:
1. Create 4-8 technical tasks that cover the full project scope
2. Each task should be either 'frontend' or 'backend' type
3. Assign priority: 'high', 'medium', or 'low'
4. Include specific acceptance criteria for each task
5. Consider modern web development best practices

OUTPUT FORMAT (JSON Array):
[
  {
    "title": "Task Title",
    "description": "Detailed task description",
    "type": "frontend or backend",
    "priority": "high/medium/low",
    "acceptance_criteria": [
      "Specific deliverable 1",
      "Specific deliverable 2",
      "Specific deliverable 3"
    ]
  }
]

Focus on creating tasks that are:
- Specific and actionable
- Properly scoped (not too large or small)
- Technically feasible
- Well-prioritized based on dependencies

Generate the JSON array now:
`;
    }
    createCodeGenerationPrompt(task, agentType) {
        if (agentType === 'frontend') {
            return `
Generate React TypeScript components for this task:

TASK: ${task.title}
DESCRIPTION: ${task.description}
ACCEPTANCE CRITERIA: ${task.acceptance_criteria.join(', ')}

REQUIREMENTS:
- Use React with TypeScript
- Include proper props interfaces
- Add form validation where applicable
- Implement responsive CSS styling
- Include error handling
- Use modern React patterns (hooks, functional components)
- Add accessibility features

OUTPUT FORMAT:
For each file, provide:
\`\`\`typescript
// File: path/to/component.tsx
[component code here]
\`\`\`

\`\`\`css
/* File: path/to/styles.css */
[css code here]
\`\`\`

Generate 2-4 related files that implement the task requirements.
`;
        }
        else {
            return `
Generate Node.js/Express backend code for this task:

TASK: ${task.title}
DESCRIPTION: ${task.description}
ACCEPTANCE CRITERIA: ${task.acceptance_criteria.join(', ')}

REQUIREMENTS:
- Use Express.js with TypeScript
- Include proper request/response types
- Add input validation
- Implement error handling
- Include authentication where needed
- Follow REST API conventions
- Add proper status codes

OUTPUT FORMAT:
For each file, provide:
\`\`\`typescript
// File: path/to/controller.ts
[controller code here]
\`\`\`

\`\`\`typescript
// File: path/to/model.ts
[model code here]
\`\`\`

Generate 2-4 related files that implement the task requirements.
`;
        }
    }
    parseTasksFromResponse(response) {
        try {
            // Extract JSON from the response
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error('No JSON array found in response');
            }
            const tasksData = JSON.parse(jsonMatch[0]);
            return tasksData.map((taskData, index) => ({
                id: `ai_task_${Date.now()}_${index}`,
                title: taskData.title || `AI Generated Task ${index + 1}`,
                description: taskData.description || 'AI generated task description',
                type: taskData.type === 'frontend' ? 'frontend' : 'backend',
                priority: ['high', 'medium', 'low'].includes(taskData.priority) ? taskData.priority : 'medium',
                acceptance_criteria: Array.isArray(taskData.acceptance_criteria)
                    ? taskData.acceptance_criteria
                    : ['Task completion criteria to be defined']
            }));
        }
        catch (error) {
            console.error('❌ Failed to parse AI response:', error);
            throw new Error('Failed to parse AI-generated tasks');
        }
    }
    parseCodeFromResponse(response, agentType) {
        const files = [];
        // Extract code blocks from response
        const codeBlocks = response.match(/```[\s\S]*?```/g) || [];
        codeBlocks.forEach((block, index) => {
            // Extract file path from comment
            const pathMatch = block.match(/\/\/ File: (.+)/);
            const cssMatch = block.match(/\/\* File: (.+) \*\//);
            const path = pathMatch?.[1] || cssMatch?.[1] || `generated_file_${index + 1}.${agentType === 'frontend' ? 'tsx' : 'ts'}`;
            // Extract content (remove the ``` markers and language specification)
            const content = block.replace(/```\w*\n?/, '').replace(/```$/, '').trim();
            const type = path.endsWith('.css') ? 'other' :
                path.endsWith('.tsx') || path.endsWith('.jsx') ? 'component' :
                    path.includes('controller') || path.includes('route') ? 'api' :
                        path.includes('model') || path.includes('schema') ? 'schema' : 'other';
            files.push({ path, content, type });
        });
        // Extract explanation (text that's not in code blocks)
        const explanation = response.replace(/```[\s\S]*?```/g, '').trim();
        return { files, explanation };
    }
    parseEnhancedTask(response) {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const enhancedData = JSON.parse(jsonMatch[0]);
                return {
                    description: enhancedData.description,
                    acceptance_criteria: enhancedData.acceptance_criteria || [],
                    estimatedHours: enhancedData.estimated_hours
                };
            }
        }
        catch (error) {
            console.error('Failed to parse enhanced task:', error);
        }
        return {};
    }
    fallbackTaskGeneration(brief) {
        console.log('🔄 Using fallback task generation...');
        const tasks = [];
        const description = brief.description.toLowerCase();
        // Basic fallback logic (same as before)
        if (description.includes('auth') || description.includes('login') || description.includes('user')) {
            tasks.push({
                id: `fallback_${Date.now()}_1`,
                title: 'Implement Authentication System',
                description: 'Create user registration, login, and authentication',
                type: 'backend',
                priority: 'high',
                acceptance_criteria: ['User registration', 'User login', 'JWT tokens', 'Password security']
            });
        }
        return tasks;
    }
}
exports.GeminiService = GeminiService;
//# sourceMappingURL=GeminiService.js.map