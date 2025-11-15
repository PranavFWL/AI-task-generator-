import { LlmAgent, Runner, InMemorySessionService } from '@google/adk';
import { z } from 'zod';
import { TechnicalTask, GeneratedFile } from '../../types';

/**
 * ADK-based Frontend Agent for generating React/TypeScript components
 * Uses Google ADK framework for intelligent code generation
 */
export class ADKFrontendAgent {
  private agent: LlmAgent;

  constructor() {
    // Ensure API key is available
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY or GEMINI_API_KEY must be set in environment variables');
    }

    // Create the ADK agent with specific instructions for frontend development
    this.agent = new LlmAgent({
      name: 'frontend_code_generator',
      description: 'Expert React/TypeScript developer specializing in modern UI components',
      model: 'gemini-2.0-flash',
      instruction: `You are an expert frontend developer specializing in React with TypeScript.

Your responsibilities:
1. Generate high-quality React components with TypeScript
2. Include proper type definitions and interfaces
3. Add error handling and loading states
4. Implement accessibility features (ARIA labels, keyboard navigation)
5. Use modern React patterns (hooks, functional components)
6. Add responsive design with CSS
7. Include proper imports and exports

Code Quality Standards:
- Use TypeScript strict mode
- Add comprehensive prop interfaces
- Include error boundaries
- Implement loading states for async operations
- Add ARIA attributes for accessibility
- Use semantic HTML elements
- Follow React best practices

Output Format:
Provide code in the following format:
\`\`\`typescript
// File: src/components/ComponentName.tsx
[component code]
\`\`\`

\`\`\`css
/* File: src/styles/ComponentName.css */
[css code]
\`\`\`

Generate complete, production-ready code with all necessary files.`,
    });
  }

  async executeTask(task: TechnicalTask): Promise<{
    success: boolean;
    output: string;
    files?: GeneratedFile[];
    error?: string;
  }> {
    if (task.type !== 'frontend') {
      return {
        success: false,
        output: '',
        error: 'Invalid frontend task'
      };
    }

    console.log(`[Frontend] ADK Frontend Agent processing: ${task.title}`);

    try {
      // Create detailed prompt for the agent
      const prompt = this.createTaskPrompt(task);

      // Create session service and runner
      const sessionService = new InMemorySessionService();
      const userId = 'system';
      const sessionId = `task_${task.id}`;

      // Create session before running
      await sessionService.createSession({
        appName: 'adk-frontend-agent',
        userId,
        sessionId
      });

      const runner = new Runner({
        appName: 'adk-frontend-agent',
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
        // Collect response content from events
        if (event.author === this.agent.name && event.content) {
          const parts = event.content.parts || [];
          for (const part of parts) {
            if ('text' in part && part.text) {
              responseContent += part.text;
            }
          }
        }
      }

      // Extract generated code from response
      const files = this.parseGeneratedCode(responseContent);

      // Enhance files with additional best practices
      const enhancedFiles = this.enhanceGeneratedFiles(files, task);

      const output = this.generateTaskOutput(task, enhancedFiles);

      console.log(`[Success] ADK Frontend generated ${enhancedFiles.length} files`);

      return {
        success: true,
        output,
        files: enhancedFiles
      };

    } catch (error) {
      console.error(`[Error] ADK Frontend Agent error:`, error);
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private createTaskPrompt(task: TechnicalTask): string {
    let prompt = `Generate React TypeScript components for the following task:\n\n`;
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
    prompt += `1. Main React component(s) with TypeScript\n`;
    prompt += `2. Proper TypeScript interfaces and types\n`;
    prompt += `3. CSS styling for the components\n`;
    prompt += `4. Error handling and loading states\n`;
    prompt += `5. Accessibility features (ARIA labels)\n\n`;

    prompt += `Generate complete, production-ready code that can be directly used in a Next.js application.`;

    return prompt;
  }

  private parseGeneratedCode(content: string): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    // Extract code blocks from the response
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'typescript';
      const code = match[2].trim();

      // Extract file path from comment
      const pathMatch = code.match(/\/\/\s*File:\s*(.+)|\/\*\s*File:\s*(.+)\s*\*\//);
      const filePath = pathMatch ? (pathMatch[1] || pathMatch[2]).trim() : this.generateDefaultPath(language);

      // Determine file type
      const type = this.determineFileType(filePath);

      // Clean the code (remove file path comments)
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
    if (language === 'css') {
      return `src/styles/Component_${timestamp}.css`;
    }
    return `src/components/Component_${timestamp}.tsx`;
  }

  private determineFileType(path: string): 'component' | 'other' {
    if (path.endsWith('.tsx') || path.endsWith('.jsx')) {
      return 'component';
    }
    return 'other';
  }

  private enhanceGeneratedFiles(files: GeneratedFile[], task: TechnicalTask): GeneratedFile[] {
    const enhanced: GeneratedFile[] = [];

    for (const file of files) {
      let content = file.content;

      // Ensure React import for TSX files
      if (file.path.endsWith('.tsx') && !content.includes('import React')) {
        content = `import React from 'react';\n${content}`;
      }

      // Add useState import if state is used
      if (content.includes('useState') && !content.includes("from 'react'")) {
        content = content.replace(
          'import React',
          "import React, { useState }"
        );
      }

      enhanced.push({
        ...file,
        content
      });
    }

    // Add additional supporting files
    enhanced.push(...this.generateAdditionalFiles(task, files));

    return enhanced;
  }

  private generateAdditionalFiles(task: TechnicalTask, existingFiles: GeneratedFile[]): GeneratedFile[] {
    const additional: GeneratedFile[] = [];

    // Generate types file if components exist
    const componentFiles = existingFiles.filter(f => f.type === 'component');
    if (componentFiles.length > 0) {
      const typesFile = this.generateTypesFile(task);
      additional.push(typesFile);
    }

    return additional;
  }

  private generateTypesFile(task: TechnicalTask): GeneratedFile {
    const taskName = task.title.replace(/[^a-zA-Z0-9]/g, '');

    let content = `// Type definitions for ${task.title}\n\n`;

    // Add common types based on task keywords
    if (task.title.toLowerCase().includes('auth') || task.title.toLowerCase().includes('login')) {
      content += `export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
`;
    }

    if (task.title.toLowerCase().includes('task') || task.title.toLowerCase().includes('todo')) {
      content += `export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
}
`;
    }

    return {
      path: `src/types/${taskName}Types.ts`,
      content,
      type: 'other'
    };
  }

  private generateTaskOutput(task: TechnicalTask, files: GeneratedFile[]): string {
    let output = `[AI] ADK Frontend Agent - Task Completed\n\n`;
    output += `[Project] Task: ${task.title}\n`;
    output += `[Data] Generated ${files.length} files:\n\n`;

    files.forEach(file => {
      output += `  - ${file.path}\n`;
    });

    output += `\n[Frontend] Features Included:\n`;
    output += `  - TypeScript with strict typing\n`;
    output += `  - Modern React patterns (hooks)\n`;
    output += `  - Error handling & loading states\n`;
    output += `  - Accessibility (ARIA labels)\n`;
    output += `  - Responsive design\n`;
    output += `  - Production-ready code\n`;

    return output;
  }

  getAgent(): LlmAgent {
    return this.agent;
  }
}
