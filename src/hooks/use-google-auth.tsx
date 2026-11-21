import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { useAuth } from '@/hooks/use-auth';
import { googleSignIn } from '@/utils/auth';

// Lets the auth popup close itself when it redirects back into the app.
WebBrowser.maybeCompleteAuthSession();

// Public client IDs — shipped in the app, not secrets. See .env.local.
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim();
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();

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
  /** Opens the Google account picker. */
  promptGoogle: () => void;
  isGoogleLoading: boolean;
  googleError: string | null;
  /** False until the request is built — the button should stay disabled. */
  isGoogleReady: boolean;
};

/**
 * Drives "Continue with Google": opens Google (authorization code + PKCE flow),
 * takes the returned ID token to our backend, and signs the user into the same
 * session email login produces.
 * Note: the redirect back only completes in a dev build, not Expo Go.
 */
export function useGoogleAuth(): GoogleAuth {
  const { signIn } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: WEB_CLIENT_ID,
    iosClientId: IOS_CLIENT_ID,
    redirectUri: iosRedirectUri,
  });

  useEffect(() => {
    if (!response) return;

    if (response.type !== 'success') {
      // error / cancel / dismiss — stop the spinner (deferred off the effect body).
      const message =
        response.type === 'error'
          ? 'Google sign-in failed. Please try again.'
          : null;
      Promise.resolve().then(() => {
        if (message) setGoogleError(message);
        setIsGoogleLoading(false);
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
        setGoogleError(
          error instanceof Error ? error.message : 'Something went wrong.',
        );
      } finally {
        setIsGoogleLoading(false);
      }
    })();
  }, [response, signIn]);

  const promptGoogle = () => {
    setGoogleError(null);
    setIsGoogleLoading(true);
    promptAsync().catch(() => {
      setGoogleError('Could not open Google sign-in.');
      setIsGoogleLoading(false);
    });
  };

  return { promptGoogle, isGoogleLoading, googleError, isGoogleReady: !!request };
}
