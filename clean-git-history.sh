#!/bin/bash

echo "=========================================="
echo "Git History Cleanup Script"
echo "=========================================="
echo ""
echo "⚠️  WARNING: This will rewrite git history!"
echo "   Make sure you have a backup before proceeding."
echo ""
echo "This script will:"
echo "1. Remove .env file from all git history"
echo "2. Remove hardcoded API keys from markdown files"
echo "3. Clean up git objects"
echo "4. Prepare for force push"
echo ""
read -p "Do you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "Step 1: Installing git-filter-repo..."

# Try to install git-filter-repo
if command -v git-filter-repo &> /dev/null; then
    echo "✅ git-filter-repo is already installed"
else
    echo "Installing git-filter-repo with pipx..."
    if command -v pipx &> /dev/null; then
        pipx install git-filter-repo
    else
        echo "Installing pipx first..."
        sudo apt update && sudo apt install -y pipx
        pipx install git-filter-repo
    fi
fi

echo ""
echo "Step 2: Creating replacement file for API keys..."

cat > /tmp/api-key-replacement.txt << 'EOF'
***REMOVED_API_KEY***==>***REMOVED_API_KEY***
***REMOVED_API_KEY***==>***REMOVED_API_KEY***
EOF

echo ""
echo "Step 3: Removing .env from git history..."
cd /home/pranav/Software_Lab
git filter-repo --invert-paths --path .env --force

echo ""
echo "Step 4: Removing hardcoded API keys from files..."
git filter-repo --replace-text /tmp/api-key-replacement.txt --force

echo ""
echo "Step 5: Cleaning up git objects..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "=========================================="
echo "✅ Git history cleaned successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Review the changes: git log"
echo "2. Force push to remote: git push origin --force --all"
echo "3. Notify collaborators to re-clone the repository"
echo ""
echo "⚠️  IMPORTANT: After pushing, revoke the old API keys at:"
echo "   https://aistudio.google.com/app/apikey"
echo ""
