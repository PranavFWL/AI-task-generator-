# 🚀 Setup Guide - AI Task Generator

Complete setup instructions for running the AI Agent Task Generator on your local machine.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Node.js** (version 18 or higher)
   - Download: https://nodejs.org/
   - Verify installation: `node --version`
   - Should show: v18.x.x or higher

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`
   - Should show: 9.x.x or higher

3. **Git** (for cloning the repository)
   - Download: https://git-scm.com/
   - Verify installation: `git --version`

### Required API Key

- **Google Gemini API Key**
  - Get your free API key: https://makersuite.google.com/app/apikey
  - Free tier: 1500 requests/day
  - No credit card required

---

## 🔽 Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/PranavFWL/AI-task-generator-.git
cd AI-task-generator-
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- Next.js 15.5.4
- React 19.1.0
- TypeScript 5+
- Tailwind CSS 4
- Google Generative AI SDK
- JSZip
- Lucide React (icons)
- And all dev dependencies

**Installation time:** ~2-3 minutes (depending on your internet speed)

### Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Important Notes:**
- Never commit `.env.local` to Git (it's already in `.gitignore`)
- Keep your API key secret
- The `.env.example` file shows the required format

### Step 4: Run Development Server

```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 15.5.4
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Starting...
 ✓ Ready in 2.5s
```

### Step 5: Open in Browser

Navigate to: **http://localhost:3000**

You should see the AI Task Generator interface!

---

## 🎯 Quick Start Script (Optional)

For faster setup on Linux/Mac/WSL:

```bash
chmod +x start-webapp.sh
./start-webapp.sh
```

This script automatically:
1. Checks Node.js installation
2. Installs dependencies if needed
3. Starts the development server

---

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server (after build) |
| `npm run lint` | Run ESLint for code quality |

---

## 📂 Project Structure

```
AI-task-generator-/
├── app/                      # Next.js 15 App Router
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts      # Main API endpoint
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main UI page
│
├── components/               # React components
│   ├── CollapsibleTaskCard.tsx
│   ├── TaskCard.tsx
│   └── CodeViewer.tsx
│
├── lib/                      # Core logic
│   ├── AIAgentSystem.ts      # Main system entry
│   ├── projectGenerator.ts   # Full project generator
│   └── parent/               # Multi-agent system
│       ├── agents/           # AI agents
│       │   ├── AICoordinatorAgent.ts
│       │   ├── AIFrontendAgent.ts
│       │   └── AIBackendAgent.ts
│       ├── services/
│       │   └── GeminiService.ts
│       ├── types/
│       │   └── index.ts
│       └── utils/            # Utility generators
│           ├── DatabaseSchemaGenerator.ts
│           ├── TaskSchedulingGenerator.ts
│           ├── BusinessLogicGenerator.ts
│           └── DatabaseOptimizationGenerator.ts
│
├── public/                   # Static assets
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── next.config.ts            # Next.js config
├── tailwind.config.ts        # Tailwind CSS config
└── README.md                 # Project overview
```

---

## 🔧 Troubleshooting

### Issue: Port 3000 already in use

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: API key not working

**Checklist:**
- ✅ File is named exactly `.env.local` (not `.env.local.txt`)
- ✅ File is in the project root directory
- ✅ No spaces around the `=` sign
- ✅ API key is valid (test at https://makersuite.google.com/)
- ✅ Restart development server after adding key

### Issue: Build errors

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### Issue: TypeScript errors

**Solution:**
```bash
# Update TypeScript and type definitions
npm update typescript @types/node @types/react @types/react-dom
```

---

## 🌐 Platform-Specific Instructions

### Windows

1. **Install Node.js:**
   - Download installer from https://nodejs.org/
   - Run installer and follow prompts
   - Restart terminal

2. **Clone and setup:**
   ```cmd
   git clone https://github.com/PranavFWL/AI-task-generator-.git
   cd AI-task-generator-
   npm install
   copy .env.example .env.local
   ```

3. **Edit `.env.local`** with Notepad and add your API key

4. **Run:**
   ```cmd
   npm run dev
   ```

### macOS

1. **Install Node.js:**
   ```bash
   # Using Homebrew (recommended)
   brew install node

   # Or download from https://nodejs.org/
   ```

2. **Clone and setup:**
   ```bash
   git clone https://github.com/PranavFWL/AI-task-generator-.git
   cd AI-task-generator-
   npm install
   cp .env.example .env.local
   ```

3. **Edit `.env.local`** with your favorite editor

4. **Run:**
   ```bash
   npm run dev
   ```

### Linux / WSL

1. **Install Node.js:**
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Verify
   node --version
   npm --version
   ```

