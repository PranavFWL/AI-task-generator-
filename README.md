# AgentTask-AI - AI-Powered Project Task Breakdown System

A modern web application that intelligently breaks down project descriptions into actionable technical tasks using Google Gemini AI and a multi-agent system.

## Features

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

## Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## Quick Start

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

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to http://localhost:3000
   - Enter a project description and click "Analyze Project"

## Usage Example

Enter a project description like:
```
Create a todo app with user authentication, real-time updates,
and mobile responsive design
```

The AI will generate:
- Detailed task breakdown with IDs, priorities, and estimates
- Frontend, backend, and infrastructure tasks
- Dependencies between tasks
- Acceptance criteria for each task
- Step-by-step execution plan

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API endpoint for task analysis
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main UI page
├── components/
│   ├── CollapsibleTaskCard.tsx   # Collapsible task card component
│   └── TaskCard.tsx              # Task card component
├── lib/
│   └── parent/                   # Multi-agent AI system
│       ├── agents/               # AI agents (Coordinator, Frontend, Backend)
│       ├── services/             # Gemini AI service
│       └── types/                # TypeScript types
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── next.config.ts                # Next.js configuration
├── package.json
└── tsconfig.json
```

## API Endpoint

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
  "projectSummary": "Project description"
}
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5+** - Type safety
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **Google Gemini AI** - AI-powered task breakdown

## Troubleshooting

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.





