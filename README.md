# AgentTask-AI - AI-Powered Project Task Breakdown System

A modern web application that intelligently breaks down project descriptions into actionable technical tasks using Google Gemini AI and a multi-agent system.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-blue)

---

## 🌟 Features

- 🤖 **AI-Powered Analysis** - Uses Google Gemini to intelligently break down projects
- 📋 **Professional Task Cards** - Each task displayed with full details:
  - Task ID and title
  - Description
  - Type (Frontend, Backend, Database, etc.)
  - Priority (High, Medium, Low)
  - Estimated hours
  - Dependencies
  - Acceptance criteria with checkboxes
- 🎨 **Modern UI** - Built with Next.js 15, React 19, and Tailwind CSS 4
- ⚡ **Real-time Processing** - Instant feedback and results
- 🔄 **Multi-Agent System** - Coordinator, Frontend, and Backend agents work together
- 📦 **Complete Project Generation** - Downloads full-stack applications as ZIP
- 🚀 **One-Command Deploy** - Includes START scripts for instant setup

---

## 🚀 Quick Start

### Automated Installation (Recommended)

**Linux / macOS / WSL:**
```bash
git clone https://github.com/PranavFWL/AI-task-generator-.git
cd AI-task-generator-
chmod +x install.sh
./install.sh
```

**Windows:**
```cmd
git clone https://github.com/PranavFWL/AI-task-generator-.git
cd AI-task-generator-
install.bat
```

The installation script will:
- ✅ Check Node.js installation
- ✅ Install all dependencies
- ✅ Create environment configuration
- ✅ Guide you through API key setup

### Manual Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PranavFWL/AI-task-generator-.git
   cd AI-task-generator-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local

   # Edit .env.local and add your Gemini API key
   # GEMINI_API_KEY=your_actual_api_key_here
   ```

   Get your API key from: [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to http://localhost:3000
   - Enter a project description and click "Analyze Project"

---

## 📋 Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Google Gemini API key** - [Get free key](https://makersuite.google.com/app/apikey)
  - Free tier: 1500 requests/day
  - No credit card required

---

## 💡 Usage Example

### Input:
```
Create a todo app with user authentication, real-time updates,
and mobile responsive design
```

### Output:
The AI generates:
- ✅ 12-18 detailed technical tasks
- ✅ Task breakdown with IDs, priorities, and time estimates
- ✅ Frontend, backend, and infrastructure tasks
- ✅ Dependencies between tasks
- ✅ Acceptance criteria for each task
- ✅ Complete execution plan
- ✅ Downloadable ZIP with full-stack code (60-80+ files)

### Generated Project Includes:

**Frontend:**
- React 19 + TypeScript components
- Responsive UI with Tailwind CSS
- Form validation and error handling
- Accessibility features (ARIA labels)
- Type definitions

**Backend:**
- Express.js REST APIs
- JWT authentication
- Database schemas (PostgreSQL/MySQL)
- Business logic workflows
- Task scheduling (cron jobs)
- Connection pooling
- Caching layer
- Input validation
- Security features

**Infrastructure:**
- Database migration scripts
- Environment configuration
- Docker support (optional)
- Complete test suites
- Documentation

---

## 📂 Project Structure

```
.
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API endpoint for task analysis
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main UI page
│
├── components/
│   ├── CollapsibleTaskCard.tsx   # Collapsible task card component
│   ├── TaskCard.tsx              # Task card component
│   └── CodeViewer.tsx            # Code viewer with download
│
├── lib/
│   ├── AIAgentSystem.ts          # Main system orchestrator
│   ├── projectGenerator.ts       # Full project generator
│   └── parent/                   # Multi-agent AI system
│       ├── agents/               # AI agents
│       │   ├── AICoordinatorAgent.ts
│       │   ├── AIFrontendAgent.ts
│       │   └── AIBackendAgent.ts
│       ├── services/
│       │   └── GeminiService.ts  # Gemini AI integration
│       ├── types/
│       │   └── index.ts          # TypeScript interfaces
│       └── utils/                # Utility generators
│           ├── DatabaseSchemaGenerator.ts
│           ├── TaskSchedulingGenerator.ts
│           ├── BusinessLogicGenerator.ts
│           └── DatabaseOptimizationGenerator.ts
│
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── install.sh                    # Linux/Mac installation script
├── install.bat                   # Windows installation script
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── SETUP.md                      # Detailed setup guide
├── CONTRIBUTING.md               # Contribution guidelines
└── README.md                     # This file
```

---

## 🔌 API Endpoint

### POST /api/analyze

Analyzes a project description and returns structured tasks.

**Request Body:**
```json
{
  "description": "Your project description",
  "requirements": ["Optional requirements array"],
  "constraints": ["Optional constraints array"]
}
```

**Response:**
```json
{
  "tasks": [
    {
      "id": "task-1",
      "title": "Task title",
      "description": "Task description",
      "type": "frontend|backend|database|testing|deployment|devops|general",
      "priority": "high|medium|low",
      "estimatedHours": 8,
      "dependencies": ["task-2"],
      "acceptance_criteria": ["Criteria 1", "Criteria 2"]
    }
  ],
  "executionPlan": "Step-by-step execution plan",
  "aiAnalysis": "AI analysis summary",
  "projectSummary": "Project description",
  "generatedFiles": [
    {
      "path": "src/components/LoginForm.tsx",
      "content": "...",
      "type": "component"
    }
  ]
}
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🛠️ Technologies Used

