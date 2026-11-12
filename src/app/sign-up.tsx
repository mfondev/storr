import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { InputField } from '@/components/ui/inputField';
import { PrimaryButton } from '@/components/ui/primaryButton';

export default function SignUp() {
  // UI only for now — no auth yet. The button navigates as a placeholder.
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <ThemedText type="small" themeColor="textSecondary">
              Get started
            </ThemedText>
            <ThemedText type="subtitle">Create account</ThemedText>
          </View>

          <View style={styles.form}>
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <InputField label="First name" placeholder="Gideon" autoComplete="given-name" />
              </View>
              <View style={styles.nameField}>
                <InputField label="Last name" placeholder="Atauba" autoComplete="family-name" />
              </View>
            </View>
            <InputField
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <InputField
              label="Password"
              placeholder="At least 6 characters"
              secureTextEntry
              autoComplete="new-password"
            />
          </View>

          <View style={styles.footer}>
            <PrimaryButton label="Create account" onPress={() => router.replace('/')} />
            <Pressable onPress={() => router.push('/sign-in')} hitSlop={8} style={styles.switchRow}>
              <ThemedText type="small" themeColor="textSecondary">
                Already have an account?{' '}
              </ThemedText>
              <ThemedText type="smallBold" themeColor="accent">
                Sign in
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
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
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  header: {
    gap: 4,
    marginBottom: 32,
  },
  form: {
    gap: 18,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  footer: {
    marginTop: 'auto',
    gap: 18,
    paddingTop: 32,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
