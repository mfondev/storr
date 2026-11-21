import { useSyncExternalStore } from 'react';
import { useColorScheme as useSystemColorScheme, type ColorSchemeName } from 'react-native';

import { useResolvedColorScheme } from '@/hooks/use-theme-preference';

const subscribe = (): (() => void) => () => {};

/**
 * Web is statically rendered, so the scheme is only trustworthy after hydration.
 * Once hydrated, honour the user's Appearance choice, falling back to the OS scheme.
 */
export function useColorScheme(): ColorSchemeName {
  const hasHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const resolved = useResolvedColorScheme();
  const system = useSystemColorScheme();

  if (!hasHydrated) return 'light';
  return resolved ?? system;
}
