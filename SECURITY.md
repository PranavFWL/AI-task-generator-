# Security Guidelines

## API Key Management

### ⚠️ IMPORTANT: Never Expose API Keys

This project uses Google Gemini API keys which should **never** be committed to version control or exposed publicly.

### Proper Setup

1. **Use Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual API key
   ```

2. **Verify .gitignore**
   - `.env` is already listed in `.gitignore`
   - Never remove `.env` from `.gitignore`

3. **Get Your API Key**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Generate a new API key
   - Add it to your local `.env` file only

### What NOT to Do

❌ Never commit `.env` files
❌ Never hardcode API keys in code
❌ Never share keys in documentation
❌ Never push keys to public repositories
❌ Never log API keys in console output

### What TO Do

✅ Use `.env` for local development
✅ Use environment variables in production
✅ Rotate keys regularly
✅ Use API key restrictions in Google Cloud Console
✅ Add `.env` to `.gitignore`

## If Your Key Was Exposed

If you accidentally committed your API key to Git:

1. **Immediately Revoke the Key**
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Delete the exposed key
   - Generate a new one

2. **Clean Git History**

   Option A - Using git-filter-repo (recommended):
   ```bash
   pip3 install git-filter-repo
   cd /path/to/repo

   # Remove .env from all history
   git filter-repo --path .env --invert-paths

   # Force push to remote
   git push origin --force --all
   ```

   Option B - Using BFG Repo-Cleaner:
   ```bash
   # Download BFG
   wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

   # Remove secrets
   java -jar bfg-1.14.0.jar --delete-files .env

   # Clean and push
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push origin --force --all
   ```

3. **Update Your Local Environment**
   ```bash
   # Update .env with new key
   echo "GEMINI_API_KEY=your_new_key_here" > .env
   ```

## Production Deployment

### Environment Variable Injection

Use your platform's secret management:

- **Heroku**: `heroku config:set GEMINI_API_KEY=your_key`
- **AWS**: Use AWS Secrets Manager
- **Google Cloud**: Use Secret Manager
- **Vercel**: Add to Environment Variables in dashboard
- **Netlify**: Add to Site settings → Environment variables

### API Key Restrictions

Add restrictions in [Google Cloud Console](https://console.cloud.google.com):
- IP address restrictions
- HTTP referrer restrictions
- API restrictions (limit to Gemini API only)

### Rate Limiting

Implement rate limiting to prevent API abuse:
```typescript
// Example rate limiting
const rateLimit = {
  maxRequests: 100,
  windowMs: 60000 // 1 minute
};
```

## Code Security Best Practices

1. **Input Validation**
   - Always validate user input before sending to AI
   - Sanitize data to prevent injection attacks

2. **Error Handling**
   - Never expose API keys in error messages
   - Log errors securely without sensitive data

3. **Dependencies**
   - Keep dependencies updated: `npm audit`
   - Review security advisories regularly

4. **Access Control**
   - Implement authentication for API endpoints
   - Use JWT tokens with proper expiration

## Monitoring

- Monitor API usage in [Google Cloud Console](https://console.cloud.google.com)
- Set up billing alerts to detect unusual activity
- Review access logs regularly

## Reporting Security Issues

If you discover a security vulnerability:
1. **Do NOT** open a public issue
2. Email the maintainer privately
3. Include detailed steps to reproduce
4. Wait for confirmation before public disclosure

## Compliance

- Follow GDPR guidelines for user data
- Comply with data retention policies
- Implement proper data encryption
- Document security measures

## Resources

- [Google AI Security Best Practices](https://ai.google.dev/docs/security)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

**Remember: Security is everyone's responsibility. When in doubt, ask!**
