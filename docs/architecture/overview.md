# Second Brain & Productivity Hub — Architecture

## Tech Stack
- **Frontend & Routing**: Next.js 15 (App Router), React, Tailwind CSS v4
- **Language**: TypeScript (Strict Mode)
- **Database & ORM**: PostgreSQL, Prisma ORM
- **Authentication**: NextAuth.js v5 (Credentials Provider), bcryptjs
- **Markdown & Rendering**: react-markdown, remark-gfm

## Database Schema Model
The application uses a relational PostgreSQL schema consisting of 6 core models:
1. **User**: Authentication, profile data, and ownership relation.
2. **Note**: Markdown-enabled notes supporting public Digital Garden slugs (`/p/[slug]`).
3. **Tag**: Many-to-many relationship with Notes for instant filtering.
4. **Task**: Priority-based task tracking with completion status.
5. **Habit**: Daily routines tracked over time.
6. **HabitLog**: Historical check-ins powering the 35-day consistency heatmap.