### Frontend
- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5+** - Type safety
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons

### Backend (Generated)
- **Node.js + Express** - Server framework
- **PostgreSQL / MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **node-cron** - Task scheduling
- **Bull** - Job queues

### AI Integration
- **Google Gemini AI** - AI-powered code generation

---

## 🎯 How It Works

1. **User Input** - You describe your project in natural language
2. **AI Analysis** - Gemini AI analyzes and breaks down requirements
3. **Task Generation** - AI Coordinator creates detailed technical tasks
4. **Code Generation** - Frontend & Backend agents generate production code
5. **Project Assembly** - All code packaged into downloadable ZIP
6. **One-Click Deploy** - Run `START.sh` or `START.bat` to launch

### Multi-Agent Architecture

```
AI Coordinator (Brain)
├── Analyzes project requirements
├── Creates technical task breakdown
├── Manages task dependencies
└── Coordinates sub-agents

Frontend Agent
├── Generates React components
├── Creates TypeScript interfaces
├── Adds responsive design
├── Implements accessibility
└── Generates tests

Backend Agent
├── Creates REST APIs
├── Generates database schemas
├── Implements business logic
├── Adds authentication
├── Sets up task scheduling
└── Optimizes performance
```

---

## 🔧 Troubleshooting

### Server won't start
- Ensure Node.js 18+ is installed: `node --version`
- Check that port 3000 is not in use
- Verify dependencies are installed: `npm install`

### API errors
- Ensure `GEMINI_API_KEY` is set in `.env.local`
- Verify the API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Check browser console for detailed error messages

### Build errors
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`

For more help, see [SETUP.md](SETUP.md)

---

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup instructions for all platforms
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guidelines for contributing
- **[ENHANCEMENT_COMPLETE.md](ENHANCEMENT_COMPLETE.md)** - Complete feature documentation
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical implementation details

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Quick contribution steps:
1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 🎓 Use Cases

### For Entrepreneurs
- Validate ideas with working prototypes in minutes
- Show investors real applications, not slides
- Iterate quickly on MVP development

### For Developers
- Generate boilerplate code automatically
- Focus on unique features instead of setup
- Learn best practices from generated code

### For Businesses
- Rapidly develop internal tools
- Create custom CRMs, project trackers, inventory systems
- Reduce development time from weeks to hours

### For Students
- Learn full-stack development by example
- Study authentication, database design, API development
- Understand how frontend and backend connect

---

## 📊 Performance

- **Task Generation:** ~5-10 seconds
- **Code Generation:** ~30-60 seconds for full project
- **Files Generated:** 60-80+ files per project
- **Lines of Code:** 8,000-12,000 per project
- **API Calls:** ~7 Gemini API calls per project
- **Daily Capacity:** ~200 projects (free tier)

---

## 🔒 Security

- Environment variables stored in `.env.local` (not committed)
- API keys never exposed to frontend
- Generated code includes security best practices:
  - Password hashing with bcrypt
  - JWT authentication
  - Rate limiting
  - Input validation
  - SQL injection prevention
  - XSS protection

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

---

## 📧 Contact

- **Author:** Pranav
- **Email:** pranavyelikar080@gmail.com
- **GitHub:** [@PranavFWL](https://github.com/PranavFWL)
- **Repository:** [AI-task-generator-](https://github.com/PranavFWL/AI-task-generator-)

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

## 🚀 Roadmap

- [ ] Add GraphQL API generation support
- [ ] Support for Python/Django backend
- [ ] Mobile app generation (React Native)
- [ ] Docker/Kubernetes configuration generation
- [ ] CI/CD pipeline generation
- [ ] Real-time collaboration features
- [ ] Project templates library
- [ ] VS Code extension

---

## 💬 Community

- **Issues:** [GitHub Issues](https://github.com/PranavFWL/AI-task-generator-/issues)
- **Discussions:** [GitHub Discussions](https://github.com/PranavFWL/AI-task-generator-/discussions)

---

<div align="center">

**Built with ❤️ using Claude Code**

[⬆ Back to Top](#agenttask-ai---ai-powered-project-task-breakdown-system)

</div>
