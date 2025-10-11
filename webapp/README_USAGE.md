# AgentTask AI - Web Application

A modern web interface for the AI Agent Task Management System that breaks down project descriptions into actionable technical tasks using Google Gemini AI.

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

## Prerequisites

1. Node.js 16+ installed
2. GEMINI_API_KEY configured in parent `.env` file (`/home/pranav/Software_Lab/.env`)

## Installation

The webapp is already configured and dependencies are installed. If you need to reinstall:

```bash
cd /home/pranav/Software_Lab/webapp
npm install
```

## Running the Application

### Development Mode

```bash
cd /home/pranav/Software_Lab/webapp
npm run dev
```

The application will be available at:
- Local: http://localhost:3000
- Network: http://[your-ip]:3000

### Production Build

```bash
cd /home/pranav/Software_Lab/webapp
npm run build
npm start
```

## How to Use

1. **Start the server** using `npm run dev`
2. **Open your browser** to http://localhost:3000
3. **Enter a project description** in the text area, for example:
   ```
   Create a todo app with user authentication, real-time updates,
   and mobile responsive design
   ```
4. **Click "Analyze Project"**
5. **View the results**:
   - AI Analysis summary
   - Detailed task cards with all information
   - Execution plan

## Project Structure

```
webapp/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API endpoint for task analysis
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main UI page
├── components/
│   └── TaskCard.tsx              # Professional task card component
├── lib/
│   └── AIAgentSystem.ts          # Wrapper to parent AI system
├── public/
├── .env.local                    # Local environment config
├── next.config.ts                # Next.js configuration
├── package.json
├── postcss.config.mjs
└── tsconfig.json

```

## Integration with Parent Project

The webapp integrates with the main AI Agent System located in `/home/pranav/Software_Lab/src/`:
- Imports `AIAgentSystem` class from parent `src` directory
- Uses shared TypeScript types
- Loads environment variables from parent `.env` file

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
      "acceptance_criteria": [
        "Criteria 1",
        "Criteria 2"
      ]
    }
  ],
  "executionPlan": "Step-by-step execution plan",
  "aiAnalysis": "AI analysis summary",
  "projectSummary": "Project description"
}
```

## Troubleshooting

### Server won't start
- Ensure Node.js 16+ is installed
- Check that port 3000 is not in use
- Verify dependencies are installed: `npm install`

### API errors
- Ensure GEMINI_API_KEY is set in parent `.env` file
- Check that parent project is built: `cd .. && npm run build`
- Verify the API key is valid

### TypeScript errors
- Ensure parent project TypeScript files are compiled
- Run `npm run build` in parent directory

## Technologies Used

- **Next.js 15.5.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5+** - Type safety
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **Google Gemini AI** - AI-powered task breakdown

## License

MIT
