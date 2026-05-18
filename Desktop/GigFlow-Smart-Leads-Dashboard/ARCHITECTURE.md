# GigFlow – Smart Leads Dashboard — Architecture

## Overview

GigFlow is a production-grade MERN SaaS application for lead management with role-based access control, advanced filtering, pagination, and CSV export. The codebase is split into two deployable services (`backend`, `frontend`) orchestrated via Docker Compose.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
│  React + Vite + TypeScript + TanStack Query + Zustand           │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS / REST (Axios)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Express API (TypeScript)                      │
│  Routes → Controllers → Services → Repositories → Mongoose       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MongoDB                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Repository Structure

```
GigFlow-Smart-Leads-Dashboard/
├── ARCHITECTURE.md          # This document
├── README.md                # Setup, API docs, deployment
├── .gitignore
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── server.ts        # Entry: DB connect + HTTP listen
│       ├── app.ts           # Express app factory
│       ├── config/          # env, db, cors
│       ├── constants/       # enums, HTTP messages
│       ├── controllers/     # HTTP layer (thin)
│       ├── services/        # Business logic
│       ├── repositories/    # Data access
│       ├── models/          # Mongoose schemas
│       ├── routes/          # Route definitions
│       ├── middleware/      # auth, validate, error, rbac
│       ├── validators/      # Zod schemas
│       ├── utils/           # asyncHandler, ApiError, JWT helpers
│       ├── types/           # Shared TS types
│       └── scripts/         # seed.ts
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── .env.example
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── api/             # Axios instance + endpoints
        ├── components/      # UI primitives + shared
        ├── features/        # Domain modules (auth, leads)
        ├── hooks/           # useDebounce, useAuth, etc.
        ├── layouts/         # DashboardLayout, AuthLayout
        ├── pages/           # Route-level pages
        ├── routes/          # Router + ProtectedRoute
        ├── store/           # Zustand (auth + theme)
        ├── types/           # API response types
        ├── utils/           # formatters, cn()
        └── lib/             # queryClient, shadcn utils
```

## Layered Backend Design

| Layer | Responsibility |
|-------|----------------|
| **Routes** | Mount paths, apply middleware chain |
| **Validators** | Zod parse body/query/params |
| **Controllers** | Map HTTP ↔ service calls, send responses |
| **Services** | Business rules, RBAC checks, orchestration |
| **Repositories** | Mongoose queries, pagination, filters |
| **Models** | Schema, indexes, enums |

### Request Flow

```
HTTP Request
  → helmet, cors, morgan, express.json()
  → validate (Zod)
  → authenticate (JWT)
  → authorize (role)
  → controller
  → service
  → repository
  → MongoDB
```

### API Response Format

```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": { },
  "meta": { "total": 100, "currentPage": 1, "totalPages": 10, "hasNextPage": true, "hasPrevPage": false }
}
```

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Invalid email" }]
}
```

## Data Models

### User

| Field | Type | Notes |
|-------|------|-------|
| name | string | required |
| email | string | unique, indexed |
| password | string | bcrypt hash, select: false |
| role | enum | `admin` \| `sales` |
| createdAt / updatedAt | Date | timestamps |

### Lead

| Field | Type | Notes |
|-------|------|-------|
| name | string | required, text index |
| email | string | required, text index |
| status | enum | New, Contacted, Qualified, Lost |
| source | enum | Website, Instagram, Referral |
| createdBy | ObjectId | ref User |
| createdAt / updatedAt | Date | timestamps |

**Indexes:** `{ status: 1 }`, `{ source: 1 }`, `{ createdAt: -1 }`, compound text on name+email.

## Authentication

- **Register / Login** → issue JWT access token (Bearer header).
- **Storage:** `localStorage` access token + Zustand persist for user profile.
- **Protected routes:** Axios interceptor attaches `Authorization: Bearer <token>`.
- **Backend:** `authMiddleware` verifies JWT, attaches `req.user`.
- **RBAC:** `authorizeRoles('admin')` for delete; sales can CRU without delete.

## Leads Query Contract

`GET /api/leads?page=1&limit=10&status=Qualified&source=Instagram&search=Rahul&sort=latest`

| Param | Values | Behavior |
|-------|--------|----------|
| page | number | default 1 |
| limit | number | default 10, max 50 |
| status | enum | exact match |
| source | enum | exact match |
| search | string | case-insensitive regex on name OR email |
| sort | `latest` \| `oldest` | sort by createdAt |

All filters are **AND** combined.

## Frontend Architecture

- **Routing:** React Router v6, nested dashboard routes.
- **Server state:** TanStack Query (leads list, detail, mutations).
- **Client state:** Zustand (auth user, dark mode).
- **Forms:** React Hook Form + Zod resolvers.
- **UI:** Tailwind + shadcn/ui patterns + Lucide icons.
- **Debounced search:** 400ms debounce before query key update.

## Security Checklist

- Helmet, CORS whitelist, rate limiting (optional)
- Password hashing (bcrypt, salt rounds 12)
- JWT secret from env, short-ish expiry
- Input validation on all write endpoints
- No password in API responses
- Role checks on destructive operations

## Docker Services

| Service | Port | Image |
|---------|------|-------|
| mongodb | 27017 | mongo:7 |
| backend | 5000 | Node 20 Alpine |
| frontend | 5173 (dev) / 80 (prod nginx) | Node build + nginx |

## Environment Variables

See `backend/.env.example` and `frontend/.env.example`.
