import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Fonts, IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

type AppButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: AppButtonVariant;
  size?: 'md' | 'lg';
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
}: AppButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const palette: Record<AppButtonVariant, { bg?: string; fg: string; border?: string }> = {
    primary: { bg: theme.primary, fg: theme.onPrimary },
    secondary: { bg: theme.card, fg: theme.text, border: theme.border },
    ghost: { fg: theme.primary },
    destructive: { bg: theme.coralTint, fg: theme.coral },
  };
  const colors = palette[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        fullWidth && styles.fullWidth,
        { backgroundColor: colors.bg, borderColor: colors.border },
        colors.border !== undefined && styles.bordered,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={colors.fg} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Icon name={icon} size={IconSize.md} color={colors.fg} />
          )}
          <ThemedText style={[size === 'lg' ? styles.labelLg : styles.labelMd, { color: colors.fg }]}>
            {label}
          </ThemedText>
          {icon && iconPosition === 'right' && (
            <Icon name={icon} size={IconSize.md} color={colors.fg} />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.xl,
  },
  bordered: {
    borderWidth: 1,
  },
  lg: {
    height: 54,
  },
  md: {
    height: 44,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.sm,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  labelLg: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 16,
    lineHeight: 20,
  },
  labelMd: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.45,
  },
});
