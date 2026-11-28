import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';
import { useAuth } from '@/hooks/use-auth';
import { googleSignIn } from '@/utils/auth';

// Lets the auth popup close itself when it redirects back into the app.
WebBrowser.maybeCompleteAuthSession();

// Public client IDs — shipped in the app, not secrets. See .env.local.
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID?.trim();

// expo-auth-session throws *at render* if the current platform has no client ID.
// So we only build the request when one exists for this platform; otherwise
// Google is unavailable, the button stays disabled, and email sign-in keeps
// working instead of the whole screen crashing.
const platformClientId = Platform.select({
  ios: IOS_CLIENT_ID,
  android: ANDROID_CLIENT_ID,
  default: WEB_CLIENT_ID,
});
const isGoogleConfigured = Boolean(platformClientId);

// Google's iOS client accepts a redirect on its *reversed* client-ID scheme
// (e.g. com.googleusercontent.apps.123-abc:/oauthredirect). We register that
// exact scheme in app.json, so pin the redirect to it rather than letting the
// library fall back to the bundle-id scheme (which Google rejects).
const iosRedirectUri =
  Platform.OS === 'ios' && IOS_CLIENT_ID
    ? `com.googleusercontent.apps.${IOS_CLIENT_ID.replace(
        '.apps.googleusercontent.com',
        '',
      )}:/oauthredirect`
    : undefined;

type GoogleAuth = {
  /** Opens the Google account picker. A no-op when Google isn't configured here. */
  promptGoogle: () => void;
  isGoogleLoading: boolean;
  googleError: string | null;
  /** False until the request is built — the button should stay disabled. */
  isGoogleReady: boolean;
  /** False when no client ID is set for this platform (button can be hidden). */
  isGoogleAvailable: boolean;
};

// What the engine hands up to the provider once it has built the request.
type Engine = {
  promptAsync: ReturnType<typeof Google.useAuthRequest>[2];
  ready: boolean;
};

const GoogleAuthContext = createContext<GoogleAuth | undefined>(undefined);

/**
 * Supplies "Continue with Google" state to the auth screens. The Google request
 * is only built on platforms that have a client ID; elsewhere the provider serves
 * inert defaults so the screen still renders and email sign-in works.
 */
export function GoogleAuthProvider({ children }: { children: ReactNode }) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  // Null until the engine (mounted only when configured) reports its request.
  const [engine, setEngine] = useState<Engine | null>(null);

  const promptGoogle = useCallback(() => {
    if (!engine) return;
    setGoogleError(null);
    setIsGoogleLoading(true);
    engine.promptAsync().catch(() => {
      setGoogleError('Could not open Google sign-in.');
      setIsGoogleLoading(false);
    });
  }, [engine]);

  const value = useMemo<GoogleAuth>(
    () => ({
      promptGoogle,
      isGoogleLoading,
      googleError,
      isGoogleReady: isGoogleConfigured && Boolean(engine?.ready),
      isGoogleAvailable: isGoogleConfigured,
    }),
    [promptGoogle, isGoogleLoading, googleError, engine],
  );

  return (
    <GoogleAuthContext.Provider value={value}>
      {isGoogleConfigured ? (
        <GoogleAuthEngine
          onEngine={setEngine}
          onLoadingChange={setIsGoogleLoading}
          onError={setGoogleError}
        />
      ) : null}
      {children}
    </GoogleAuthContext.Provider>
  );
}

/**
 * Builds the Google request and runs the ID-token exchange. Rendered only when a
 * client ID exists for this platform, so its useAuthRequest call never throws. It
 * renders nothing — it just reports state up to the provider.
 */
function GoogleAuthEngine({
  onEngine,
  onLoadingChange,
  onError,
}: {
  onEngine: (engine: Engine) => void;
  onLoadingChange: (loading: boolean) => void;
  onError: (message: string | null) => void;
}) {
  const { signIn } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    redirectUri: iosRedirectUri,
  });

  // Hand the prompt function and readiness up so the provider can expose them.
  useEffect(() => {
    onEngine({ promptAsync, ready: Boolean(request) });
  }, [promptAsync, request, onEngine]);

  useEffect(() => {
    if (!response) return;

    if (response.type !== 'success') {
      // error / cancel / dismiss — stop the spinner (deferred off the effect body).
      const message =
        response.type === 'error'
          ? 'Google sign-in failed. Please try again.'
          : null;
      Promise.resolve().then(() => {
        if (message) onError(message);
        onLoadingChange(false);
      });
      return;
    }

    // Success fires once with the auth code, then again once the library has
    // exchanged it for tokens — only the second carries the ID token, so wait.
    const idToken = response.params?.id_token || response.authentication?.idToken;
    if (!idToken) return;

    (async () => {
      try {
        const result = await googleSignIn(idToken);
        await signIn(result.data.token, result.data.user);
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Something went wrong.');
      } finally {
        onLoadingChange(false);
      }
    })();
  }, [response, signIn, onError, onLoadingChange]);

  return null;
}

export function useGoogleAuth(): GoogleAuth {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProvider');
  }
  return context;
}
