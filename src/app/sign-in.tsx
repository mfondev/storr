import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AppButton } from '@/components/ui/appButton';
import { BrandMark } from '@/components/ui/brandMark';
import { GoogleButton } from '@/components/ui/googleButton';
import { Icon } from '@/components/ui/icon';
import { InputField } from '@/components/ui/inputField';
import { Screen } from '@/components/ui/screen';
import { IconSize, Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { useGoogleAuth } from '@/hooks/use-google-auth';
import { useTheme } from '@/hooks/use-theme';
import { loginUser } from '@/utils/auth';


export default function SignIn() {
  const theme = useTheme();
  const { signIn } = useAuth();
  const { promptGoogle, isGoogleLoading, googleError, isGoogleReady } = useGoogleAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Enter your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await loginUser({ email: email.trim(), password });
      await signIn(result.data.token, result.data.user);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <GoogleButton
        label="Continue with Google"
        onPress={promptGoogle}
        disabled={isSubmitting || isGoogleLoading || !isGoogleReady}
      />

      <View style={styles.divider}>
        <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
        <ThemedText type="caption" themeColor="textTertiary">
          or sign in with email
        </ThemedText>
        <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
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
          value={email}
          onChangeText={setEmail}
          editable={!isSubmitting}
        />
        <InputField
          label="Password"
          icon="lock-closed-outline"
          placeholder="Your password"
          secureTextEntry={!isPasswordVisible}
          autoComplete="password"
          textContentType="password"
          value={password}
          onChangeText={setPassword}
          editable={!isSubmitting}
          returnKeyType="go"
          onSubmitEditing={handleLogin}
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

      {(errorMessage ?? googleError) && (
        <ThemedText type="small" themeColor="coral" style={styles.error}>
          {errorMessage ?? googleError}
        </ThemedText>
      )}

      <AppButton
        label="Sign in"
        onPress={handleLogin}
        loading={isSubmitting}
        disabled={isSubmitting || isGoogleLoading}
        style={[styles.submit, (errorMessage ?? googleError) ? styles.submitTight : null]}
      />

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
    marginBottom: Spacing.xxl,
  },
  heading: {
    gap: Spacing.xs,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  form: {
    gap: Spacing.xl,
  },
  error: {
    marginTop: Spacing.xxxl,
    textAlign: 'center',
  },
  submit: {
    marginTop: Spacing.xxxl,
  },
  submitTight: {
    marginTop: Spacing.lg,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xxl,
  },
});
