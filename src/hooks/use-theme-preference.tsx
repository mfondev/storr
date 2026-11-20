import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

export type ThemePreference = 'light' | 'dark' | 'system';

const PREFERENCE_KEY = 'themePreference';

type ThemePreferenceState = {
  /** What the user chose: light, dark, or follow the system. */
  preference: ThemePreference;
  /** The scheme that actually applies right now (system resolved to light/dark). */
  colorScheme: 'light' | 'dark';
  setPreference: (next: ThemePreference) => void;
};

const ThemePreferenceContext = createContext<ThemePreferenceState | null>(null);

export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  // Load the saved preference once at launch.
  useEffect(() => {
    (async () => {
      const saved = await SecureStore.getItemAsync(PREFERENCE_KEY).catch(() => null);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setPreferenceState(saved);
      }
    })();
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    SecureStore.setItemAsync(PREFERENCE_KEY, next).catch(() => {});
  }, []);

  const colorScheme: 'light' | 'dark' =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo<ThemePreferenceState>(
    () => ({ preference, colorScheme, setPreference }),
    [preference, colorScheme, setPreference],
  );

  return (
    <ThemePreferenceContext.Provider value={value}>{children}</ThemePreferenceContext.Provider>
  );
}

export function useThemePreference(): ThemePreferenceState {
  const context = useContext(ThemePreferenceContext);
  if (!context) {
    throw new Error('useThemePreference must be used within a ThemePreferenceProvider');
  }
  return context;
}

/** The resolved scheme, or null when no provider is mounted (so hooks can fall back). */
export function useResolvedColorScheme(): 'light' | 'dark' | null {
  return useContext(ThemePreferenceContext)?.colorScheme ?? null;
}
