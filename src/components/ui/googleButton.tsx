import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { GoogleIcon } from '@/components/ui/googleIcon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type GoogleButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
};

/** Shared "Continue with Google" button used on the sign-in and sign-up screens. */
export function GoogleButton({ label, onPress, disabled }: GoogleButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.card, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <GoogleIcon size={20} />
      <ThemedText type="bodyMedium">{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 54,
    borderWidth: 1,
    borderRadius: Radius.xl,
  },
  pressed: {
    opacity: 0.85,
  },
});
