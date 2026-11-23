# AGENTS.md

Engineering standards for this repo, for humans and AI agents.

**This file is an index — keep it one.** Every rule lives under `.agents/conventions/`, one line here. Read the relevant convention before writing in that area. **Never add a rule inline; put every new rule in a `*.convention.md` and link it here.** One rule, one place.

Storr tracks items users own (price, purchase/warranty/expiry) and reminds them before things lapse. Expo/RN app (`/`) + separate Express/Prisma backend (`backend/`); the app doesn't call the backend yet.

## Critical invariants
1. **Don't trust training data for Expo/RN APIs** — read the SDK 57 docs first. [expo](.agents/conventions/expo.convention.md)
2. **Add deps with `npx expo install`,** never `npm/yarn add`. [expo](.agents/conventions/expo.convention.md)
3. **Never hand-edit `ios/`/`android/`** — configure native in `app.json`. [expo](.agents/conventions/expo.convention.md)
4. **A tab/route change goes in both `app-tabs.tsx` and `app-tabs.web.tsx`.** [navigation](.agents/conventions/navigation.convention.md)
5. **No hardcoded color/spacing/font** — use `theme.ts` via `useTheme()`. [theming](.agents/conventions/theming.convention.md)
6. **Money is integer minor units** (`priceCents`), never a float. [backend-data](.agents/conventions/backend-data.convention.md)
7. **Import the Prisma client from `backend/generated/prisma`;** CLI needs `--config prisma7.config.ts`. [backend-data](.agents/conventions/backend-data.convention.md)
8. **No `any`, no silencing assertion.** [code-standards](.agents/conventions/code-standards.convention.md)
9. **No secret in a log, commit, or response body.** [backend-data](.agents/conventions/backend-data.convention.md)
10. **Commits are `type(scope):`** (required scope, no attribution trailer); every change reaches `main` via a PR titled as a sentence. [commits](.agents/conventions/commits.convention.md)

## Conventions
| Convention | Covers |
|---|---|
| [code-standards](.agents/conventions/code-standards.convention.md) | Typing, aliases, naming, exports, structure, style. |
| [project-structure](.agents/conventions/project-structure.convention.md) | The two packages, app/backend layout, agent files. |
| [expo](.agents/conventions/expo.convention.md) | SDK-first rule, commands, CNG, dev builds, EAS. |
| [navigation](.agents/conventions/navigation.convention.md) | Expo Router, layout, native+web tab parity. |
| [theming](.agents/conventions/theming.convention.md) | `theme.ts`, `useTheme()`, `ThemedText`/`ThemedView`. |
| [backend-data](.agents/conventions/backend-data.convention.md) | Prisma 7 setup, schema, migrations, server. |
| [commits](.agents/conventions/commits.convention.md) | Conventional Commits, scopes, branches, PRs. |

## Skills
| Skill | Use when |
|---|---|
| [pr-patrol](.agents/skills/pr-patrol/SKILL.md) | Reviewing a branch/PR diff against these conventions. |
| [pr-doc-creator](.agents/skills/pr-doc-creator/SKILL.md) | Writing a PR description and opening/updating the PR. |

## Layout
| Path | Holds |
|---|---|
| `src/app/` | Expo Router routes (one screen per file; `_layout.tsx` = navigators). |
| `src/components/` | Reusable components (`home/`, `ui/`). |
| `src/constants/theme.ts` | Colors, `Spacing`, `Fonts`, `MaxContentWidth`. |
| `src/hooks/` | Hooks. |
| `backend/src/` | Express server; entry `server.ts`. |
| `backend/prisma/` | Schema and migrations. |
| `backend/generated/prisma/` | Generated client (gitignored). |
| `.agents/conventions/` · `.agents/skills/` | Standards · workflows. |
| `backend/.agents/skills/` | Vendored Prisma skills. |
| `artifacts/` | Skill output. Not committed. |

## How to explain code changes

Whenever you make changes to my code, explain your work in numbered parts, one part per file changed.

- Order the parts by the order you changed the files. The first file you edited is Part 1, the second is Part 2, and so on. Never reorder them.
- Format for each part:
  - Part [number]: [short title of what you did in this file]
  - File: the file path
  - What this file does: one or two sentences on its role in the project
  - What I changed: the change in plain language
  - Code changed: the actual code that was written or changed in this file (see rules below)
  - Why I changed it: the reason, and how it connects to the overall task
- In the "Code changed" field, show the real code:
  - If a function, component, hook, or class was added or changed, write out the full function in a code block with the language tag (for example `tsx` or `ts`).
  - If you changed an existing function, show the new version of the whole function, then one line below saying what is different from the old version.
  - If the change is only a few lines inside a long function, show just those lines plus a couple of lines around them, and say which function they belong to.
  - Show the code in the same order as the changes in that part.
  - If a change is not code (a config value, an import, a dependency), show the exact line that changed.
  - Don't paste whole files. Only show the parts that changed.
  - Add a short plain-language comment above each snippet saying what it does.
- If a file has several separate changes, list them as bullet points inside that file's part, in the order you made them.
- If you create a new file, say it is new. If you delete or rename a file, give it its own part.
- Never skip a file you touched, even for small edits.
- Use simple, clear language. Explain any jargon you have to use.
- End every response that changed code with a short "Summary" (2 to 3 sentences) and a "Next steps" list if I need to do something (run a command, restart the server, add an environment variable).
