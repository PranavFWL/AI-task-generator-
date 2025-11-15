# Setup Guide for Evaluators

## Quick Setup (3 steps)

### 1. Clone and Install
```bash
git clone https://github.com/PranavFWL/AI-task-generator-.git
cd AI-task-generator-
npm install
```

### 2. Configure API Key
```bash
cp .env.example .env
```

Edit the `.env` file and add your Google Gemini API key:

**IMPORTANT:** Do NOT use quotes around the API key!

```env
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_GENAI_USE_VERTEXAI=FALSE
```

✅ **Correct** - No quotes  
❌ **Wrong** - GEMINI_API_KEY='AIzaSy...'

### 3. Run
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Getting an API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIzaSy...`)
4. Paste into `.env` file WITHOUT quotes

---

## Troubleshooting

**Error: "API key not found"**
- Make sure `.env` file is in the project root directory
- Remove any quotes around the API key values
- Restart the dev server (`Ctrl+C` then `npm run dev`)

**Port already in use**
- Change port: `npm run dev -- -p 3001`

---

## Technology

This project uses **Google ADK (Agent Development Kit) v0.1.3** for AI-powered task generation.
