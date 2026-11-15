import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { AppButton } from "@/components/ui/appButton";
import { BrandMark } from "@/components/ui/brandMark";
import { Icon } from "@/components/ui/icon";
import { InputField } from "@/components/ui/inputField";
import { Screen } from "@/components/ui/screen";
import { IconSize, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { registerUser } from "@/utils/auth";


export default function SignUp() {
  const theme = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    setErrorMessage(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setErrorMessage("Please complete the fields");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    setIsSubmitting(true);
    try {
      await registerUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });
      // Account created — send them to sign in to start their first session.
      router.replace("/sign-in")
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false)
    }
  };

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
            value={firstName}
            onChangeText={setFirstName}
            editable={!isSubmitting}
          />
          <InputField
            label="Last name"
            placeholder="Atauba"
            autoComplete="family-name"
            containerStyle={styles.nameField}
            value={lastName}
            onChangeText={setLastName}
            editable={!isSubmitting}
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
          value={email}
          onChangeText={setEmail}
          editable={!isSubmitting}
        />
        <InputField
          label="Password"
          icon="lock-closed-outline"
          placeholder="Create a password"
          hint="At least 6 characters"
          secureTextEntry={!isPasswordVisible}
          autoComplete="new-password"
          textContentType="newPassword"
          value={password}
          onChangeText={setPassword}
          editable={!isSubmitting}
          returnKeyType="go"
          onSubmitEditing={handleRegister}
          rightSlot={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                isPasswordVisible ? "Hide password" : "Show password"
              }
              onPress={() => setIsPasswordVisible((value) => !value)}
              hitSlop={8}
            >
              <Icon
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={IconSize.md}
                color={theme.textTertiary}
              />
            </Pressable>
          }
        />
      </View>

      {errorMessage && (
        <ThemedText type="small" themeColor="coral" style={styles.error}>
          {errorMessage}
        </ThemedText>
      )}

      <AppButton
        label="Create account"
        onPress={handleRegister}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={[styles.submit, errorMessage ? styles.submitTight : null]}
      />
      <ThemedText type="caption" themeColor="textTertiary" style={styles.terms}>
        By continuing you agree to the storr terms and privacy policy.
      </ThemedText>

      <Pressable
        accessibilityRole="button"
        onPress={handleRegister}
        hitSlop={8}
        style={styles.switchRow}
      >
        <ThemedText type="small" themeColor="textSecondary">
          Already have an account?{" "}
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
    flexDirection: "row",
    gap: Spacing.md,
  },
  nameField: {
    flex: 1,
  },
  error: {
    marginTop: Spacing.xxxl,
    textAlign: "center",
  },
  submit: {
    marginTop: Spacing.xxxl,
  },
  submitTight: {
    marginTop: Spacing.lg,
  },
  terms: {
    textAlign: "center",
    marginTop: Spacing.md,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xxl,
  },
});
