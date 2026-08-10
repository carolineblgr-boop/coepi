# CoEpi Architecture & Multi-User Roadmap

## Current Architecture (v1 - Single User)

### Purpose
Personal job application tracker with secure Google OAuth login.

### Data Storage
```
Local Development:
├── SQLite Database (in-memory or file-based)
├── JSON files: data/jobs_database.json
└── NextAuth Session Storage (default)

Deployment:
└── Same as development (no multi-user support)
```

### Security Model
- ✅ Google OAuth for authentication
- ✅ Environment variables for secrets (.env.local in .gitignore)
- ✅ No personal data exposed in public repo
- ⚠️ Session data tied to single user
- ⚠️ No multi-user data isolation needed

### Perfect For
- 📌 Portfolio project for job applications
- 📌 Personal productivity app
- 📌 GitHub portfolio showcase
- 📌 Hiring manager demonstrations

---

## Planned Architecture (v2 - Multi-User SaaS)

### Purpose
Public web app where anyone can track their own job applications.

### Phase 1: Add Multi-User Support (Month 1-2)

#### Database Migration: SQLite → PostgreSQL

**Current (SQLite):**
```javascript
// Single user, local file
const db = new Database('jobs.db');
```

**Future (PostgreSQL):**
```javascript
// Multi-tenant database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // PostgreSQL
  max: 20,
});
```

#### Data Schema Changes

**Before (Single User):**
```sql
CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  company TEXT,
  role TEXT,
  status TEXT,
  appliedDate DATE,
  notes TEXT
);
```

**After (Multi-User):**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  googleId VARCHAR UNIQUE,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);

CREATE TABLE jobs (
  id UUID PRIMARY KEY,
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company TEXT,
  role TEXT,
  status TEXT,
  appliedDate DATE,
  notes TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  UNIQUE(userId, id)
);

CREATE INDEX idx_jobs_userId ON jobs(userId);
```

#### User Isolation
```typescript
// Ensure users only see their own jobs
export const getJobsForUser = async (userId: string) => {
  return db.query('SELECT * FROM jobs WHERE userId = $1', [userId]);
};

// Prevent data access from other users
const job = await getJob(jobId);
if (job.userId !== session.user.id) {
  throw new Error('Unauthorized');
}
```

---

### Phase 2: Gmail Integration Per User (Month 2-3)

**Current:**
```python
# Single static credentials
credentials = Credentials.from_authorized_user_file('credentials.json')
```

**Future:**
```typescript
// Store encrypted OAuth tokens per user
const userTokens = await getEncryptedTokens(userId);
const gmail = google.gmail({ 
  version: 'v1', 
  auth: userTokens 
});

