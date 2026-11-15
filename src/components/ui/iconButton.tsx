import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { IconSize, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type IconButtonProps = {
  icon: IconName;
  accessibilityLabel: string;
  onPress?: () => void;
  /** `onHero` is for use over gradient/hero surfaces. */
  variant?: 'default' | 'tinted' | 'onHero';
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  variant = 'default',
  size = 40,
  style,
}: IconButtonProps) {
  const theme = useTheme();

  const colors = {
    default: { bg: theme.backgroundElement, fg: theme.text },
    tinted: { bg: theme.primaryTint, fg: theme.primary },
    onHero: { bg: theme.heroOverlay, fg: theme.onPrimary },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, backgroundColor: colors.bg },
        pressed && styles.pressed,
        style,
      ]}>
      <Icon name={icon} size={IconSize.md} color={colors.fg} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
