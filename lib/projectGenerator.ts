import { GeneratedFile } from './parent/types';

interface ProjectFile {
  path: string;
  content: string;
}

interface InputFile {
  path: string;
  content: string;
  type: string;
}

export class ProjectGenerator {
  /**
   * Generate a complete executable project structure
   */
  static generateProjectStructure(
    files: InputFile[],
    projectName: string,
    projectDescription: string
  ): ProjectFile[] {
    const projectFiles: ProjectFile[] = [];

    // Separate frontend and backend files
    const frontendFiles = files.filter(f =>
      f.type === 'component' ||
      f.path.includes('component') ||
      f.path.includes('client') ||
      f.path.endsWith('.tsx') ||
      f.path.endsWith('.jsx') ||
      f.path.endsWith('.css')
    );

    const backendFiles = files.filter(f =>
      f.type === 'api' ||
      f.type === 'schema' ||
      f.path.includes('controller') ||
      f.path.includes('model') ||
      f.path.includes('route') ||
      f.path.includes('middleware') ||
      f.path.includes('server') ||
      f.path.endsWith('.sql')
    );

    const hasFrontend = frontendFiles.length > 0;
    const hasBackend = backendFiles.length > 0;

    // Generate root README
    projectFiles.push({
      path: 'README.md',
      content: this.generateRootReadme(projectName, projectDescription, hasFrontend, hasBackend)
    });

    // Generate frontend structure if exists
    if (hasFrontend) {
      projectFiles.push(...this.generateFrontendStructure(frontendFiles, projectName));
    }

    // Generate backend structure if exists
    if (hasBackend) {
      projectFiles.push(...this.generateBackendStructure(backendFiles, projectName));
    }

    // If both exist, add root package.json to manage both
    if (hasFrontend && hasBackend) {
      projectFiles.push({
        path: 'package.json',
        content: this.generateRootPackageJson(projectName, projectDescription)
      });

      // Add START script for easy launching
      projectFiles.push({
        path: 'START.sh',
        content: this.generateStartScript(hasFrontend, hasBackend)
      });

      projectFiles.push({
        path: 'START.bat',
        content: this.generateStartScriptWindows(hasFrontend, hasBackend)
      });
    }

    return projectFiles;
  }

  private static generateFrontendStructure(files: InputFile[], projectName: string): ProjectFile[] {
    const projectFiles: ProjectFile[] = [];

    // Frontend package.json
    projectFiles.push({
      path: 'frontend/package.json',
      content: this.generateFrontendPackageJson(projectName)
    });

    // Frontend tsconfig.json
    projectFiles.push({
      path: 'frontend/tsconfig.json',
      content: this.generateFrontendTsConfig()
    });

    // Frontend vite.config.ts (using Vite for better performance)
    projectFiles.push({
      path: 'frontend/vite.config.ts',
      content: this.generateViteConfig()
    });

    // Frontend index.html
    projectFiles.push({
      path: 'frontend/index.html',
      content: this.generateIndexHtml(projectName)
    });

    // Frontend README
    projectFiles.push({
      path: 'frontend/README.md',
      content: this.generateFrontendReadme()
    });

    // Add main App file if not present
    const hasApp = files.some(f => f.path.includes('App'));
    if (!hasApp) {
      projectFiles.push({
        path: 'frontend/src/App.tsx',
        content: this.generateAppTsx(files)
      });
    }

    // Add main entry point
    projectFiles.push({
      path: 'frontend/src/main.tsx',
      content: this.generateMainTsx()
    });

    // Process and add generated files
    files.forEach(file => {
      const newPath = this.normalizeFrontendPath(file.path);
      projectFiles.push({
        path: newPath,
        content: file.content
      });
    });

    // Add .gitignore
    projectFiles.push({
      path: 'frontend/.gitignore',
      content: this.generateGitignore()
    });

    return projectFiles;
  }

  private static generateBackendStructure(files: InputFile[], projectName: string): ProjectFile[] {
    const projectFiles: ProjectFile[] = [];

    // Backend package.json
    projectFiles.push({
      path: 'backend/package.json',
      content: this.generateBackendPackageJson(projectName)
    });

    // Backend tsconfig.json
    projectFiles.push({
      path: 'backend/tsconfig.json',
      content: this.generateBackendTsConfig()
    });

    // Backend README
    projectFiles.push({
      path: 'backend/README.md',
      content: this.generateBackendReadme()
    });

    // Add main server file if not present
    const hasServer = files.some(f => f.path.includes('server'));
    if (!hasServer) {
      projectFiles.push({
        path: 'backend/src/server.ts',
        content: this.generateServerTs(files)
      });
    }

    // Process and add generated files
    files.forEach(file => {
      const newPath = this.normalizeBackendPath(file.path);
      projectFiles.push({
        path: newPath,
        content: file.content
      });
    });

    // Add .env.example
    projectFiles.push({
      path: 'backend/.env.example',
      content: this.generateEnvExample()
    });

    // Add .gitignore
    projectFiles.push({
      path: 'backend/.gitignore',
      content: this.generateGitignore()
    });

    return projectFiles;
  }

