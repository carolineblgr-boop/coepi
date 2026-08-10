# Deployment Guide

This guide covers deploying CoEpi to production safely and securely.

## Pre-Deployment Checklist

- [ ] All credentials removed from repository (✅ Done)
- [ ] `.gitignore` includes `.env.*.local` and data files (✅ Done)
- [ ] `SECURITY.md` reviewed and understood
- [ ] Environment variables documented in `.env.example`
- [ ] GitHub secrets configured
- [ ] Database ready (PostgreSQL for production)
- [ ] SSL/HTTPS enabled
- [ ] Privacy policy written
- [ ] Terms of service written

## Production Environment Setup

### 1. Platform Choice

**Recommended**: Vercel + Railway (PostgreSQL)

```
Frontend → Vercel (Free tier available)
Backend → Vercel Serverless Functions
Database → Railway PostgreSQL ($5-10/month)
```

**Alternative**: Render, Heroku, or DigitalOcean

### 2. Set Production Secrets

#### GitHub Settings → Secrets and Variables → Actions

Add these secrets (NOT in .env.local, NOT in .env.example):

```bash
# Google OAuth (Production Client ID)
GOOGLE_CLIENT_ID=<production_client_id>
GOOGLE_CLIENT_SECRET=<production_secret>

# NextAuth
AUTH_SECRET=<generate: openssl rand -base64 32>

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Encryption Keys (for future multi-user)
DATABASE_ENCRYPTION_KEY=<generate: openssl rand -base64 32>
GMAIL_ENCRYPTION_KEY=<generate: openssl rand -base64 32>
```

### 3. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
# Settings → Environment Variables
```

### 4. PostgreSQL Setup

**Option A: Railway (Recommended)**
- Sign up at railway.app
- Create new project → PostgreSQL
- Copy DATABASE_URL
- Add to Vercel environment variables

**Option B: Managed Services**
- AWS RDS
- Google Cloud SQL
- Azure Database for PostgreSQL

### 5. Google OAuth Production

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create **NEW OAuth 2.0 credentials** for production
3. Add authorized domains:
   ```
   yourdomain.com
   www.yourdomain.com
   *.yourdomain.com
   ```
4. Add authorized redirect URIs:
   ```
   https://yourdomain.com/api/auth/callback/google
   https://www.yourdomain.com/api/auth/callback/google
   ```

## Environment-Specific Configuration

### Development
```bash
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=sqlite:./jobs.db
DEBUG=true
```

### Staging
```bash
NODE_ENV=production
NEXTAUTH_URL=https://staging.yourdomain.com
DATABASE_URL=postgresql://...
DEBUG=false
```

### Production
```bash
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
DATABASE_URL=postgresql://...
DEBUG=false
```

## Database Migrations

### First Deployment
```bash
# Create tables and schema
npm run migrate:latest

# Seed with test data (if needed)
npm run seed
```

### Future Migrations
```bash
# Create migration
npm run migrate:create -- add_new_feature

# Run migration
npm run migrate:latest

# Rollback if needed
npm run migrate:rollback
```

## Monitoring & Maintenance

### Essential Monitoring
- ✅ Set up error tracking (Sentry)
- ✅ Monitor database performance
- ✅ Set up log aggregation
- ✅ Monitor authentication failures
- ✅ Track API response times

### Automated Backups
```bash
# Daily PostgreSQL backups
# Use Railway/AWS/GCP managed backups
# Test restore procedures monthly
```

### Security Updates
- [ ] Monitor Next.js security updates
- [ ] Monitor NextAuth updates
- [ ] Monitor npm dependencies (npm audit)
- [ ] Review GitHub security advisories
- [ ] Update regularly (at least monthly)

## Monitoring Dashboard

Use these free services:

1. **Vercel Analytics** (Built-in)
   - Performance metrics
   - Error tracking
   - User analytics

2. **Sentry** (Free tier)
   ```javascript
   // Add to next.config.ts
   import * as Sentry from "@sentry/nextjs";
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

3. **UptimeRobot** (Free tier)
   - Monitor uptime
   - Ping every 5 minutes
   - Email alerts

## Rolling Back Production

If something breaks:

```bash
# View deployment history
vercel list

# Rollback to previous deployment
vercel rollback
```

## Security Checklist for Production

### Infrastructure
- [ ] HTTPS/SSL enabled
- [ ] DDoS protection
- [ ] Rate limiting configured
- [ ] Firewall rules in place
- [ ] Database encryption at rest

### Application
- [ ] Environment variables are secrets (not in code)
- [ ] No debug mode in production
- [ ] CSRF protection enabled (NextAuth default)
- [ ] XSS protection enabled
- [ ] SQL injection prevention (using ORM/parameterized queries)

### Secrets Management
- [ ] Secrets in GitHub, not in code
- [ ] Rotate AUTH_SECRET every 90 days
- [ ] Rotate DATABASE_PASSWORD quarterly
- [ ] Rotate Google OAuth credentials annually
- [ ] Never commit .env files

### Monitoring
- [ ] Error tracking enabled (Sentry)
- [ ] Security alerts configured
- [ ] Uptime monitoring active
- [ ] Database backups verified
- [ ] Logs being collected

## Incident Response

If a security issue occurs:

### Immediate (First 5 minutes)
1. Assess severity
2. Take down app if necessary
3. Revoke compromised credentials
4. Alert users if data exposed

### Short-term (Next hour)
1. Apply hotfix
2. Deploy to production
3. Verify fix works
4. Document what happened

### Follow-up (Next 24 hours)
1. Root cause analysis
2. Update security measures
3. Communicate with users
4. File incident report

## Useful Commands

```bash
# Check production environment
vercel env pull

# View production logs
vercel logs

# Monitor real-time
vercel logs --follow

# Check GitHub secrets
gh secret list

# View deployments
vercel list
```

## Support & Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [NextAuth Deployment](https://next-auth.js.org/deployment)
- [Railway Docs](https://docs.railway.app)

---

**Questions?** See SECURITY.md and ARCHITECTURE.md for more details.

Last Updated: August 2026
