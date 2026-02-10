# Backend Core Starter (Node.js + TypeScript)

Production-minded starter backend for Node.js with TypeScript, JWT authentication/authorization, and MongoDB.

## Why this starter

- **Secure defaults**: Helmet, CORS allowlist, HTTP-only refresh cookies, rate limiting, strict env validation.
- **Maintainable architecture**: Domain/Application/Infrastructure/Presentation layering.
- **Scalable foundation**: Feature-module organization, central error handling, typed contracts.
- **Database ready**: MongoDB (Mongoose) connection and user persistence.

## Tech stack

- Node.js 20+
- TypeScript
- Express
- MongoDB + Mongoose
- JWT + bcrypt
- Zod validation
- Pino logging
- Vitest

## Project structure

```txt
src/
  config/                  # env, logger, db setup
  modules/
    auth/
      domain/              # entities + repository interfaces
      application/         # auth business logic (register/login/refresh/logout)
      infrastructure/      # Mongoose model + repository implementation
      presentation/        # routes, controllers, middleware, schemas
  shared/
    errors/
    middlewares/
    types/
    utils/
  app.ts
  server.ts
```

## Environment variables

Copy and edit:

```bash
cp .env.example .env
```

Required:

- `NODE_ENV`
- `PORT`
- `APP_ORIGIN`
- `MONGO_URI`
- `JWT_ACCESS_SECRET` (min 32 chars)
- `JWT_REFRESH_SECRET` (min 32 chars)
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- `BCRYPT_SALT_ROUNDS`

## Run locally

```bash
npm install
npm run dev
```

Build/start:

```bash
npm run build
npm start
```

## API overview

Base: `/api/v1/auth`

- `POST /register`
- `POST /login`
- `POST /refresh` (uses HTTP-only `refreshToken` cookie)
- `POST /logout` (requires access token)
- `GET /me` (requires access token)
- `GET /admin` (requires access token + `admin` role)

Health:

- `GET /health`

## Security notes

- Access token in response body; refresh token in secure HTTP-only cookie.
- Refresh token is hashed in database.
- Role-based authorization middleware provided.
- Password policy enforced in request validation.
- Generic auth error responses to reduce information leakage.

## Next recommended additions

- Email verification + forgot/reset password flow
- Account lockout / brute-force protection on login endpoint
- Structured API docs (OpenAPI)
- Integration tests with testcontainers
- Redis-backed token/session revocation for multi-instance deployments
