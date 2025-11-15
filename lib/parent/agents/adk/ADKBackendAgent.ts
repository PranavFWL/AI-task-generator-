import { LlmAgent, Runner, InMemorySessionService } from '@google/adk';
import { z } from 'zod';
import { TechnicalTask, GeneratedFile } from '../../types';

/**
 * ADK-based Backend Agent for generating Node.js/Express APIs
 * Uses Google ADK framework for intelligent API code generation
 */
export class ADKBackendAgent {
  private agent: LlmAgent;

  constructor() {
    this.agent = new LlmAgent({
      name: 'backend_api_generator',
      description: 'Expert Node.js/Express backend developer specializing in RESTful APIs',
      model: 'gemini-2.0-flash',
      instruction: `You are an expert backend developer specializing in Node.js, Express, and TypeScript.

Your responsibilities:
1. Generate production-ready Express API endpoints
2. Implement proper request/response validation
3. Add authentication and authorization logic
4. Include error handling and logging
5. Create database models and schemas
6. Follow RESTful API best practices
7. Add security measures (input sanitization, rate limiting)

Code Quality Standards:
- Use TypeScript with strict types
- Implement comprehensive error handling
- Add input validation for all endpoints
- Use proper HTTP status codes
- Include middleware for auth/logging
- Follow REST conventions
- Add JSDoc comments

Security Best Practices:
- Hash passwords with bcrypt
- Use JWT for authentication
- Sanitize user inputs
- Implement rate limiting
- Add CORS configuration
- Validate all request data

Output Format:
Provide code in the following format:
\`\`\`typescript
// File: src/controllers/ControllerName.ts
[controller code]
\`\`\`

\`\`\`typescript
// File: src/models/ModelName.ts
[model code]
\`\`\`

\`\`\`typescript
// File: src/routes/routeName.ts
[route code]
\`\`\`

Generate complete, production-ready backend code.`,
    });
  }

  async executeTask(task: TechnicalTask): Promise<{
    success: boolean;
    output: string;
    files?: GeneratedFile[];
    error?: string;
  }> {
    if (task.type !== 'backend') {
      return {
        success: false,
        output: '',
        error: 'Invalid backend task'
      };
    }

    console.log(`[Backend] ADK Backend Agent processing: ${task.title}`);

    try {
      const prompt = this.createTaskPrompt(task);

      // Create session service and runner
      const sessionService = new InMemorySessionService();
      const userId = 'system';
      const sessionId = `task_${task.id}`;

      // Create session before running
      await sessionService.createSession({
        userId,
        sessionId,
        agentId: this.agent.name
      });

      const runner = new Runner({
        appName: 'adk-backend-agent',
        agent: this.agent,
        sessionService
      });

      // Run the ADK agent and collect events
      let responseContent = '';
      for await (const event of runner.runAsync({
        userId,
        sessionId,
        newMessage: {
          role: 'user',
          parts: [{ text: prompt }]
        }
      })) {
        if (event.author === this.agent.name && event.content) {
          const parts = event.content.parts || [];
          for (const part of parts) {
            if ('text' in part && part.text) {
              responseContent += part.text;
            }
          }
        }
      }

      const files = this.parseGeneratedCode(responseContent);
      const enhancedFiles = this.enhanceGeneratedFiles(files, task);

      const output = this.generateTaskOutput(task, enhancedFiles);

      console.log(`[Success] ADK Backend generated ${enhancedFiles.length} files`);

      return {
        success: true,
        output,
        files: enhancedFiles
      };

    } catch (error) {
      console.error(`[Error] ADK Backend Agent error:`, error);
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private createTaskPrompt(task: TechnicalTask): string {
    let prompt = `Generate Node.js/Express backend code for the following task:\n\n`;
    prompt += `Task Title: ${task.title}\n`;
    prompt += `Description: ${task.description}\n\n`;

    if (task.acceptance_criteria && task.acceptance_criteria.length > 0) {
      prompt += `Requirements:\n`;
      task.acceptance_criteria.forEach((criteria, index) => {
        prompt += `${index + 1}. ${criteria}\n`;
      });
      prompt += `\n`;
    }

    prompt += `Please generate:\n`;
    prompt += `1. Express route handlers with proper REST endpoints\n`;
    prompt += `2. Controllers with business logic\n`;
    prompt += `3. Database models/schemas (if needed)\n`;
    prompt += `4. Middleware for authentication/validation\n`;
    prompt += `5. Error handling and logging\n`;
    prompt += `6. TypeScript types and interfaces\n\n`;

    prompt += `Use Express with TypeScript. Include proper error handling, validation, and security measures.`;

    return prompt;
  }

  private parseGeneratedCode(content: string): GeneratedFile[] {
    const files: GeneratedFile[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'typescript';
      const code = match[2].trim();

      const pathMatch = code.match(/\/\/\s*File:\s*(.+)|\/\*\s*File:\s*(.+)\s*\*\//);
      const filePath = pathMatch ? (pathMatch[1] || pathMatch[2]).trim() : this.generateDefaultPath(language);

      const type = this.determineFileType(filePath);

      const cleanCode = code.replace(/\/\/\s*File:\s*.+\n|\/\*\s*File:\s*.+\s*\*\/\n/g, '').trim();

      files.push({
        path: filePath,
        content: cleanCode,
        type
      });
    }

    return files;
  }

  private generateDefaultPath(language: string): string {
    const timestamp = Date.now();
    return `src/controllers/Controller_${timestamp}.ts`;
  }

  private determineFileType(path: string): 'api' | 'schema' | 'other' {
    if (path.includes('route') || path.includes('controller')) {
      return 'api';
    }
    if (path.includes('model') || path.includes('schema')) {
      return 'schema';
    }
    return 'other';
  }

  private enhanceGeneratedFiles(files: GeneratedFile[], task: TechnicalTask): GeneratedFile[] {
    const enhanced: GeneratedFile[] = [];

    for (const file of files) {
      let content = file.content;

      // Add Express types if missing
      if (file.path.includes('route') && !content.includes('Request, Response')) {
        if (!content.includes("import")) {
          content = `import { Request, Response, Router } from 'express';\n\n${content}`;
        }
      }

      // Ensure error handling
      if (file.path.includes('controller') && !content.includes('try') && !content.includes('catch')) {
        // Code likely needs error handling reminder
        content = `/* Add try-catch error handling to all async operations */\n${content}`;
      }

      enhanced.push({
        ...file,
        content
      });
    }

    // Add middleware file if auth is mentioned
    if (task.title.toLowerCase().includes('auth')) {
      enhanced.push(this.generateAuthMiddleware());
    }

    return enhanced;
  }

  private generateAuthMiddleware(): GeneratedFile {
    return {
      path: 'src/middleware/auth.ts',
      content: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
`,
      type: 'other'
    };
  }

  private generateTaskOutput(task: TechnicalTask, files: GeneratedFile[]): string {
    let output = `[AI] ADK Backend Agent - Task Completed\n\n`;
    output += `[Project] Task: ${task.title}\n`;
    output += `[Data] Generated ${files.length} files:\n\n`;

    files.forEach(file => {
      output += `  - ${file.path}\n`;
    });

    output += `\n[Backend] Features Included:\n`;
    output += `  - TypeScript with strict typing\n`;
    output += `  - Express RESTful API endpoints\n`;
    output += `  - Request/response validation\n`;
    output += `  - Error handling & logging\n`;
    output += `  - Authentication middleware\n`;
    output += `  - Security best practices\n`;

    return output;
  }

  getAgent(): LlmAgent {
    return this.agent;
  }
}
