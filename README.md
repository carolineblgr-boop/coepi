# CoEpi - Job Application Tracker

A full-stack web application for tracking and managing job applications with a Kanban board interface.

## ✨ Features

- 📋 **Kanban Board**: Visualize job applications across different stages (Wishlist, Applied, Interviewing, Offer, Rejected, Stale)
- 🔍 **Gmail Integration**: Automatically sync job opportunities from your Gmail inbox
- 💾 **Local Database**: Track applications with company, role, status, and notes
- 📊 **Job Statistics**: View application metrics and trends
- 🔐 **Secure Authentication**: Google OAuth 2.0 for safe login

## 🛠 Tech Stack

- **Frontend**: React 19, Next.js 16, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (local), PostgreSQL (production)
- **Authentication**: NextAuth 5, Google OAuth
- **Language**: TypeScript

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Google OAuth credentials

### Local Development Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/yourusername/coepi-next.git
   cd coepi-next
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

3. **Get Google OAuth Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 Client ID (Web Application)
   - Set redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Add credentials to `.env.local`

4. **Generate AUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```
   Copy output to `.env.local`

5. **Run development server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
coepi-next/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── page.tsx        # Main Kanban board
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   ├── lib/               # Database & utilities
│   ├── types/             # TypeScript types
│   └── auth.ts            # NextAuth config
├── data/                  # Local data (NOT committed)
├── scripts/              # Python utilities
├── SECURITY.md           # Security guidelines
└── ARCHITECTURE.md       # Multi-user design
```

## 🔐 Security

**Important**: This app handles authentication and personal job data. See [SECURITY.md](./SECURITY.md) for:
- Environment variable best practices
- Credential management
- Production deployment guidelines
- Security incident reporting

## 🗄 Database

### Current Architecture (Single-user)
- SQLite for local development
- JSON file storage: `data/jobs_database.json`
- Perfect for personal portfolio use

### Planned Architecture (Multi-user)
- PostgreSQL for scalability
- User authentication with Google OAuth
- Per-user data isolation
- Encrypted data storage

**Full roadmap**: See [ARCHITECTURE.md](./ARCHITECTURE.md)

## 📚 API Reference

### Jobs API
- `GET /api/jobs` - Fetch all jobs
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Auth
- `GET/POST /api/auth/[...nextauth]` - Authentication

### Gmail
- `GET /api/gmail` - Check Gmail config

## 🧪 Development

```bash
# Lint code
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 🗺 Roadmap

- [x] Kanban board UI
- [x] Google OAuth login
- [x] Gmail API integration
- [ ] Multi-user support
- [ ] PostgreSQL migration
- [ ] Advanced filtering
- [ ] Email notifications
- [ ] Light mode

## 📄 License

MIT License

## 🤝 Contributing

Contributions welcome! Please open an issue first to discuss changes.

---

**Made with ❤️ for job seekers**
