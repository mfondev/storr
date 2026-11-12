import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { InputField } from '@/components/ui/inputField';
import { PrimaryButton } from '@/components/ui/primaryButton';

export default function SignIn() {
  // UI only for now — no auth yet. The button navigates as a placeholder.
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <ThemedText type="small" themeColor="textSecondary">
            Welcome back
          </ThemedText>
          <ThemedText type="subtitle">Sign in</ThemedText>
        </View>

        <View style={styles.form}>
          <InputField
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <InputField
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            autoComplete="password"
          />
        </View>

        <View style={styles.footer}>
          <PrimaryButton label="Sign in" onPress={() => router.replace('/')} />
          <Pressable onPress={() => router.push('/sign-up')} hitSlop={8} style={styles.switchRow}>
            <ThemedText type="small" themeColor="textSecondary">
              Don&apos;t have an account?{' '}
            </ThemedText>
            <ThemedText type="smallBold" themeColor="accent">
              Sign up
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    gap: 4,
    marginBottom: 32,
  },
  form: {
    gap: 18,
  },
  footer: {
    marginTop: 'auto',
    gap: 18,
    paddingBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
