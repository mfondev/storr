# Theming convention

## One source of color
- All colors live in `src/constants/theme.ts` under `Colors.light` and `Colors.dark`; every key exists in both. Their union is the `ThemeColor` type.
- `theme.ts` also exports `Spacing`, `Fonts` (`Fonts.mono`), `MaxContentWidth`, and imports `global.css`.
- **Never hardcode a color/font/spacing in a component** — add a token to `theme.ts` and reference it. (One tolerated literal link color already exists; add no more.)

## Reading the theme
- Get the active palette with `useTheme()` (`src/hooks/use-theme.ts`) — resolves the system scheme (`unspecified`→`light`).
- Keep static layout in `StyleSheet.create`; spread only themed values inline: `style={[styles.card, { backgroundColor: theme.card }]}`.

## Themed components
- Use `ThemedText`/`ThemedView` instead of raw `Text`/`View` for anything showing theme color.
- `ThemedText` takes `type` (typography) and optional `themeColor` (a `ThemeColor` key). Add a new variant to its `type` union and `styles`, not as ad-hoc inline styling.
- `ThemedView` takes `type` for background role; extend the same way.

## Adding a color
1. Add the key under **both** `Colors.light` and `Colors.dark`.
2. Reference it via `useTheme()` or the `themeColor` prop — it joins `ThemeColor` automatically.