  private static normalizeFrontendPath(originalPath: string): string {
    // Remove leading 'src/' if present
    let cleanPath = originalPath.replace(/^src\//, '');

    // Ensure proper extension
    if (cleanPath.includes('component') || cleanPath.includes('Component')) {
      if (!cleanPath.endsWith('.tsx') && !cleanPath.endsWith('.jsx')) {
        cleanPath = cleanPath.replace(/\.(ts|js)$/, '.tsx');
        if (!cleanPath.endsWith('.tsx')) cleanPath += '.tsx';
      }
    }

    // Add to frontend/src
    return `frontend/src/${cleanPath}`;
  }

  private static normalizeBackendPath(originalPath: string): string {
    // Remove leading 'src/' if present
    let cleanPath = originalPath.replace(/^src\//, '');

    // Ensure proper extension
    if (!cleanPath.endsWith('.ts') && !cleanPath.endsWith('.js') && !cleanPath.endsWith('.sql')) {
      cleanPath += '.ts';
    }

    // Handle SQL migrations separately
    if (cleanPath.endsWith('.sql') || cleanPath.includes('migration')) {
      return `backend/migrations/${cleanPath.split('/').pop()}`;
    }

    // Add to backend/src
    return `backend/src/${cleanPath}`;
  }

  // ============ README Generators ============

  private static generateRootReadme(name: string, description: string, hasFrontend: boolean, hasBackend: boolean): string {
    return `# ${name}

${description}

## Project Structure

This project is organized as a full-stack application:

${hasFrontend ? `- **frontend/** - React + TypeScript + Vite application\n` : ''}${hasBackend ? `- **backend/** - Node.js + Express + TypeScript API server\n` : ''}

## [Starting] Quick Start (Easiest Way)

### Prerequisites
- Node.js 18+ installed ([Download here](https://nodejs.org/))

### One-Command Start

**Linux/Mac/WSL:**
\`\`\`bash
chmod +x START.sh
./START.sh
\`\`\`

**Windows:**
\`\`\`bash
START.bat
\`\`\`

That's it! The script will:
1. [Success] Install all dependencies automatically
2. [Success] Start both frontend and backend servers
3. [Success] Open your browser automatically

${hasFrontend ? `Frontend will open at: **http://localhost:5173**\n` : ''}${hasBackend ? `Backend will run at: **http://localhost:3001**\n` : ''}

---

## 📚 Alternative: Manual Installation & Running

**Method 1: Install and run separately**

${hasFrontend ? `**Frontend:**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
→ Opens at http://localhost:5173

` : ''}${hasBackend ? `**Backend:**
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`
→ Runs on http://localhost:3001

` : ''}
**Method 2: Install all at once from root**

${hasFrontend && hasBackend ? `\`\`\`bash
npm install  # Installs both frontend and backend dependencies
\`\`\`

Then run them separately:
\`\`\`bash
npm run dev:frontend  # In one terminal
npm run dev:backend   # In another terminal
\`\`\`
` : ''}
## Development

${hasFrontend ? `### Frontend Development
- Navigate to \`frontend/\` directory
- Run \`npm run dev\` for development server
- Run \`npm run build\` for production build

` : ''}${hasBackend ? `### Backend Development
- Navigate to \`backend/\` directory
- Create \`.env\` file based on \`.env.example\`
- Run \`npm run dev\` for development server with hot reload
- Run \`npm run build\` for production build

` : ''}
## Tech Stack

${hasFrontend ? `### Frontend
- React 18
- TypeScript
- Vite
- CSS3

` : ''}${hasBackend ? `### Backend
- Node.js
- Express.js
- TypeScript
- JWT Authentication

` : ''}
## Generated with AgentTask AI

This project was generated using AI-powered task breakdown and code generation.

---

**Happy Coding! [Starting]**
`;
  }

  private static generateFrontendReadme(): string {
    return `# Frontend Application

React + TypeScript + Vite frontend application.

## Setup

\`\`\`bash
npm install
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

Runs on http://localhost:5173

## Build

\`\`\`bash
npm run build
\`\`\`

## Preview Production Build

\`\`\`bash
npm run preview
\`\`\`
`;
  }

  private static generateBackendReadme(): string {
    return `# Backend API

Node.js + Express + TypeScript API server.

## Setup

\`\`\`bash
npm install
\`\`\`

Create \`.env\` file:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` with your configuration.

## Development

\`\`\`bash
npm run dev
\`\`\`

Runs on http://localhost:3001

## Build

\`\`\`bash
npm run build
\`\`\`

## Start Production

\`\`\`bash
npm start
\`\`\`
`;
  }

  // ============ Package.json Generators ============

  private static generateRootPackageJson(name: string, description: string): string {
    return JSON.stringify({
      name: name.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: description,
      scripts: {
        dev: 'echo "Choose: npm run dev:frontend OR npm run dev:backend" && echo "Frontend: cd frontend && npm run dev" && echo "Backend: cd backend && npm run dev"',
        install: 'cd frontend && npm install && cd ../backend && npm install',
        'install:frontend': 'cd frontend && npm install',
        'install:backend': 'cd backend && npm install',
        'dev:frontend': 'cd frontend && npm run dev',
        'dev:backend': 'cd backend && npm run dev',
        'build:frontend': 'cd frontend && npm run build',
        'build:backend': 'cd backend && npm run build'
      },
      keywords: [],
      author: '',
      license: 'ISC'
    }, null, 2);
  }

  private static generateFrontendPackageJson(projectName: string): string {
    return JSON.stringify({
      name: `${projectName.toLowerCase().replace(/\s+/g, '-')}-frontend`,
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview'
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0'
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        '@vitejs/plugin-react': '^4.2.1',
        typescript: '^5.2.2',
        vite: '^5.1.0'
      }
    }, null, 2);
  }

  private static generateBackendPackageJson(projectName: string): string {
    return JSON.stringify({
      name: `${projectName.toLowerCase().replace(/\s+/g, '-')}-backend`,
      version: '1.0.0',
      description: 'Backend API server',
      main: 'dist/server.js',
      scripts: {
        dev: 'ts-node-dev --respawn --transpile-only src/server.ts',
        build: 'tsc',
        start: 'node dist/server.js'
      },
      dependencies: {
        express: '^4.18.2',
        cors: '^2.8.5',
        dotenv: '^16.4.1',
        bcrypt: '^5.1.1',
        jsonwebtoken: '^9.0.2',
        'express-rate-limit': '^7.1.5'
      },
      devDependencies: {
        '@types/express': '^4.17.21',
        '@types/cors': '^2.8.17',
        '@types/bcrypt': '^5.0.2',
        '@types/jsonwebtoken': '^9.0.5',
        '@types/node': '^20.11.5',
        typescript: '^5.3.3',
        'ts-node-dev': '^2.0.0'
      }
    }, null, 2);
  }

  // ============ Config Generators ============

  private static generateFrontendTsConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true
      },
      include: ['src'],
      references: [{ path: './tsconfig.node.json' }]
    }, null, 2);
  }

  private static generateBackendTsConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        module: 'commonjs',
        lib: ['ES2020'],
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        resolveJsonModule: true,
        moduleResolution: 'node'
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist']
    }, null, 2);
  }

  private static generateViteConfig(): string {
    return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
`;
  }

  // ============ Template Generators ============

  private static generateIndexHtml(projectName: string): string {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  }

  private static generateMainTsx(): string {
    return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
  }

  private static generateAppTsx(files: InputFile[]): string {
    const componentImports = files
      .filter(f => f.type === 'component')
      .map(f => {
        const fileName = f.path.split('/').pop()?.replace(/\.(tsx|jsx)$/, '') || 'Component';
        return `import ${fileName} from './${f.path.split('/').pop()}'`;
      })
      .join('\n');

    return `import React from 'react'
${componentImports}

function App() {
  return (
    <div className="app">
      <h1>Welcome to Your App</h1>
      {/* Add your components here */}
    </div>
  )
}

export default App
`;
  }

  private static generateServerTs(files: InputFile[]): string {
    return `import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API routes
// TODO: Import and use your generated routes here

// Start server
app.listen(PORT, () => {
  console.log(\`[Starting] Server running on http://localhost:\${PORT}\`);
});

export default app;
`;
  }

  private static generateEnvExample(): string {
    return `# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=database_name
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_secret_key_here_change_in_production

# CORS
CORS_ORIGIN=http://localhost:5173
`;
  }

  private static generateGitignore(): string {
    return `# Dependencies
node_modules/

# Build output
dist/
build/

# Environment variables
.env
.env.local

# Editor directories
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
`;
  }

  // ============ START Script Generators ============

  private static generateStartScript(hasFrontend: boolean, hasBackend: boolean): string {
    return `#!/bin/bash

echo "[Starting] Starting your application..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[Error] Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "📦 Installing dependencies..."
echo ""

${hasBackend ? `# Install backend dependencies
if [ -d "backend" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install --silent
    if [ $? -ne 0 ]; then
        echo "[Error] Backend installation failed"
        exit 1
    fi
    cd ..
    echo "[Success] Backend dependencies installed"
fi
` : ''}
${hasFrontend ? `# Install frontend dependencies
if [ -d "frontend" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install --silent
    if [ $? -ne 0 ]; then
        echo "[Error] Frontend installation failed"
        exit 1
    fi
    cd ..
    echo "[Success] Frontend dependencies installed"
fi
` : ''}
echo ""
echo "[Success] All dependencies installed!"
echo ""
echo "[Starting] Starting servers..."
echo ""

${hasBackend ? `# Start backend
if [ -d "backend" ]; then
    echo "[Processing] Starting backend server on http://localhost:3001"
    cd backend
    npm run dev > ../backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    echo "[Success] Backend started (PID: $BACKEND_PID)"
fi
` : ''}
${hasFrontend ? `# Start frontend
if [ -d "frontend" ]; then
    echo "[Frontend] Starting frontend server on http://localhost:5173"
    cd frontend
    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    echo "[Success] Frontend started (PID: $FRONTEND_PID)"
fi
` : ''}
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Application is running!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
${hasFrontend ? `echo "Frontend: http://localhost:5173"` : ''}
${hasBackend ? `echo "Backend:  http://localhost:3001"` : ''}
echo ""
echo "Logs:"
${hasFrontend ? `echo "   Frontend: tail -f frontend.log"` : ''}
${hasBackend ? `echo "   Backend:  tail -f backend.log"` : ''}
echo ""
echo "To stop: Press Ctrl+C or run ./STOP.sh"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Wait for a few seconds to let servers start
sleep 3

${hasFrontend ? `# Open browser (Linux/WSL)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173 &
elif command -v wslview &> /dev/null; then
    wslview http://localhost:5173 &
fi
` : ''}
# Keep script running
echo "Press Ctrl+C to stop all servers..."
wait
`;
  }

  private static generateStartScriptWindows(hasFrontend: boolean, hasBackend: boolean): string {
    return `@echo off
echo [Starting] Starting your application...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [Error] Node.js is not installed. Please install Node.js 18+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
echo.

${hasBackend ? `REM Install backend dependencies
if exist "backend" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo [Error] Backend installation failed
        pause
        exit /b 1
    )
    cd ..
    echo [Success] Backend dependencies installed
)
` : ''}
${hasFrontend ? `REM Install frontend dependencies
if exist "frontend" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    call npm install >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo [Error] Frontend installation failed
        pause
        exit /b 1
    )
    cd ..
    echo [Success] Frontend dependencies installed
)
` : ''}
echo.
echo [Success] All dependencies installed!
echo.
echo [Starting] Starting servers...
echo.

${hasBackend ? `REM Start backend
if exist "backend" (
    echo [Processing] Starting backend server on http://localhost:3001
    cd backend
    start "Backend Server" cmd /k "npm run dev"
    cd ..
    echo [Success] Backend started
)
` : ''}
${hasFrontend ? `REM Start frontend
if exist "frontend" (
    echo [Frontend] Starting frontend server on http://localhost:5173
    cd frontend
    start "Frontend Server" cmd /k "npm run dev"
    cd ..
    echo [Success] Frontend started
)
` : ''}
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Application is running!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${hasFrontend ? `echo Frontend: http://localhost:5173` : ''}
${hasBackend ? `echo Backend:  http://localhost:3001` : ''}
echo.
echo To stop: Close the terminal windows
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

timeout /t 3 >nul

${hasFrontend ? `REM Open browser
start http://localhost:5173
` : ''}
echo Servers are running in separate windows...
pause
`;
  }

  /**
   * Extract project name from description
   */
  static extractProjectName(description: string): string {
    // Try to extract name from phrases like "Build a todo app" or "Create a chat application"
    const match = description.match(/(?:build|create|develop|make)\s+(?:a|an)\s+([\w\s-]+?)(?:\s+with|\s+that|\s+for|$)/i);
    if (match && match[1]) {
      return match[1].trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    // Extract first few words
    const words = description.split(' ').slice(0, 3);
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}
