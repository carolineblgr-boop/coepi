# Security Policy

## Overview

This document outlines security best practices and policies for the coepi-next project.

---

## 🔐 Secrets & Credentials Management

### Rules
- **NEVER commit** `.env.local` or any `.env.*.local` files
- **NEVER commit** `credentials.json` or `token.json`
- **NEVER commit** API keys, tokens, or secrets of any kind
- Use `.env.example` as a template for required variables
- Each developer creates their own `.env.local` locally

### Environment Variables
All sensitive configuration must be set via environment variables:

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your local credentials
# This file is ignored by git
```

### Rotating Secrets
- Rotate `AUTH_SECRET` every 90 days: `openssl rand -base64 32`
- Rotate `GOOGLE_CLIENT_SECRET` whenever compromised or regularly
- Use different credentials for development vs. production
- Store production secrets in GitHub Secrets or your hosting platform's secret manager

---

## 🛡️ Pre-commit Security Checks

The project includes automated pre-commit hooks to prevent accidental secret commits.

### What the Checks Do
✅ Scan for common secret patterns (Google tokens, auth secrets, etc.)  
✅ Prevent committing `.env` files  
✅ Prevent committing credential files  

### If a Commit is Blocked
```bash
# Review why it was blocked - likely a real issue
git diff --cached

# If it's a false positive:
git commit --no-verify  # Use with caution!

# Better: Remove the sensitive file and try again
git reset HEAD <file>
rm <file>
```

---

## 🚀 Production Deployment

### GitHub Secrets Setup
For production deployments, store secrets in GitHub repository secrets:

1. Go to Settings → Secrets and variables → Actions
2. Add required secrets:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `AUTH_SECRET`
   - Other sensitive values

### Environment Variables in CI/CD
In `.github/workflows/*.yml` files:

```yaml
env:
  GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
  GOOGLE_CLIENT_SECRET: ${{ secrets.GOOGLE_CLIENT_SECRET }}
  AUTH_SECRET: ${{ secrets.AUTH_SECRET }}
```

---

## 📋 Required Environment Variables

### Google OAuth
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- Get these from: https://console.cloud.google.com/apis/credentials

### NextAuth Configuration
- `AUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Set to your deployment URL

### See `.env.example` for full template

---

## 🔍 GitIgnore Rules

The `.gitignore` file is configured to prevent committing:

### Always Ignored
- Environment files: `.env`, `.env.*.local`
- OAuth credentials: `credentials.json`, `token.json`
- Private keys: `*.pem`, `*.key`
- Database files: `*.db`, `*.sqlite`
- Logs: `*.log`
- Dependencies: `node_modules/`, `venv/`

### Double-Check Before Committing
Always review `git status` and `git diff --cached` to verify no secrets are included.

---

## 📚 Dependency Security

### Regular Audits
```bash
# Check for vulnerable dependencies
npm audit

# Update vulnerable packages
npm audit fix
npm update
```

### Keep Dependencies Updated
- Review dependency updates regularly
- Use `npm update` to get latest versions
- Run `npm audit` after updates

---

## 🚨 Security Incidents

### If You Accidentally Commit a Secret

**Immediate Actions:**
1. **DO NOT PUSH** if it hasn't been pushed yet
2. Remove from staging: `git reset HEAD <file>`
3. Amend the previous commit: `git commit --amend`
4. Force push (if unpushed): `git push --force-with-lease`

**If Already Pushed:**
1. Revoke the compromised secret immediately
2. Use `git filter-repo` or `BFG Repo-Cleaner` to remove from history
3. Force push the cleaned history
4. Create new secrets

### Reporting Security Issues
- **DO NOT** open public GitHub issues for security vulnerabilities
- Contact the maintainers privately
- Include details about the exposure and timeline

---

## ✅ Security Checklist

Before each deployment:

- [ ] All `.env.local` files are gitignored and not committed
- [ ] No credentials.json or token.json in the repo
- [ ] No private keys (.pem, .key) in the repo
- [ ] GitHub Secrets are configured for production
- [ ] Environment variables are set in deployment platform
- [ ] `npm audit` passes with no critical vulnerabilities
- [ ] Recent code review completed
- [ ] Secrets have been rotated recently

---

## 🔗 Resources

- [Google Cloud OAuth Setup](https://console.cloud.google.com/apis/credentials)
- [NextAuth Security](https://next-auth.js.org/deployment)
- [OWASP Security Best Practices](https://owasp.org/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

## Questions?

If you have security concerns or questions:
1. Review this policy
2. Check `.env.example` for required variables
3. Ensure `.env.local` exists and is in `.gitignore`
4. Run pre-commit checks before committing

Last updated: August 10, 2026
