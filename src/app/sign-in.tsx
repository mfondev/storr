import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppButton } from '@/components/ui/appButton';
import { BrandMark } from '@/components/ui/brandMark';
import { Icon } from '@/components/ui/icon';
import { InputField } from '@/components/ui/inputField';
import { Screen } from '@/components/ui/screen';
import { IconSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function SignIn() {
  // UI only — no auth yet. The primary button navigates as a placeholder.
  const theme = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Screen variant="stack" avoidKeyboard>
      <View style={styles.brand}>
        <BrandMark size={56} />
        <View style={styles.heading}>
          <ThemedText type="title">Welcome back</ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            Sign in to pick up where you left off.
          </ThemedText>
        </View>
      </View>

      <View style={styles.form}>
        <InputField
          label="Email"
          icon="mail-outline"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <InputField
          label="Password"
          icon="lock-closed-outline"
          placeholder="Your password"
          secureTextEntry={!isPasswordVisible}
          autoComplete="password"
          textContentType="password"
          rightSlot={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
              onPress={() => setIsPasswordVisible((value) => !value)}
              hitSlop={8}>
              <Icon
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={IconSize.md}
                color={theme.textTertiary}
              />
            </Pressable>
          }
        />
      </View>

      <AppButton label="Sign in" onPress={() => router.replace('/')} style={styles.submit} />

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/sign-up')}
        hitSlop={8}
        style={styles.switchRow}>
        <ThemedText type="small" themeColor="textSecondary">
          Don&apos;t have an account?{' '}
        </ThemedText>
        <ThemedText type="linkPrimary">Create one</ThemedText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: {
    gap: Spacing.xxl,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xxxl,
  },
  heading: {
    gap: Spacing.xs,
  },
  form: {
    gap: Spacing.xl,
  },
  submit: {
    marginTop: Spacing.xxxl,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
});
