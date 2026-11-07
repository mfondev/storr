# Expo convention

Mobile-first Expo/React Native app. Prioritize performance and cross-platform behaviour.

## Don't trust training data for Expo APIs
Expo breaks APIs every SDK release. Before touching any Expo/EAS/RN API:
1. Read the `expo` major in `package.json` (currently `~57`).
2. Fetch versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`.
3. Else fetch `https://docs.expo.dev/llms.txt` and follow its links. Never answer from memory.

## Commands (npm, so `npx` not `bunx`)
```bash
npx expo install <pkg>   # ALWAYS, not npm/yarn add — resolves SDK-compatible versions
npx expo start           # npm start; also npm run ios|android|web
npx expo lint            # npm run lint
npx tsc --noEmit         # typecheck
npx expo-doctor          # diagnose deps/config
npx expo install --fix   # fix incompatible versions
```
Run lint and typecheck before calling a task done.

## Native code & config
- `ios/`/`android/` are generated (CNG) — **never hand-edit**. Configure native behaviour in `app.json` (icon, splash, scheme `storr`, plugins, `typedRoutes`, `reactCompiler`).
- Expo Go bundles only its own native modules; after adding a native library build a dev build (`npx expo run:ios|android` or `eas build --profile development`).
- Prefer Expo modules over third-party libs; check vendored/available skills before adding a dependency.

## EAS
Build/sign/submit and OTA updates in the cloud: `eas build`, `eas submit`, `eas update`, run as `npx eas-cli@latest <cmd>`. Docs: `https://docs.expo.dev/eas/index.md`.
