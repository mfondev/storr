import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import {
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { BrandSplash } from '@/components/brandSplash';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  const isReady = fontsLoaded || fontError !== null;

  const isDark = colorScheme === 'dark';
  const palette = Colors[isDark ? 'dark' : 'light'];
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
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="add-item" options={{ presentation: 'modal' }} />
        <Stack.Screen name="item-detail" />
        <Stack.Screen name="warranties" />
      </Stack>
    </ThemeProvider>
  );
}
