#!/bin/bash

# AgentTask AI - Webapp Startup Script

echo "🚀 Starting AgentTask AI Web Application..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the webapp directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if parent .env file exists
if [ ! -f "../.env" ]; then
    echo "⚠️  Warning: Parent .env file not found at ../.env"
    echo "   Make sure GEMINI_API_KEY is configured in /home/pranav/Software_Lab/.env"
    echo ""
fi

# Build parent project if dist doesn't exist
if [ ! -d "../dist" ]; then
    echo "🔨 Building parent project..."
    cd .. && npm run build && cd webapp
    echo ""
fi

echo "✅ Starting development server..."
echo ""
echo "   📱 Local:   http://localhost:3000"
echo "   🌐 Network: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
