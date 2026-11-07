# AGENTS.md (backend)

Standards for the Storr Express + Prisma 7 backend. Repo index: [`../AGENTS.md`](../AGENTS.md); rules live in `../.agents/conventions/`. Index only — no inline rules. Run commands from inside `backend/`.

## Critical invariants
1. **Money is integer `priceCents`,** never a float. [backend-data](../.agents/conventions/backend-data.convention.md)
2. **Prisma CLI needs `--config prisma7.config.ts`;** import the client from `generated/prisma`. [backend-data](../.agents/conventions/backend-data.convention.md)
3. **`DATABASE_URL` from `backend/.env`;** `datasource` has no `url`; no secret in a log/commit/response. [backend-data](../.agents/conventions/backend-data.convention.md)
4. **No `any`; strict typing.** [code-standards](../.agents/conventions/code-standards.convention.md)
5. **Commits `type(scope):`** (`backend`/`prisma`/`schema`/`server`), no attribution trailer. [commits](../.agents/conventions/commits.convention.md)

## Conventions
| Convention | Covers |
|---|---|
| [backend-data](../.agents/conventions/backend-data.convention.md) | Prisma 7 setup, schema, migrations, server. |
| [code-standards](../.agents/conventions/code-standards.convention.md) | Typing, naming, exports, structure. |
| [commits](../.agents/conventions/commits.convention.md) | Commits, branches, PRs. |

## Prisma 7 APIs
Read the vendored skills in `.agents/skills/` (`prisma-cli`, `prisma-client-api`, `prisma-upgrade-v7`), not memory.
