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

export default function SignUp() {
  // UI only — no auth yet. The primary button navigates as a placeholder.
  const theme = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Screen variant="stack" avoidKeyboard>
      <View style={styles.brand}>
        <BrandMark size={56} />
        <View style={styles.heading}>
          <ThemedText type="title">Create your account</ThemedText>
          <ThemedText type="default" themeColor="textSecondary">
            Keep every receipt, warranty and detail in one calm place.
          </ThemedText>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.nameRow}>
          <InputField
            label="First name"
            placeholder="Gideon"
            autoComplete="given-name"
            containerStyle={styles.nameField}
          />
          <InputField
            label="Last name"
            placeholder="Atauba"
            autoComplete="family-name"
            containerStyle={styles.nameField}
          />
        </View>
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
          placeholder="Create a password"
          hint="At least 6 characters"
          secureTextEntry={!isPasswordVisible}
          autoComplete="new-password"
          textContentType="newPassword"
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

      <AppButton label="Create account" onPress={() => router.replace('/')} style={styles.submit} />
      <ThemedText type="caption" themeColor="textTertiary" style={styles.terms}>
        By continuing you agree to the storr terms and privacy policy.
      </ThemedText>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/sign-in')}
        hitSlop={8}
        style={styles.switchRow}>
        <ThemedText type="small" themeColor="textSecondary">
          Already have an account?{' '}
        </ThemedText>
        <ThemedText type="linkPrimary">Sign in</ThemedText>
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
  nameRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  nameField: {
    flex: 1,
  },
  submit: {
    marginTop: Spacing.xxxl,
  },
  terms: {
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
});
