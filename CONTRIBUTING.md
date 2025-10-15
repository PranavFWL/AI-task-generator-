# 🤝 Contributing to AI Task Generator

Thank you for your interest in contributing to the AI Task Generator! This document provides guidelines and instructions for contributing.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Testing](#testing)

---

## 📜 Code of Conduct

By participating in this project, you agree to:
- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Maintain professional communication

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Git
- Code editor (VS Code recommended)
- Google Gemini API key

### First Time Setup

1. **Fork the repository:**
   - Visit: https://github.com/PranavFWL/AI-task-generator-
   - Click "Fork" button

2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/AI-task-generator-.git
   cd AI-task-generator-
   ```

3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/PranavFWL/AI-task-generator-.git
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Setup environment:**
   ```bash
   cp .env.example .env.local
   # Add your GEMINI_API_KEY
   ```

6. **Run development server:**
   ```bash
   npm run dev
   ```

---

## 🏗️ Development Setup

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### Project Structure

```
lib/
├── AIAgentSystem.ts           # Main system orchestrator
├── projectGenerator.ts        # Project structure generator
└── parent/
    ├── agents/                # AI agent implementations
    │   ├── AICoordinatorAgent.ts
    │   ├── AIFrontendAgent.ts
    │   └── AIBackendAgent.ts
    ├── services/
    │   └── GeminiService.ts   # AI API integration
    ├── types/
    │   └── index.ts           # TypeScript interfaces
    └── utils/                 # Utility generators
        ├── DatabaseSchemaGenerator.ts
        ├── TaskSchedulingGenerator.ts
        ├── BusinessLogicGenerator.ts
        └── DatabaseOptimizationGenerator.ts
```

---

## 🎯 How to Contribute

### Areas for Contribution

1. **New Features:**
   - Additional AI agent types
   - Support for more frameworks (Vue, Angular, Python)
   - GraphQL API generation
   - Mobile app generation (React Native, Flutter)
   - Docker/Kubernetes configuration generation
   - CI/CD pipeline generation

2. **Improvements:**
   - Better code generation quality
   - Enhanced error handling
   - Performance optimizations
   - UI/UX improvements
   - Documentation

3. **Bug Fixes:**
   - Check open issues
   - Reproduce bugs
   - Submit fixes with tests

4. **Documentation:**
   - Improve README
   - Add tutorials
   - Create examples
   - Fix typos

### Workflow

1. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make changes:**
   - Write clean, documented code
   - Follow coding standards
   - Add tests if applicable

3. **Commit changes:**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request:**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill in the template
   - Link related issues

---

## 📐 Coding Standards

### TypeScript

```typescript
// ✅ Good: Clear naming, proper types, documentation
/**
 * Generates database schema from task requirements
 * @param task - Technical task with requirements
 * @returns Array of database table definitions
 */
export function generateSchema(task: TechnicalTask): TableDefinition[] {
  const tables: TableDefinition[] = [];

  if (task.title.toLowerCase().includes('auth')) {
    tables.push(createUsersTable());
  }

  return tables;
}

// ❌ Bad: Unclear naming, no types, no documentation
export function gen(t) {
  let arr = [];
  if (t.title.includes('auth')) arr.push(makeTbl());
  return arr;
}
```

### Code Organization

```typescript
// ✅ Good: Organized imports, clear sections
import { Request, Response } from 'express';
import { GeminiService } from '../services/GeminiService';
import { TechnicalTask } from '../types';

export class AIBackendAgent {
  private geminiService: GeminiService;

  constructor(geminiService?: GeminiService) {
    this.geminiService = geminiService || new GeminiService();
  }

  // Public methods
  async executeTask(task: TechnicalTask): Promise<AgentResponse> {
    // Implementation
  }

  // Private methods
  private enhanceCode(code: string): string {
    // Implementation
  }
}
```

### Naming Conventions

- **Files:** PascalCase for classes, camelCase for utilities
  - `AICoordinatorAgent.ts`
  - `databaseHelpers.ts`

- **Variables:** camelCase
  ```typescript
  const userEmail = 'user@example.com';
  const taskList = [];
  ```

- **Constants:** UPPER_SNAKE_CASE
  ```typescript
  const MAX_TASKS = 100;
  const DEFAULT_PRIORITY = 'medium';
  ```

- **Interfaces:** PascalCase with descriptive names
  ```typescript
  interface TechnicalTask { }
  interface AgentResponse { }
  ```

### Comments

```typescript
// ✅ Good: Explain WHY, not WHAT
// Skip enhancement to save API calls (tasks already high quality)
const executionPlan = this.createAIExecutionPlan(aiTasks, brief);

// ❌ Bad: State the obvious
// Create execution plan
const executionPlan = this.createAIExecutionPlan(aiTasks, brief);
```

### Error Handling

```typescript
// ✅ Good: Specific error handling with fallback
try {
  const aiResult = await this.geminiService.generateCode(task, 'backend');
  return processResult(aiResult);
} catch (error) {
  console.warn(`AI generation failed for ${task.title}, using fallback`);
  return this.generateFallbackCode(task);
}

// ❌ Bad: Silent failures
try {
  const result = await api.call();
} catch (e) {
  // Empty catch block
}
```

---

## 🔄 Submitting Changes

### Commit Message Format

Use conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(backend): add GraphQL API generation support"
git commit -m "fix(frontend): resolve responsive design issue on mobile"
git commit -m "docs: update setup instructions for Windows"
git commit -m "refactor(agents): improve code generation performance"
```

### Pull Request Guidelines

1. **Title:** Clear and descriptive
   - ✅ "Add support for Python Flask backend generation"
   - ❌ "Update code"

2. **Description:** Include:
   - What changes were made
   - Why they were made
   - How to test them
   - Screenshots (for UI changes)

3. **Link issues:** Use keywords
   - "Fixes #123"
   - "Closes #456"
   - "Related to #789"

4. **Keep PRs focused:**
   - One feature/fix per PR
   - Small, reviewable changes
   - Split large changes into multiple PRs

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How to Test
1. Step one
2. Step two
3. Expected result

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated (if applicable)

## Screenshots (if applicable)
Add screenshots here
```

---

## 🧪 Testing

### Manual Testing

Before submitting a PR:

1. **Test the main flow:**
   ```bash
   npm run dev
   # Open http://localhost:3000
   # Enter: "Build a todo app with authentication"
   # Verify task generation works
   # Verify code download works
   ```

2. **Test edge cases:**
   - Empty input
   - Very long descriptions
   - Special characters
   - Multiple features

3. **Test on different platforms:**
   - Windows
   - macOS
   - Linux/WSL

### Code Quality

```bash
# Run linter
npm run lint

# Build project
npm run build
```

---

## 🌟 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Acknowledged in the README

---

## ❓ Questions?

- **Discord:** [Coming soon]
- **Discussions:** https://github.com/PranavFWL/AI-task-generator-/discussions
- **Email:** pranavyelikar080@gmail.com

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing! 🎉**

Your contributions make this project better for everyone.
