import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { IconSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ListRowProps = {
  title: string;
  subtitle?: string;
  /** Thumbnail / icon rendered before the text. */
  leading?: ReactNode;
  /** Pill, value or control rendered after the text. */
  trailing?: ReactNode;
  onPress?: () => void;
  chevron?: boolean;
  /** Suppresses the divider under the last row of a group. */
  isLast?: boolean;
};

/** A row inside a grouped `Surface` list: leading · title/subtitle · trailing. */
export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  chevron = false,
  isLast = false,
}: ListRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border },
        pressed && { backgroundColor: theme.backgroundElement },
      ]}>
      {leading}
      <View style={styles.text}>
        <ThemedText type="bodyMedium" numberOfLines={1}>
          {title}
        </ThemedText>
        {subtitle && (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      {trailing}
      {chevron && <Icon name="chevron-forward" size={IconSize.sm} color={theme.textTertiary} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.xxs,
  },
});
