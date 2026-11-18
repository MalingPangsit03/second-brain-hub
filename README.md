<div align="center">

# Second Brain & Productivity Hub 🧠⚡
### A unified, distraction-free developer workspace combining Markdown notes, priority task execution, habit streak heatmaps, and a public Digital Garden.

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Database GUI](#database-gui)

</div>

---

## Overview
**Second Brain Hub** is a full-stack production-grade productivity workspace built for developers. It eliminates context-switching by combining local-first knowledge management with real-time task and habit execution, backed by a robust PostgreSQL database.

## Features
- 🔐 **Secure Authentication**: Credentials-based authentication with password hashing (`bcryptjs`) & NextAuth v5.
- 📊 **Daily Command Center**: Real-time KPI summary, interactive task toggles, quick task creation, and 35-day habit consistency heatmaps.
- 📝 **Markdown Knowledge Base (`/notes`)**: Full CRUD Markdown editor with instant search, tag filtering, live split-pane preview, and syntax-styled code blocks.
- 🌿 **Public Digital Garden (`/p/[slug]`)**: Publish any technical note instantly to a shareable, read-only public blog page.
- ✅ **Dedicated Workspaces**: Focused management views for `/tasks` and `/habits` with custom creation and streak tracking.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Database**: PostgreSQL
- **ORM**: Prisma ORM

---

## Getting Started

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/your-username/second-brain-hub.git
cd second-brain-hub
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add your PostgreSQL connection string:
\`\`\`env
DATABASE_URL="postgresql://username:password@localhost:5432/second_brain_db?schema=public"
AUTH_SECRET="your-super-secret-key-random-string"
\`\`\`

### 4. Run Migrations & Seed Database
\`\`\`bash
npx prisma migrate dev --name init
npx prisma db seed
\`\`\`

### 5. Start Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Management
You can visually inspect your PostgreSQL database tables, relationships, and rows using Prisma Studio:
\`\`\`bash
npx prisma studio
\`\`\`
This launches an interactive browser GUI at `http://localhost:5555`.