// Each user has their own Gmail connection
```

**Security Considerations:**
- 🔐 Encrypt tokens before database storage
- 🔐 Use database encryption at rest
- 🔐 Rotate tokens regularly
- 🔐 Never log tokens or sensitive data
- 🔐 Use environment secrets for encryption key

---

### Phase 3: Deployment & Scaling (Month 3-4)

#### Development Environment
```
Local → SQLite ✅ (current)
```

#### Production Environment
```
Railway.app / Vercel / Heroku
├── Frontend: Vercel (Next.js)
├── Backend: Vercel Serverless Functions
├── Database: PostgreSQL (managed)
└── Secrets: GitHub Secrets + Vercel Env Vars
```

#### Environment Variables

**Development:**
```bash
DATABASE_URL=sqlite:./jobs.db
NEXTAUTH_SECRET=dev_secret
GOOGLE_CLIENT_ID=dev_client_id
```

**Production:**
```bash
DATABASE_URL=postgresql://user:pass@host/dbname
NEXTAUTH_SECRET=<secure_random_secret>
GOOGLE_CLIENT_ID=<production_oauth_id>
GOOGLE_CLIENT_SECRET=<production_oauth_secret>
DATABASE_ENCRYPTION_KEY=<secure_key>
GMAIL_ENCRYPTION_KEY=<secure_key>
```

---

## Migration Path

### Step 1: Prepare for Migration (Now)
```
✅ Add userId to database schema
✅ Add multi-user API endpoints
✅ Test with multiple user accounts
✅ Add data isolation checks
```

### Step 2: Migration Script
```typescript
// Backup current data
// Create PostgreSQL database
// Migrate SQLite → PostgreSQL
// Verify data integrity
// Rollback plan (keep SQLite as backup)
```

### Step 3: Deploy Multi-User Version
```
1. Deploy with feature flags
2. Run both SQLite and PostgreSQL in parallel
3. Gradual user migration
4. Sunset SQLite after successful migration
```

---

## Security Best Practices

### Data Protection
- 🔐 Encrypt sensitive data at rest (tokens, personal emails)
- 🔐 Use TLS/HTTPS for all communications
- 🔐 Hash sensitive identifiers
- 🔐 Implement rate limiting
- 🔐 Add CSRF protection (NextAuth handles this)

### Authentication
- 🔐 Use OAuth 2.0 (Google provider)
- 🔐 Implement MFA (future enhancement)
- 🔐 Session timeout: 30 days
- 🔐 Secure cookies: HttpOnly, Secure, SameSite

### Data Privacy
- 🔐 User owns their data
- 🔐 Easy data export (CSV)
- 🔐 One-click account deletion (GDPR compliant)
- 🔐 Privacy policy required
- 🔐 Terms of service required

### Compliance
- 📋 GDPR compliant (EU users)
- 📋 CCPA compliant (California)
- 📋 Privacy policy published
- 📋 Data retention policy
- 📋 Security incident response plan

---

## File Structure Changes

### Current
```
coepi-next/
├── src/lib/db.ts          # SQLite only
├── scripts/               # Python for Gmail
└── data/jobs_database.json # Single user data
```

### Future
```
coepi-next/
├── src/
│   ├── lib/
│   │   ├── db.ts          # PostgreSQL connection
│   │   ├── encryption.ts  # Token encryption
│   │   └── auth.ts        # User management
│   ├── app/api/
│   │   ├── users/         # User management
│   │   ├── jobs/          # Per-user jobs
│   │   └── gmail/         # Per-user Gmail
│   └── middleware/        # Auth middleware
├── migrations/            # Database migrations
├── prisma/                # ORM schema (optional)
└── tests/                 # Integration tests
```

---

## Technology Decisions

### Why PostgreSQL?
- ✅ ACID compliance
- ✅ Scalable to millions of users
- ✅ Full-text search support
- ✅ JSON data support
- ✅ Row-level security

### Why Keep NextAuth?
- ✅ Already integrated
- ✅ Handles OAuth 2.0
- ✅ Secure session management
- ✅ Minimal code changes needed

### Why Add Prisma? (Optional)
- ✅ Type-safe database queries
- ✅ Easy migrations
- ✅ Automatic schema generation
- ✅ Built-in validation

---

## Timeline & Milestones

| Phase | Timeline | Goals |
|-------|----------|-------|
| **v1** | Now | Single-user personal app (✅ Done) |
| **v2.0** | Month 1-2 | PostgreSQL migration, multi-user auth |
| **v2.1** | Month 2-3 | Per-user Gmail integration |
| **v2.2** | Month 3-4 | Production deployment |
| **v3.0** | Quarter 2 | Advanced features (search, export, analytics) |
| **v3.1** | Quarter 3 | Mobile app, Dark mode |

---

## Rollback Plan

If migration fails:
```
1. Keep SQLite database as backup
2. Run feature flags to disable PostgreSQL
3. Revert to SQLite version
4. Investigate issues
5. Plan retry
```

---

## Questions?

For architecture decisions or implementation details:
1. Check this document first
2. Review relevant code sections
3. Open an issue with `[ARCHITECTURE]` prefix

---

**Last Updated**: August 2026  
**Status**: Planning Phase
