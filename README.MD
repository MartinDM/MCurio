# MCurio

MCurio is a museum curation CMS for managing collections and related museum operations.
It provides authenticated, museum-scoped access to records such as items, contacts,
exhibitions, and condition reports.

## What MCurio Is

- A multi-tenant museum management app where a museum acts as the subscription boundary
- Built as a Refine admin application with Supabase as backend and auth provider
- Designed so users only access data for their assigned museum

## Tech Stack

- Frontend: React + TypeScript + Vite
- UI: Ant Design + Refine (`@refinedev/*`)
- Backend: Supabase (Postgres + Auth + RLS)
- Data access: Supabase client via Refine `dataProvider`
- Routing: `react-router` with Refine router integration

## Supported Entities

The app currently supports the following core entities:

- `museums`
  - Museum profile and account scope boundary
- `profiles`
  - User-to-museum mapping and admin flag (`is_admin`)
- `items`
  - Collection objects/artifacts
  - Can be linked to contacts and exhibitions
- `contacts`
  - People/organizations associated with items and museum operations
- `exhibitions`
  - Exhibition records for museums
- `condition_reports`
  - Conservation/condition tracking linked to items

## Access & Security Model

- Authentication is handled by Supabase Auth
- Row Level Security (RLS) is enabled for museum-scoped tables
- Access is filtered by the user profile's `museum_id`
- Users without an assigned museum are redirected to a dedicated no-access page

## Local Development

### 1) Install dependencies

```bash
npm install
```

### 2) Start local Supabase

```bash
supabase start
```

### 3) Ensure database is migrated

```bash
supabase db reset
```

### 3.1) Recommended reset flow (migrations + seed + auth users)

```bash
npm run seed:snaplet:reset
```

This command runs:

- `supabase db reset`
- `npm run seed:snaplet:sync`
- `npm run seed:auth:users`

So after every reset you get:

- schema + RLS migrations applied
- SQL seed data loaded from `supabase/seed.sql`
- local auth users recreated and mapped to the demo museum

### 4) Run the app

```bash
npm run dev
```

### 5) Build check

```bash
npm run build
```

## Snaplet Seeding (Optional)

Snaplet is configured for schema-aware seed tooling in this project.

- Sync schema model from local DB:

```bash
npm run seed:snaplet:sync
```

- Generate Snaplet seed artifacts:

```bash
npm run seed:snaplet:generate
```

- Seed local auth users only:

```bash
npm run seed:auth:users
```

Notes:

- Snaplet reads `seed.config.ts`.
- Default DB connection is local Supabase (`postgresql://postgres:postgres@127.0.0.1:54322/postgres`).
- To override DB target, set `SNAPLET_DATABASE_URL` (or `DATABASE_URL`).

## Project Structure (High-Level)

- `src/routes/` — Refine pages and route-level features
- `src/providers/` — Auth/data/live providers
- `src/config/resources.tsx` — Resource/menu configuration
- `src/lib/supabase.ts` — Shared Supabase client
- `supabase/migrations/` — Database schema and RLS migrations

## Default Local Login Users

The following users are auto-created by `npm run seed:auth:users` and by `npm run seed:snaplet:reset`:

- `michael.scott@dundermifflin.com` / `demodemo`
- `martinonotts@gmail.com` / `flanimals`

Both are assigned to the seeded primary museum (`11111111-1111-4111-8111-111111111111`) for immediate access.
