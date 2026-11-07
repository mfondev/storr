# Project structure convention

Two separate npm packages, each with its own `package.json`, `node_modules`, `tsconfig.json`. Run each package's commands from inside it.

| Package | Root | Stack |
|---|---|---|
| App | `/` | Expo SDK 57, RN 0.86, React 19, Expo Router, TS. npm. |
| Backend | `backend/` | Express 5, Prisma 7, PostgreSQL, TS (`tsx`/`nodemon`). |

The app does not call the backend yet; home-screen data (`src/app/index.tsx`, `src/components/home/`) is hardcoded. Don't assume an API contract that doesn't exist.

## App layout
| Path | Holds |
|---|---|
| `src/app/` | Routes only — every file is a screen, `_layout.tsx` defines a navigator. Keep non-route code out. See [navigation](navigation.convention.md). |
| `src/components/` | Reusable components (`home/`, `ui/`). |
| `src/constants/theme.ts` | Colors, `Spacing`, `Fonts`, `MaxContentWidth`, `ThemeColor`. See [theming](theming.convention.md). |
| `src/hooks/` | Hooks. |
| `assets/` | Images/icons, via `@/assets/*` or `require`. |

## Backend layout
| Path | Holds |
|---|---|
| `backend/src/` | Server; entry `server.ts`. |
| `backend/prisma/` | `schema.prisma` and `migrations/`. See [backend-data](backend-data.convention.md). |
| `backend/prisma7.config.ts` | Prisma config (non-default name; CLI needs `--config prisma7.config.ts`). |
| `backend/generated/prisma/` | Generated client (gitignored). Import from here. |
| `backend/.agents/skills/` | Vendored Prisma skills. |

## Agent files
- Root `.agents/` holds conventions and skills for the whole repo.
- `backend/AGENTS.md` is a backend index pointing back to these conventions.
- `CLAUDE.md` is a symlink to `AGENTS.md` in each location — edit `AGENTS.md`, never the symlink.
