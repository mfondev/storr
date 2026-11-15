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

import { getCurrentUser, SessionExpiredError } from '@/utils/auth';
import type { AuthUser } from '@/utils/types';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

type AuthState = {
  isLoggedIn: boolean | null;
  user: AuthUser | null;
  signIn: (token: string, user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const signOutLocally = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY).catch(() => null);
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        // Confirm the token with the backend and get the current user.
        const fresh = await getCurrentUser();
        setUser(fresh);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(fresh));
        setIsLoggedIn(true);
      } catch (error) {
        if (error instanceof SessionExpiredError) {
          // Token rejected — the session is over, send them to sign in.
          await signOutLocally();
          return;
        }
        // Offline / backend unreachable: keep a stored user if we have one,
        // otherwise treat as signed out (never a half-logged-in state).
        const storedUser = await SecureStore.getItemAsync(USER_KEY).catch(() => null);
        if (storedUser) {
          setUser(JSON.parse(storedUser) as AuthUser);
          setIsLoggedIn(true);
        } else {
          await signOutLocally();
        }
      }
    })();
  }, [signOutLocally]);

  const value = useMemo<AuthState>(
    () => ({
      isLoggedIn,
      user,
      signIn: async (token: string, nextUser: AuthUser) => {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(nextUser));
        setUser(nextUser);
        setIsLoggedIn(true);
      },
      signOut: signOutLocally,
    }),
    [isLoggedIn, user, signOutLocally],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/** A friendly display name from the user: full name, else the email handle. */
export function displayNameOf(user: AuthUser | null): string {
  if (!user) return '';
  const full = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  if (full) return full;
  return user.email?.split('@')[0] ?? '';
}
