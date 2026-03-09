# Backend Plan

## Stack

| Component        | Technology                 |
| ---------------- | -------------------------- |
| Auth             | NextAuth.js (Google OAuth) |
| ORM + migrations | Prisma                     |
| Database         | PostgreSQL                 |
| DB hosting       | Neon.tech (free tier)      |
| API              | Next.js Route Handlers     |
| App hosting      | Vercel                     |

## Implementation Steps

### 1. Database

- [x] Create an account on neon.tech
- [x] Get `DATABASE_URL`
- [x] Install Prisma (`npm install prisma @prisma/client`)
- [x] Add npm scripts to `package.json`:
  - `db:migrate` — create and apply a migration
  - `db:push` — apply schema without a migration file (for early stage)
  - `db:studio` — open visual DB interface in the browser
  - `db:generate` — regenerate TypeScript types from schema
- [x] Write schema (`User`, `CV`)
- [x] Run first migration (`npm run db:migrate`)

### 2. Auth

- [x] Create a Google OAuth app in Google Cloud Console
- [x] Install NextAuth.js and Prisma Adapter (`npm install next-auth @auth/prisma-adapter`)
- [x] Configure Google Provider
- [x] Save user to DB via adapter

### 3. CV CRUD

- [x] `GET /api/cv` — list CVs for current user
- [x] `POST /api/cv` — create CV
- [x] `PATCH /api/cv/[id]` — update CV
- [x] `DELETE /api/cv/[id]` — delete CV
- [x] Protect routes via NextAuth session

### 4. Deploy

- [ ] Connect repository to Vercel
- [ ] Add env variables (DATABASE_URL, NEXTAUTH_SECRET, Google credentials)
- [ ] Change Vercel Build Command to `prisma migrate deploy && next build`
  - This ensures migrations are applied to the DB before the new app version is built
