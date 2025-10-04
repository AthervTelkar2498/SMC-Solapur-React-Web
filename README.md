# SMC Work Management System

## Backend (server)
- Node 18+, PostgreSQL 14+
- Copy `server/.env.example` to `server/.env` and set `DATABASE_URL`
- Create required extensions in Postgres if needed: `CREATE EXTENSION IF NOT EXISTS pgcrypto;`
- Run migrations: `npm run migrate --prefix server`
- Start server: `npm run dev --prefix server`

## Frontend (client)
- Start: `npm run dev --prefix client`
- Login with `admin` / `admin` (demo)
- Upload `.xlsx` file; rows are saved to DB and visible in table.