2. **Clone and setup:**
   ```bash
   git clone https://github.com/PranavFWL/AI-task-generator-.git
   cd AI-task-generator-
   npm install
   cp .env.example .env.local
   ```

3. **Edit `.env.local`:**
   ```bash
   nano .env.local
   # Add your API key, then Ctrl+X, Y, Enter
   ```

4. **Run:**
   ```bash
   npm run dev
   ```

---

## 🧪 Testing the Application

### Step 1: Open the App
- Navigate to http://localhost:3000
- You should see the AI Task Generator interface

### Step 2: Test with Example
Enter this test prompt:
```
Build a simple todo app with user authentication and task management
```

### Step 3: Analyze
- Click "Analyze Project"
- Wait ~30-60 seconds for AI processing
- You should see:
  - Generated tasks (8-12 tasks)
  - Execution plan
  - AI analysis

### Step 4: Download
- Click "Download ZIP"
- You'll get a `todo-app.zip` file
- Extract and explore the generated code

### Step 5: Verify Generated Code
```bash
unzip todo-app.zip
cd todo-app
ls -la
```

You should see:
- `frontend/` directory with React app
- `backend/` directory with Express app
- `README.md` with setup instructions
- `START.sh` / `START.bat` scripts

---

## 📊 System Requirements

### Minimum Requirements
- **CPU:** 2 cores
- **RAM:** 4 GB
- **Disk:** 500 MB free space
- **Internet:** Required for AI API calls

### Recommended
- **CPU:** 4+ cores
- **RAM:** 8+ GB
- **Disk:** 1 GB free space
- **Internet:** Broadband connection

---

## 🔐 Security Notes

1. **Never commit `.env.local`** - It contains your API key
2. **Don't share your API key** - Each developer should use their own
3. **Monitor API usage** - Check your Gemini dashboard regularly
4. **Rate limiting** - Free tier has 1500 requests/day limit

---

## 📞 Support

### Having Issues?

1. **Check documentation:**
   - README.md
   - ENHANCEMENT_COMPLETE.md
   - IMPLEMENTATION_SUMMARY.md

2. **Common solutions:**
   - Clear cache: `rm -rf .next node_modules && npm install`
   - Restart server: `Ctrl+C` then `npm run dev`
   - Check API key: Verify at https://makersuite.google.com/

3. **Report issues:**
   - GitHub Issues: https://github.com/PranavFWL/AI-task-generator-/issues
   - Include: OS, Node version, error message, steps to reproduce

---

## 🎉 Success!

If you've reached this point and can:
- ✅ Access http://localhost:3000
- ✅ See the AI Task Generator interface
- ✅ Analyze a project description
- ✅ Download generated code

**Congratulations! You're all set up!** 🎊

Now you can start generating full-stack applications from simple descriptions.

---

## 📚 Next Steps

1. **Read the documentation:**
   - `README.md` - Project overview
   - `ENHANCEMENT_COMPLETE.md` - Feature details
   - `IMPLEMENTATION_SUMMARY.md` - Technical details

2. **Try complex projects:**
   - Task management apps
   - E-commerce systems
   - Social media platforms
   - Blog systems

3. **Customize generated code:**
   - All generated code is editable
   - Add your own features
   - Deploy to production

4. **Share your creations:**
   - Tweet about it
   - Write blog posts
   - Create tutorials

---

**Happy Coding! 🚀**

Built with ❤️ using Claude Code
