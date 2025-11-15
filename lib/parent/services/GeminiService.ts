// Try to import Gemini AI, fallback to mock if not available
let GoogleGenerativeAI: any;
let dotenv: any;

try {
  GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
  dotenv = require('dotenv');
} catch (error) {
  console.log('📦 Gemini AI dependencies not found, using mock implementation');
  // Use dynamic import to avoid compilation errors
}
import { ProjectBrief, TechnicalTask } from '../types';
import { MockGeminiService } from './MockGeminiService';

// Configure dotenv if available
if (dotenv) {
  dotenv.config();
}

export class GeminiService {
  private genAI: any;
  private model: any;
  private mockService: MockGeminiService | null = null;
  private modelInitialized: boolean = false;

  constructor() {
    // Check if Gemini AI is available
    if (!GoogleGenerativeAI) {
      console.log('[Fallback] Using Mock Gemini Service (dependencies not installed)');
      this.mockService = new MockGeminiService();
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log(`[Key] API Key status: ${apiKey ? 'Found (length: ' + apiKey.length + ')' : 'Not found'}`);
    if (!apiKey) {
      console.log('[Warning] GEMINI_API_KEY not found, using Mock Gemini Service');
      this.mockService = new MockGeminiService();
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      console.log('[Success] Gemini AI client initialized (model will be tested on first use)');
    } catch (error) {
      console.log('[Error] Failed to initialize Gemini AI, using mock service:', error);
      this.mockService = new MockGeminiService();
    }
  }

  private async ensureModelInitialized() {
    if (this.modelInitialized) {
      return;
    }

    // Use gemini-2.0-flash directly (it's free and widely available)
    // Skip testing to save API quota
    const modelName = 'gemini-2.0-flash';

    try {
      console.log(`[Starting] Initializing Gemini model: ${modelName}`);
      this.model = this.genAI.getGenerativeModel({ model: modelName });
      this.modelInitialized = true;
      console.log(`[Success] Gemini AI model initialized: ${modelName}`);
      return;
    } catch (modelError: any) {
      console.log(`[Error] Failed to initialize ${modelName}: ${modelError.message || modelError}`);
      throw new Error(`Failed to initialize Gemini model: ${modelError.message}`);
    }
  }

  private async listAvailableModels() {
    try {
      const models = await this.genAI.listModels();
      console.log('[Project] Available models:');
      models.forEach((model: any) => {
        console.log(`  - ${model.name} (${model.displayName})`);
      });
    } catch (error) {
      console.log('[Error] Could not list models:', error);
    }
  }

  async analyzeProjectBrief(brief: ProjectBrief): Promise<TechnicalTask[]> {
    // Use mock service if Gemini AI is not available
    if (this.mockService) {
      return await this.mockService.analyzeProjectBrief(brief);
    }

    try {
      await this.ensureModelInitialized();
    } catch (error) {
      console.log('[Error] Failed to initialize working model, using enhanced fallback');
      // Use the enhanced MockGeminiService instead of basic fallback
      if (!this.mockService) {
        this.mockService = new MockGeminiService();
      }
      return await this.mockService.analyzeProjectBrief(brief);
    }

    const prompt = this.createProjectAnalysisPrompt(brief);

    try {
      console.log('[AI] Analyzing project with Gemini AI...');
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      // Parse the AI response and extract tasks
      const tasks = this.parseTasksFromResponse(response);

      console.log(`[Success] Gemini generated ${tasks.length} technical tasks`);
      return tasks;

    } catch (error) {
      console.error('[Error] Gemini AI error:', error);
      // Use enhanced MockGeminiService instead of basic fallback
      console.log('[Fallback] Using enhanced fallback service...');
      if (!this.mockService) {
        this.mockService = new MockGeminiService();
      }
      return await this.mockService.analyzeProjectBrief(brief);
    }
  }

  async generateCode(task: TechnicalTask, agentType: 'frontend' | 'backend'): Promise<{
    files: Array<{path: string, content: string, type: string}>,
    explanation: string
  }> {
    // Use mock service if Gemini AI is not available
    if (this.mockService) {
      return await this.mockService.generateCode(task, agentType);
    }

    try {
      await this.ensureModelInitialized();
    } catch (error) {
      console.log('[Error] Failed to initialize working model for code generation, using enhanced fallback');
      if (!this.mockService) {
        this.mockService = new MockGeminiService();
      }
      return await this.mockService.generateCode(task, agentType);
    }

    const prompt = this.createCodeGenerationPrompt(task, agentType);

    try {
      console.log(`[Frontend] Generating ${agentType} code with Gemini AI...`);
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      return this.parseCodeFromResponse(response, agentType);

    } catch (error) {
      console.error(`[Error] Gemini code generation error:`, error);
      console.log('[Fallback] Using enhanced fallback for code generation...');
      if (!this.mockService) {
        this.mockService = new MockGeminiService();
      }
      return await this.mockService.generateCode(task, agentType);
    }
  }

  async enhanceTaskDescription(task: TechnicalTask): Promise<TechnicalTask> {
    // Use mock service if Gemini AI is not available
    if (this.mockService) {
      return await this.mockService.enhanceTaskDescription(task);
    }

    try {
      await this.ensureModelInitialized();
    } catch (error) {
      console.log('[Error] Failed to initialize working model for task enhancement, using enhanced fallback');
      if (!this.mockService) {
        this.mockService = new MockGeminiService();
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

    } catch (error) {
      console.error('[Error] Task enhancement error:', error);
      console.log('[Fallback] Using enhanced fallback for task enhancement...');
      if (!this.mockService) {
        this.mockService = new MockGeminiService();
      }
      return await this.mockService.enhanceTaskDescription(task);
    }
  }

  private createProjectAnalysisPrompt(brief: ProjectBrief): string {
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

  private createCodeGenerationPrompt(task: TechnicalTask, agentType: 'frontend' | 'backend'): string {
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
    } else {
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

  private parseTasksFromResponse(response: string): TechnicalTask[] {
    try {
      // Extract JSON from the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const tasksData = JSON.parse(jsonMatch[0]);

      return tasksData.map((taskData: any, index: number) => ({
        id: `ai_task_${Date.now()}_${index}`,
        title: taskData.title || `AI Generated Task ${index + 1}`,
        description: taskData.description || 'AI generated task description',
        type: taskData.type === 'frontend' ? 'frontend' : 'backend',
        priority: ['high', 'medium', 'low'].includes(taskData.priority) ? taskData.priority : 'medium',
        acceptance_criteria: Array.isArray(taskData.acceptance_criteria)
          ? taskData.acceptance_criteria
          : ['Task completion criteria to be defined']
      }));

    } catch (error) {
      console.error('[Error] Failed to parse AI response:', error);
      throw new Error('Failed to parse AI-generated tasks');
    }
  }

  private parseCodeFromResponse(response: string, agentType: string): {
    files: Array<{path: string, content: string, type: string}>,
    explanation: string
  } {
    const files: Array<{path: string, content: string, type: string}> = [];

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

  private parseEnhancedTask(response: string): Partial<TechnicalTask> {
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
    } catch (error) {
      console.error('Failed to parse enhanced task:', error);
    }
    return {};
  }

  private fallbackTaskGeneration(brief: ProjectBrief): TechnicalTask[] {
    console.log('[Fallback] Using fallback task generation...');

    const tasks: TechnicalTask[] = [];
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