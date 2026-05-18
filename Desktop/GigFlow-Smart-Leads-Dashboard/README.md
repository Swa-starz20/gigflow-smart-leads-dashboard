# GigFlow – Smart Leads Dashboard

A production-grade MERN stack SaaS application for managing sales leads with JWT authentication, role-based access control, advanced filtering, pagination, and CSV export.

## Features

- **Authentication:** Register, login, JWT, persistent sessions, protected routes
- **RBAC:** Admin (full CRUD) vs Sales (view/create/update only)
- **Leads CRUD:** Create, read, update, delete (admin only)
- **Advanced filters:** Status + source + search (name/email) + sort — all combined
- **Pagination:** Server-side skip/limit with metadata (10 per page)
- **Debounced search:** 400ms client debounce
- **CSV export:** Filter-aware export endpoint
- **UI:** Modern CRM dashboard, dark mode, skeletons, empty/error states, responsive table/cards

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, TanStack Query, Zustand, React Hook Form, Zod, Axios, Radix UI, Lucide |
| Backend | Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Zod, Helmet, CORS, Morgan |
| DevOps | Docker, Docker Compose, Nginx |

## Project Structure

```
GigFlow-Smart-Leads-Dashboard/
├── ARCHITECTURE.md
├── docker-compose.yml
├── backend/src/          # API (layered architecture)
└── frontend/src/         # React SPA
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed design decisions.

## Quick Start (Docker)

```bash
# From project root
docker-compose up --build

# Seed database (in another terminal)
docker exec -it gigflow-backend node dist/scripts/seed.js
```

## Local Development

### Prerequisites

- Node.js 20+
- MongoDB 7+ (local or Docker)

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

In another terminal:

```bash
cd backend
npm run seed
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Min 16 characters |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `CORS_ORIGIN` | Comma-separated allowed origins |
| `BCRYPT_SALT_ROUNDS` | Password hashing rounds |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gigflow.com | Admin@12345 |
| Sales | sales@gigflow.com | Sales@12345 |

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Login, returns JWT |
| GET | `/auth/me` | Yes | Current user profile |

**Register / Login body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass1"
}
```

**Success response:**

```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": { "id": "...", "name": "...", "email": "...", "role": "sales" },
    "token": "eyJhbG..."
  }
}
```

### Leads

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/leads` | Yes | All |
| GET | `/leads/export/csv` | Yes | All |
| GET | `/leads/:id` | Yes | All |
| POST | `/leads` | Yes | All |
| PUT | `/leads/:id` | Yes | All |
| DELETE | `/leads/:id` | Yes | Admin only |

**Query parameters (GET /leads, export):**

| Param | Type | Example |
|-------|------|---------|
| `page` | number | `1` |
| `limit` | number | `10` |
| `status` | New \| Contacted \| Qualified \| Lost | `Qualified` |
| `source` | Website \| Instagram \| Referral | `Instagram` |
| `search` | string | `Rahul` |
| `sort` | latest \| oldest | `latest` |

**Create lead body:**

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram"
}
```

**Paginated response:**

```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": { "leads": [] },
  "meta": {
    "total": 15,
    "currentPage": 1,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false,
    "limit": 10
  }
}
```

## Deployment

1. Set strong `JWT_SECRET` in production
2. Configure `CORS_ORIGIN` to your frontend domain
3. Use managed MongoDB (Atlas) and update `MONGODB_URI`
4. Build frontend with correct `VITE_API_URL`
5. Run `docker-compose up -d` or deploy services separately

## Testing Checklist

- [ ] Register new user and login
- [ ] Login as admin — verify delete works
- [ ] Login as sales — verify delete is blocked (403)
- [ ] Create, edit, view lead
- [ ] Combine filters: status + source + search
- [ ] Pagination next/prev
- [ ] CSV export with active filters
- [ ] Dark mode toggle persists
- [ ] Mobile responsive leads cards
- [ ] Logout clears session

## Screenshots

| Page | Path |
|------|------|
| Dashboard | `docs/screenshots/dashboard.png` |
| Leads List | `docs/screenshots/leads.png` |
| Login | `docs/screenshots/login.png` |

## License

MIT
