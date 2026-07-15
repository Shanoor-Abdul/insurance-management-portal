# Insurance Management Portal

An enterprise insurance management portal built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **MongoDB**, and a **micro-frontend-ready monorepo** architecture.

## Tech Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- MongoDB + Mongoose
- npm workspaces / Turborepo
- Zustand (global state)
- React Query (server state)
- React Hook Form + Zod (forms)
- react-i18next (i18n)
- Recharts (charts)
- RBAC (role-based access control)

## Architecture

```
insurance-management-portal/
├── apps/web          # Shell Next.js application (API routes + pages)
├── packages/ui       # Shared UI component library
├── packages/lib      # Shared business logic: types, API client, store, i18n, RBAC, DB models
└── package.json      # Workspace root with Turborepo scripts
```

The shell consumes the shared packages. Each feature module (Dashboard, Policies, Claims, Statements, Users) lives under `apps/web/src/app/[lang]` and can be extracted into independent deployable micro-frontends later.

## Getting Started

1. Start MongoDB locally (or use a MongoDB Atlas URI):

```bash
docker run -d --name insurance-mongo -p 27017:27017 mongo:latest
```

2. Install dependencies and seed the database:

```bash
npm install
cp .env.example apps/web/.env.local   # or set MONGODB_URI
npm run seed
```

3. Run the Next.js dev server:

```bash
npm run dev --workspace=@insurance/web
```

Open [http://localhost:3000](http://localhost:3000). The middleware will redirect to `/en/` by default.

## Features

- **Dashboard**: KPI cards, LOB charts, claims status pie chart, monthly revenue/claims charts, recent activity, quick actions.
- **Policies**: filters (LOB, status, search, date range), paginated table, policy details, assign user drawer.
- **Claims**: filters, paginated table, claim details.
- **Statements**: summary cards, filters, paginated table, statement details.
- **Users**: user list, create/update user form, privilege matrix, policy assignment with **pagination/search/filter-persistent selection**.
- **Internationalization**: English (LTR) and Arabic (RTL) with language switcher.
- **RBAC**: Sidebar and UI dynamically generated based on user privileges.

## Scripts

```bash
npm run dev       # Start all apps in parallel
npm run build     # Build all workspaces
npm run lint      # Run lint across workspaces
npm run typecheck
npm run seed      # Seed the MongoDB database
```

## Notes

- Runtime Module Federation is not used because it is not yet stable with the Next.js App Router. The monorepo structure keeps modules separated so they can be federated later.
- The app uses `apps/web/src/app/api` REST routes that read from and write to MongoDB.
- To use MongoDB Atlas, update `MONGODB_URI` in `apps/web/.env.local`.
- If your Atlas password contains `@` or `:`, make sure they are URL-encoded (`%40` for `@`, `%3A` for `:`) before pasting the connection string.
