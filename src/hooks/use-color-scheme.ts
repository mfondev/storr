import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useResolvedColorScheme } from '@/hooks/use-theme-preference';

/**
 * The app's colour scheme, honouring the user's Appearance choice (light / dark /
 * system) when the preference provider is mounted, falling back to the OS scheme.
 */
export function useColorScheme() {
  const resolved = useResolvedColorScheme();
  const system = useSystemColorScheme();
  return resolved ?? system;
}
