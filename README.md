# AgentTask-AI

AI Powered Project Task Breakdown System

AgentTask-AI is a modern web application built with **Google ADK (Agent Development Kit)** that uses Google Gemini AI to convert high-level project briefs into detailed, actionable technical tasks. It works on a multi-agent system where each AI agent focuses on a specific domain such as coordination, frontend, or backend.

---

## Features

* AI-powered analysis that understands project descriptions and creates structured tasks
* Detailed task cards including title, type, estimated hours, dependencies, and acceptance criteria
* Modern interface built with Next.js, React, and Tailwind CSS
* Multi-agent system for coordinated task generation
* Full-stack code generation for both frontend and backend
* One-command setup for easy installation and launch

---

## Quick Start

### Linux, macOS, or WSL

```bash
git clone https://github.com/PranavFWL/AI-task-generator-.git
cd AI-task-generator-
chmod +x install.sh
./install.sh
```

### Windows

```cmd
git clone https://github.com/PranavFWL/AI-task-generator-.git
cd AI-task-generator-
install.bat
```

The installation script checks dependencies, installs all required packages, and helps you set up your Gemini API key.

---

## Manual Setup

1. Clone and install

   ```bash
   git clone https://github.com/PranavFWL/AI-task-generator-.git
   cd AI-task-generator-
   npm install
   ```

2. Configure environment

   ```bash
   cp .env.example .env
   ```

   Add your Gemini API key inside `.env`

   ```
   GEMINI_API_KEY=your_api_key_here
   GOOGLE_API_KEY=your_api_key_here
   ```

3. Run

   ```bash
   npm run dev
   ```

   Open your browser at [http://localhost:3000](http://localhost:3000)

---

## How It Works

1. The user provides a natural language project description.
2. Google ADK multi-agent system analyzes the description and breaks it down into technical tasks.
3. The Coordinator Agent manages dependencies and assigns tasks.
4. The Frontend and Backend Agents generate production-level code.
5. The entire project is packaged into a downloadable full-stack application.

---

## Tech Stack

Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS 4

Backend

* Node.js with Express
* PostgreSQL or MySQL
* JWT authentication
* bcrypt for hashing
* node-cron and Bull for background jobs

AI Integration

* Google ADK (Agent Development Kit) v0.1.3
* Google Gemini API

---

## Project Structure

```
.
├── app/
│   ├── api/analyze/route.ts      # API route for AI processing
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── TaskCard.tsx
│   └── CodeViewer.tsx
│
├── lib/
│   ├── AIAgentSystem.ts
│   ├── projectGenerator.ts
│   └── parent/
│       ├── agents/
│       ├── services/
│       ├── types/
│       └── utils/
│
├── install.sh / install.bat
├── package.json
├── next.config.ts
└── README.md
```

---

## API

Endpoint: POST /api/analyze

Request

```json
{
  "description": "Build a todo app with authentication and real-time updates"
}
```

Response

```json
{
  "tasks": [
    {
      "id": "task-1",
      "title": "Setup frontend project",
      "type": "frontend",
      "estimatedHours": 4,
      "dependencies": [],
      "acceptance_criteria": ["Project runs successfully"]
    }
  ],
  "executionPlan": "Step-by-step implementation plan",
  "aiAnalysis": "High-level summary of the project"
}
```

---

## Commands

| Command       | Description              |
| ------------- | ------------------------ |
| npm run dev   | Start development server |
| npm run build | Build for production     |
| npm start     | Start production server  |
| npm run lint  | Run ESLint checks        |

---

## Troubleshooting

* Make sure Node.js version is 18 or higher
* Verify the Gemini API key in `.env.local`
* Check that port 3000 is not already in use

---

## Use Cases

* Students can learn full-stack development by studying the generated examples
* Developers can quickly create structured technical plans
* Startups can turn ideas into working prototypes within minutes

---

## License

This project is licensed under the MIT License.

---

## Author

**Pranav Yelikar**
Email: [pranavyelikar080@gmail.com](mailto:pranavyelikar080@gmail.com)
GitHub: [@PranavFWL](https://github.com/PranavFWL)

---

