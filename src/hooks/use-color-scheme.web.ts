import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme, type ColorSchemeName } from 'react-native';

const subscribe = (): (() => void) => () => {};

/**
 * Web is statically rendered, so the scheme is only trustworthy after hydration.
 * The server snapshot reports "not hydrated" and the client snapshot "hydrated",
 * which keeps the first client render identical to the server markup.
 */
export function useColorScheme(): ColorSchemeName {
  const hasHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const colorScheme = useRNColorScheme();

  return hasHydrated ? colorScheme : 'light';
}
