# Code standards convention

## Typing
- `strict` on in both packages; never weaken a compiler option to pass.
- No `any` — use `unknown` and narrow. Isolate any forced `any` at the boundary.
- No non-null assertion (`!`) to silence the compiler; narrow or handle the absent case.
- Type exported functions' params and returns explicitly; infer locals.
- App code: prefer string-literal unions over enums. Prisma schema enums are correct — see [backend-data](backend-data.convention.md).

## Imports and aliases
- Use aliases, not long relative paths: `@/*`→`src/*`, `@/assets/*`→`assets/*`.
- Import order: external, then `@/`, then relative.
- Backend imports the Prisma client from its generated path — see [backend-data](backend-data.convention.md).

## Naming
- `camelCase` vars/functions, `PascalCase` components/types/classes, `SCREAMING_SNAKE_CASE` module constants.
- **Files you author are `camelCase`** (`authController.ts`, `authRoutes.ts`, `useTheme.ts`). Auto-generated files (package/CLI output, e.g. `generated/prisma/`) keep their generated names. Existing `kebab-case` files (`themed-text.tsx`, `use-theme.ts`) predate this rule — leave them; don't mass-rename.
- Platform suffix before extension: `authRoutes.web.ts`. See [navigation](navigation.convention.md).
- Money is minor units: `priceCents`, never a float.
- Booleans read as predicates (`isFocused`); say what a thing is, not what it is not.

## Exports
- Default export for routes/screens (`src/app/*`, `app-tabs.tsx`, `home/cards.tsx`) — Expo Router requires it for routes.
- Named export for reusable primitives (`ThemedText`, `useTheme`).
- Name the function after the file (a default export in `cards.tsx` is `Cards`, not `Index`).

## Structure & style
- One component per file, one hook per file. No business logic in a screen beyond composition and navigation.
- Delete dead code and stray `// console.log`; git holds history.
- `const` unless reassignment is required; don't mutate params, return a new value.
- Single quotes in TS/TSX (older files use double; no Prettier yet — don't reformat unrelated files).
- No hardcoded color/spacing/font in a component — see [theming](theming.convention.md).
