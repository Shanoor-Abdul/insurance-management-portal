# Insurance Management Portal

An enterprise insurance management portal built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, and a **micro-frontend-ready monorepo** architecture.

## Tech Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
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
├── apps/web          # Shell Next.js application
├── packages/ui       # Shared UI component library
├── packages/lib      # Shared business logic: types, API, store, i18n, RBAC
└── package.json      # Workspace root with Turborepo scripts
```

The shell consumes the shared packages. Each feature module (Dashboard, Policies, Claims, Statements, Users) lives under `apps/web/app/[lang]` and can be extracted into independent deployable micro-frontends when needed.

## Getting Started

```bash
npm install
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
npm run dev     # Start all apps in parallel
npm run build   # Build all workspaces
npm run lint    # Run lint across workspaces
npm run typecheck
```

## Notes

- Runtime Module Federation is not used because it is not yet stable with the Next.js App Router. The monorepo structure keeps modules separated so they can be federated later.
- Data is currently mocked in `packages/lib/src/data`. Replace with real REST/GraphQL endpoints in `packages/lib/src/api`.
