#!/bin/bash

# AI Task Generator - Installation Script
# Supports: Linux, macOS, WSL

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Print banner
echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║                                                ║"
echo "║       AI Task Generator - Setup Script        ║"
echo "║                                                ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
print_info "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo ""
    echo "Please install Node.js 18 or higher:"
    echo "  • macOS: brew install node"
    echo "  • Linux: https://nodejs.org/en/download/package-manager"
    echo "  • Windows: https://nodejs.org/"
    echo ""
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js $NODE_VERSION detected"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

NPM_VERSION=$(npm --version)
print_success "npm $NPM_VERSION detected"

echo ""

# Check if .env.local exists
print_info "Checking environment configuration..."
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        print_warning ".env.local not found, creating from .env.example"
        cp .env.example .env.local
        print_success "Created .env.local"
        echo ""
        print_warning "⚠️  IMPORTANT: You need to add your Gemini API key!"
        echo ""
        echo "  1. Get your API key from: https://makersuite.google.com/app/apikey"
        echo "  2. Edit .env.local and replace 'your_gemini_api_key_here'"
        echo ""

        # Ask if user wants to add key now
        read -p "Do you have your API key ready? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            read -p "Enter your Gemini API key: " API_KEY
            if [ ! -z "$API_KEY" ]; then
                sed -i.bak "s/your_gemini_api_key_here/$API_KEY/" .env.local
                rm -f .env.local.bak
                print_success "API key added to .env.local"
            fi
        else
            print_warning "Remember to add your API key to .env.local before running the app"
        fi
    else
        print_error ".env.example not found"
        exit 1
    fi
else
    print_success ".env.local already exists"
fi

echo ""

# Install dependencies
print_info "Installing dependencies..."
echo ""

if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

echo ""

# Check if installation was successful
if [ -d "node_modules" ]; then
    print_success "node_modules directory created"
else
    print_error "node_modules directory not found"
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║                                                ║"
echo "║           Installation Complete! 🎉            ║"
echo "║                                                ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

print_info "Next steps:"
echo ""
echo "  1. Start the development server:"
echo "     ${GREEN}npm run dev${NC}"
echo ""
echo "  2. Open your browser:"
echo "     ${BLUE}http://localhost:3000${NC}"
echo ""
echo "  3. Enter a project description and click 'Analyze Project'"
echo ""

# Check if API key is set
if grep -q "your_gemini_api_key_here" .env.local 2>/dev/null; then
    echo ""
    print_warning "⚠️  Don't forget to add your Gemini API key to .env.local!"
    echo "     Get it from: ${BLUE}https://makersuite.google.com/app/apikey${NC}"
    echo ""
fi

print_info "For more information, see SETUP.md"
echo ""
print_success "Happy coding! 🚀"
echo ""
