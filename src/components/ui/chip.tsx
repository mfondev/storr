import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: IconName;
  /** Optional count shown after the label, e.g. a category total. */
  count?: number;
};

export function Chip({ label, selected = false, onPress, icon, count }: ChipProps) {
  const theme = useTheme();
  const fg = selected ? theme.onPrimary : theme.textSecondary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.chip,
        selected
          ? { backgroundColor: theme.primary, borderColor: theme.primary }
          : { backgroundColor: theme.card, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      {icon && <Icon name={icon} size={IconSize.sm} color={fg} />}
      <ThemedText type="smallBold" style={{ color: fg }}>
        {label}
      </ThemedText>
      {count !== undefined && (
        <ThemedText type="small" style={{ color: selected ? theme.heroMuted : theme.textTertiary }}>
          {count}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + Spacing.xxs,
    paddingHorizontal: Spacing.lg - Spacing.xxs,
    height: 38,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.8,
  },
});
