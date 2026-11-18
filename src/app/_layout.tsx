import {
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from "@expo-google-fonts/bricolage-grotesque";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import {
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

import { BrandSplash } from "@/components/brandSplash";
import { Colors } from "@/constants/theme";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ItemProvider } from "@/hooks/use-item";

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { isLoggedIn, hasOnboarded } = useAuth();
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
  });
  // Hold the splash until fonts, the token check, and the onboarding flag are all resolved.
  const isReady =
    (fontsLoaded || fontError !== null) &&
    isLoggedIn !== null &&
    hasOnboarded !== null;

  const isDark = colorScheme === "dark";
  const palette = Colors[isDark ? "dark" : "light"];
  const base = isDark ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: palette.background,
      card: palette.card,
      border: palette.border,
      text: palette.text,
      primary: palette.primary,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style="auto" />
      <BrandSplash isReady={isReady} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: palette.background },
        }}
      >
        {/* Signed in: the app. Available only once a token is present. */}
        <Stack.Protected guard={isLoggedIn === true}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="add-item" options={{ presentation: "modal" }} />
          <Stack.Screen name="item-detail" />
          <Stack.Screen name="warranties" />
        </Stack.Protected>

        {/* First launch only: onboarding, until they've seen it once. */}
        <Stack.Protected guard={isLoggedIn !== true && hasOnboarded === false}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>

        {/* Signed out (already onboarded): straight to auth. */}
        <Stack.Protected guard={isLoggedIn !== true}>
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="sign-up" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ItemProvider>
        <RootNavigator />
      </ItemProvider>
    </AuthProvider>
  );
}
