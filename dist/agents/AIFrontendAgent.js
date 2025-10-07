"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIFrontendAgent = void 0;
const BaseAgent_1 = require("./BaseAgent");
const GeminiService_1 = require("../services/GeminiService");
class AIFrontendAgent extends BaseAgent_1.BaseAgent {
    constructor(geminiService) {
        super('AI Frontend Agent', ['ai_frontend', 'react_generation', 'ui_components']);
        this.geminiService = geminiService || new GeminiService_1.GeminiService();
    }
    async executeTask(task) {
        if (!this.validateTask(task) || task.type !== 'frontend') {
            return {
                success: false,
                output: '',
                error: 'Invalid frontend task'
            };
        }
        console.log(`🎨 AI Frontend Agent processing: ${task.title}`);
        try {
            // Use AI to generate code
            const aiResult = await this.geminiService.generateCode(task, 'frontend');
            // Process and enhance the AI-generated code
            const processedFiles = await this.processAIGeneratedFiles(aiResult.files, task);
            const output = this.generateTaskOutput(task, processedFiles, aiResult.explanation);
            console.log(`✅ AI Frontend generated ${processedFiles.length} files`);
            return {
                success: true,
                output,
                files: processedFiles
            };
        }
        catch (error) {
            console.warn(`⚠️ AI generation failed, using fallback for: ${task.title}`);
            // Fallback to rule-based generation if AI fails
            try {
                const fallbackFiles = await this.generateFallbackComponents(task);
                const output = this.generateTaskOutput(task, fallbackFiles, 'Generated using fallback templates');
                return {
                    success: true,
                    output,
                    files: fallbackFiles
                };
            }
            catch (fallbackError) {
                return {
                    success: false,
                    output: '',
                    error: `AI and fallback generation failed: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`
                };
            }
        }
    }
    async processAIGeneratedFiles(aiFiles, task) {
        const processedFiles = [];
        for (const aiFile of aiFiles) {
            // Enhance and validate the AI-generated code
            const enhancedContent = this.enhanceAICode(aiFile.content, aiFile.path, task);
            // Determine proper file type
            const fileType = this.determineFileType(aiFile.path, aiFile.content);
            // Ensure proper file path structure
            const properPath = this.ensureProperPath(aiFile.path, fileType);
            processedFiles.push({
                path: properPath,
                content: enhancedContent,
                type: fileType
            });
        }
        // Add additional files if needed (types, tests, etc.)
        const additionalFiles = await this.generateAdditionalFiles(task, processedFiles);
        processedFiles.push(...additionalFiles);
        return processedFiles;
    }
    enhanceAICode(content, filePath, task) {
        let enhancedContent = content;
        // Add proper imports if missing
        if (filePath.endsWith('.tsx') && !content.includes('import React')) {
            enhancedContent = `import React from 'react';\n${enhancedContent}`;
        }
        // Add TypeScript interfaces if missing
        if (filePath.endsWith('.tsx') && !content.includes('interface') && content.includes('Props')) {
            const componentName = this.extractComponentName(filePath);
            const propsInterface = this.generatePropsInterface(content, componentName);
            enhancedContent = `${propsInterface}\n\n${enhancedContent}`;
        }
        // Add error boundaries and loading states
        if (content.includes('async') || content.includes('fetch')) {
            enhancedContent = this.addErrorHandling(enhancedContent);
        }
        // Ensure accessibility attributes
        if (content.includes('<form') || content.includes('<input')) {
            enhancedContent = this.enhanceAccessibility(enhancedContent);
        }
        // Add responsive design considerations
        if (filePath.endsWith('.css') || content.includes('className')) {
            enhancedContent = this.addResponsiveDesign(enhancedContent, filePath);
        }
        return enhancedContent;
    }
    generatePropsInterface(content, componentName) {
        // Extract prop usage from component to generate interface
        const propMatches = content.match(/props\.(\w+)/g) || [];
        const uniqueProps = [...new Set(propMatches.map(match => match.split('.')[1]))];
        if (uniqueProps.length === 0)
            return '';
        let propsInterface = `interface ${componentName}Props {\n`;
        uniqueProps.forEach(prop => {
            // Basic type inference
            const propType = this.inferPropType(content, prop);
            propsInterface += `  ${prop}: ${propType};\n`;
        });
        propsInterface += '}';
        return propsInterface;
    }
    inferPropType(content, propName) {
        if (content.includes(`props.${propName}(`))
            return 'Function';
        if (content.includes(`props.${propName}.map`))
            return 'any[]';
        if (content.includes(`props.${propName} &&`))
            return 'boolean';
        if (content.includes(`{props.${propName}}`))
            return 'string | number';
        return 'any';
    }
    addErrorHandling(content) {
        if (content.includes('try {') || content.includes('catch')) {
            return content; // Already has error handling
        }
        // Add basic error state handling
        const errorStateAddition = `
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);`;
        // Insert after existing useState declarations or at the beginning of component
        const useStateRegex = /(\s*const \[.*?\] = useState.*?;\s*)/g;
        const matches = content.match(useStateRegex);
        if (matches) {
            const lastUseState = matches[matches.length - 1];
            return content.replace(lastUseState, lastUseState + errorStateAddition);
        }
        return content.replace(/(\w+Component.*?\{)/, `$1${errorStateAddition}`);
    }
    enhanceAccessibility(content) {
        let enhanced = content;
        // Add labels for inputs
        enhanced = enhanced.replace(/<input([^>]*?)type="([^"]*)"([^>]*?)>/g, '<input$1type="$2"$3 aria-label="$2 input">');
        // Add ARIA attributes
        enhanced = enhanced.replace(/<form([^>]*?)>/g, '<form$1 role="form">');
        // Add keyboard navigation
        enhanced = enhanced.replace(/<button([^>]*?)>/g, '<button$1 tabIndex={0}>');
        return enhanced;
    }
    addResponsiveDesign(content, filePath) {
        if (filePath.endsWith('.css')) {
            // Add responsive breakpoints
            if (!content.includes('@media')) {
                content += `

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0.5rem;
  }
}`;
            }
        }
        return content;
    }
    determineFileType(path, content) {
        if (path.endsWith('.tsx') || path.endsWith('.jsx'))
            return 'component';
        return 'other';
    }
    ensureProperPath(originalPath, fileType) {
        // Ensure paths start with src/components for components
        if (fileType === 'component' && !originalPath.startsWith('src/')) {
            const fileName = originalPath.split('/').pop() || originalPath;
            return `src/components/${fileName}`;
        }
        // Ensure CSS files are in proper location
        if (originalPath.endsWith('.css') && !originalPath.startsWith('src/')) {
            const fileName = originalPath.split('/').pop() || originalPath;
            return `src/styles/${fileName}`;
        }
        return originalPath.startsWith('src/') ? originalPath : `src/${originalPath}`;
    }
    extractComponentName(filePath) {
        const fileName = filePath.split('/').pop() || filePath;
        return fileName.replace(/\.(tsx|jsx)$/, '');
    }
    async generateAdditionalFiles(task, existingFiles) {
        const additionalFiles = [];
        // Generate TypeScript types file
        const hasComponents = existingFiles.some(f => f.type === 'component');
        if (hasComponents) {
            const typesFile = this.generateTypesFile(task, existingFiles);
            additionalFiles.push(typesFile);
        }
        // Generate index file for easy imports
        const componentFiles = existingFiles.filter(f => f.type === 'component');
        if (componentFiles.length > 1) {
            const indexFile = this.generateIndexFile(componentFiles);
            additionalFiles.push(indexFile);
        }
        // Generate story file for Storybook (if applicable)
        if (componentFiles.length > 0 && task.title.toLowerCase().includes('component')) {
            const storyFile = this.generateStoryFile(componentFiles[0], task);
            additionalFiles.push(storyFile);
        }
        return additionalFiles;
    }
    generateTypesFile(task, files) {
        const taskName = task.title.replace(/[^a-zA-Z0-9]/g, '');
        let typesContent = `// Types for ${task.title}\n\n`;
        // Extract interfaces from components
        files.forEach(file => {
            if (file.type === 'component') {
                const interfaceMatches = file.content.match(/interface \w+Props \{[\s\S]*?\}/g);
                if (interfaceMatches) {
                    interfaceMatches.forEach(interfaceCode => {
                        typesContent += `export ${interfaceCode}\n\n`;
                    });
                }
            }
        });
        // Add common types based on task
        if (task.title.toLowerCase().includes('auth')) {
            typesContent += `export interface User {
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

export interface RegisterData extends LoginCredentials {
  name: string;
}
`;
        }
        if (task.title.toLowerCase().includes('task')) {
            typesContent += `export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
}
`;
        }
        return {
            path: `src/types/${taskName}Types.ts`,
            content: typesContent,
            type: 'other'
        };
    }
    generateIndexFile(componentFiles) {
        let indexContent = '// Component exports\n\n';
        componentFiles.forEach(file => {
            const componentName = this.extractComponentName(file.path);
            const relativePath = `./${componentName}`;
            indexContent += `export { ${componentName} } from '${relativePath}';\n`;
        });
        return {
            path: 'src/components/index.ts',
            content: indexContent,
            type: 'other'
        };
    }
    generateStoryFile(componentFile, task) {
        const componentName = this.extractComponentName(componentFile.path);
        const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props here
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    error: 'Sample error message',
  },
};
`;
        return {
            path: `src/components/${componentName}.stories.ts`,
            content: storyContent,
            type: 'other'
        };
    }
    async generateFallbackComponents(task) {
        // Use the original FrontendAgent logic as fallback
        const files = [];
        const taskTitle = task.title.toLowerCase();
        if (taskTitle.includes('auth') || taskTitle.includes('login')) {
            // Use simplified fallback auth components
            files.push({
                path: 'src/components/auth/LoginForm.tsx',
                type: 'component',
                content: this.getFallbackLoginComponent()
            });
        }
        if (taskTitle.includes('task') || taskTitle.includes('todo')) {
            files.push({
                path: 'src/components/tasks/TaskList.tsx',
                type: 'component',
                content: this.getFallbackTaskComponent()
            });
        }
        return files;
    }
    getFallbackLoginComponent() {
        return `import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await onLogin(email, password);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}

      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};`;
    }
    getFallbackTaskComponent() {
        return `import React from 'react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleTask }) => {
  if (tasks.length === 0) {
    return <div>No tasks available.</div>;
  }

  return (
    <div className="task-list">
      <h2>Tasks</h2>
      {tasks.map(task => (
        <div key={task.id} className="task-item">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleTask(task.id)}
          />
          <span className={task.completed ? 'completed' : ''}>{task.title}</span>
        </div>
      ))}
    </div>
  );
};`;
    }
    generateTaskOutput(task, files, explanation) {
        let output = `🤖 AI Frontend Agent - Task Completed: ${task.title}\n\n`;
        output += `📊 Generated ${files.length} files:\n`;
        files.forEach(file => {
            output += `• ${file.path} (${file.type})\n`;
        });
        output += `\n🎨 AI Enhancement Features:\n`;
        output += `• TypeScript interfaces with proper typing\n`;
        output += `• Error handling and loading states\n`;
        output += `• Accessibility attributes (ARIA labels)\n`;
        output += `• Responsive design considerations\n`;
        output += `• Modern React patterns (hooks, functional components)\n`;
        output += `• Component story files for documentation\n`;
        if (explanation) {
            output += `\n🧠 AI Explanation:\n${explanation}\n`;
        }
        return output;
    }
}
exports.AIFrontendAgent = AIFrontendAgent;
//# sourceMappingURL=AIFrontendAgent.js.map