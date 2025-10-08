# 🔒 Quick Security Fix Guide

## ⚠️ Your API Keys Were Exposed - Follow These Steps NOW

### Step 1: Revoke Compromised Keys (DO THIS FIRST!)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Delete these exposed keys:
   - `***REMOVED_API_KEY***`
   - `***REMOVED_API_KEY***`
3. Generate a new API key
4. Save it securely (you'll need it in Step 3)

### Step 2: Clean Git History

Run the automated cleanup script:

```bash
cd /home/pranav/Software_Lab
./clean-git-history.sh
```

This script will:
- Remove `.env` from all git history
- Replace hardcoded API keys with `***REMOVED_API_KEY***`
- Clean up git objects
- Prepare the repository for force push

**Alternative Manual Method** (if script fails):

```bash
# Install git-filter-repo
pipx install git-filter-repo

# Navigate to your repository
cd /home/pranav/Software_Lab

# Remove .env from history
git filter-repo --invert-paths --path .env --force

# Remove hardcoded keys (create a replacement file first)
echo "***REMOVED_API_KEY***==>***REMOVED***" > /tmp/keys.txt
echo "***REMOVED_API_KEY***==>***REMOVED***" >> /tmp/keys.txt
git filter-repo --replace-text /tmp/keys.txt --force

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Step 3: Update Local Environment

```bash
cd /home/pranav/Software_Lab

# Copy example file
cp .env.example .env

# Edit with your NEW API key
nano .env
# or
vim .env
```

Add your new API key:
```env
GEMINI_API_KEY=your_new_api_key_here
```

### Step 4: Push Cleaned History to GitHub

```bash
cd /home/pranav/Software_Lab

# Add the cleaned files
git add .gitignore .env.example SECURITY.md QUICK_SECURITY_FIX.md clean-git-history.sh
git add INTEGRATION_COMPLETE.md MANUAL_TESTING.md README.md

# Commit the security improvements
git commit -m "Security: Remove exposed API keys and add security measures

- Add .env to .gitignore
- Create .env.example with placeholders
- Remove hardcoded API keys from documentation
- Add comprehensive security documentation
- Create automated cleanup script

🔒 All exposed keys have been revoked and removed from history"

# Force push to remote (overwrites history)
git push origin --force --all

# Also push tags if you have any
git push origin --force --tags
```

### Step 5: Verify Security

```bash
# Check that .env is ignored
git status

# Verify .env is not tracked (should show nothing)
git ls-files | grep .env

# Verify no API keys in latest commit
git show HEAD | grep -i "AIza"
```

### Step 6: Notify Collaborators

If you have collaborators, they need to:

```bash
# Backup their local changes
git stash

# Delete their old clone
cd ..
rm -rf Software_Lab

# Re-clone the cleaned repository
git clone <your-repo-url>
cd Software_Lab

# Set up their own .env
cp .env.example .env
# Add their own API key
```

## ✅ What We've Fixed

- ✅ Created `.gitignore` to prevent future `.env` commits
- ✅ Created `.env.example` with safe placeholder values
- ✅ Removed hardcoded keys from `INTEGRATION_COMPLETE.md`
- ✅ Removed hardcoded keys from `MANUAL_TESTING.md`
- ✅ Updated `README.md` with security best practices
- ✅ Created comprehensive `SECURITY.md` documentation
- ✅ Created automated cleanup script `clean-git-history.sh`

## 🔐 Security Checklist

- [ ] Revoked old API keys at Google AI Studio
- [ ] Generated new API key
- [ ] Ran cleanup script or manual commands
- [ ] Updated local `.env` with new key
- [ ] Force pushed cleaned history to GitHub
- [ ] Verified `.env` is not tracked in git
- [ ] Notified collaborators (if any)
- [ ] Set up API restrictions in Google Cloud Console

## 🛡️ Prevent Future Exposure

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use `.env.example` for documentation** - Already created
3. **Review changes before committing**:
   ```bash
   git diff --cached  # Review staged changes
   ```
4. **Enable GitHub secret scanning** in repository settings
5. **Set up pre-commit hooks** to prevent accidental commits

## 📚 Additional Resources

- [SECURITY.md](./SECURITY.md) - Complete security guidelines
- [Google AI Security](https://ai.google.dev/docs/security)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

## ❓ Need Help?

If you encounter issues:
1. Check `SECURITY.md` for detailed instructions
2. Review error messages carefully
3. Make sure you have backed up important data
4. Don't hesitate to ask for help before proceeding

---

**Remember: Security first! Take your time and follow each step carefully.**
