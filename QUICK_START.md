# Quick Start Guide - AgentTask AI Webapp

## 🚀 Start in 3 Steps

### Step 1: Navigate to Webapp Directory
```bash
cd /home/pranav/Software_Lab/webapp
```

### Step 2: Run the Startup Script
```bash
./start-webapp.sh
```

OR manually:
```bash
npm run dev
```

### Step 3: Open Browser
```
http://localhost:3000
```

## 📝 Try It Now

Copy and paste this example into the text area:

```
Create a real-time chat application with the following features:
- User authentication with JWT
- Real-time messaging using WebSockets
- Message history stored in MongoDB
- File sharing capabilities
- User presence indicators
- Push notifications
- Mobile responsive design
```

Then click **"Analyze Project"** and watch the AI break it down into tasks!

## 🎯 What You'll See

### 1. AI Analysis Section
A summary of the project understanding and approach.

### 2. Task Cards
Each task displayed professionally with:
- ✅ Task number and title
- ✅ Full description
- ✅ Type badge (Frontend/Backend/etc.)
- ✅ Priority level
- ✅ Time estimate
- ✅ Dependencies (if any)
- ✅ Acceptance criteria with checkmarks

### 3. Execution Plan
Step-by-step plan for implementing all tasks.

## 📊 Task Type Colors

- 🔵 **Frontend** - Blue
- 🟣 **Backend** - Purple
- 🟢 **Database** - Green
- 🟠 **Testing** - Orange
- 🔴 **Deployment** - Red
- 🔷 **DevOps** - Cyan

## ⚠️ Troubleshooting

### Port Already in Use
```bash
# Kill existing process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### API Key Error
Ensure `/home/pranav/Software_Lab/.env` contains:
```
GEMINI_API_KEY=your_api_key_here
```

### TypeScript Errors
Build parent project first:
```bash
cd /home/pranav/Software_Lab
npm run build
cd webapp
npm run dev
```

## 🎨 Example Projects to Try

### E-commerce Platform
```
Build an e-commerce platform with product catalog, shopping cart,
payment integration, order management, and admin dashboard
```

### Social Media App
```
Create a social media application with user profiles, posts, comments,
likes, followers system, and real-time notifications
```

### Project Management Tool
```
Develop a project management tool with task boards, team collaboration,
time tracking, file attachments, and reporting features
```

### Blog Platform
```
Build a blog platform with markdown editor, categories, tags,
comments, search functionality, and SEO optimization
```

## 📱 Access from Other Devices

The webapp is accessible on your local network:

```
http://[your-ip]:3000
```

To find your IP:
```bash
hostname -I | awk '{print $1}'
```

## 🔄 Stopping the Server

Press `Ctrl + C` in the terminal

## 📚 More Information

- Full documentation: `README_USAGE.md`
- Task card details: `TASK_CARD_STRUCTURE.md`
- Completion summary: `COMPLETION_SUMMARY.md`

## ✨ Features Highlight

✅ **Real AI Processing** - Uses Google Gemini AI
✅ **Professional UI** - Modern, clean design
✅ **Complete Task Info** - All fields displayed
✅ **Responsive Design** - Works on all devices
✅ **Real-time Feedback** - Loading states and errors
✅ **Color Coded** - Easy visual scanning

---

**Enjoy using AgentTask AI!** 🎉
