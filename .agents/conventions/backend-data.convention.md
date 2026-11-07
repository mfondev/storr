# Backend data convention

Express/Prisma backend in `backend/`. Run every command from inside `backend/`.

## Prisma 7 setup
- Config is `prisma7.config.ts` (non-default name) — **every CLI command needs `--config prisma7.config.ts`**:
  ```bash
  npx prisma migrate dev --config prisma7.config.ts
  npx prisma generate --config prisma7.config.ts
  npx prisma studio --config prisma7.config.ts
  ```
- It loads `DATABASE_URL` from `backend/.env` via `dotenv`. The `datasource db` block has **no `url`** (Prisma 7) — don't add one.
- Generator is `prisma-client`, output `backend/generated/prisma` (gitignored). **Import the client from there, not `@prisma/client`.** Runtime access uses the `@prisma/adapter-pg` driver adapter over `pg`.
- For Prisma 7 APIs, read the vendored skills in `backend/.agents/skills/` (`prisma-cli`, `prisma-client-api`, `prisma-upgrade-v7`), not memory.

## Schema rules
- Every model: `String @id @default(cuid())`, plus `createdAt @default(now())` and `updatedAt @updatedAt`.
- **Money is integer minor units:** `priceCents Int` + `currency String`. Never a float.
- Nullable only when absence is a real state; otherwise give a `@default(...)`.
- Declare referential actions (`onDelete: Cascade`).
- Index any filtered/sorted column (current: `Item` on `userId`, `expiryDate`, `warrantyExpiresAt`).
- A fixed value set is a Prisma `enum` (`Category`), not a free `String`.

## Migrations
- Change schema → `migrate dev --config prisma7.config.ts`. Don't hand-edit generated SQL.
- Schema change + its migration land in the same commit (scope `prisma`/`schema`).

## Server
- Entry `backend/src/server.ts`. Dev: `npm run dev` (nodemon→tsx, watches `src/`, port 3000). Build: `npm run build`. Serve: `npm start`.
- Secrets from `backend/.env` (`DATABASE_URL`, `NODE_ENV`). Never commit `.env` or put a secret in a log, commit, or response body.
