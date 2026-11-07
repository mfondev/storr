# Navigation convention

- All navigation uses **Expo Router**. Import `Link`, `router`, `useLocalSearchParams` from `expo-router`.
- Routes live in `src/app/` — every file is a screen, `_layout.tsx` defines navigators. Typed routes are on, so route strings are checked.
- Keep non-route code out of `src/app/` — anything there becomes a route.

## Layout & tab bar
- `src/app/_layout.tsx` wraps the app in `ThemeProvider` (keyed off system scheme) and renders `AppTabs`, with `AnimatedSplashOverlay` on top.
- The tab bar has **two platform files that must stay in parity**:
  - `app-tabs.tsx` — native, `NativeTabs` from `expo-router/unstable-native-tabs`, keyed by route `name` (`index`, `explore`).
  - `app-tabs.web.tsx` — web, custom bar via `expo-router/ui`, keyed by `href` (`/`, `/explore`).
- **Adding/removing/renaming a tab means editing both files in the same change** — the type checker won't catch a mismatch.

## Screens
- A new screen: `kebab-case` file in `src/app/`, default-exported component named after the route.
- Wrap content in `ThemedView`; use `SafeAreaView` from `react-native-safe-area-context` for insets (see `src/app/index.tsx`).
- Pull all colors/spacing from the theme — see [theming](theming.convention.md).
