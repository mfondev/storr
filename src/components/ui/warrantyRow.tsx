import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CategoryIcon } from '@/components/ui/categoryIcon';
import { ProgressBar } from '@/components/ui/progressBar';
import { StatusPill } from '@/components/ui/statusPill';
import type { CoveredItem } from '@/constants/sampleData';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type WarrantyRowProps = {
  item: CoveredItem;
  /** Show how much of the coverage period remains. */
  showProgress?: boolean;
  isLast?: boolean;
  onPress?: () => void;
};

/** A coverage row for grouped warranty lists: item · plan · status, optional remaining-time bar. */
export function WarrantyRow({ item, showProgress = false, isLast = false, onPress }: WarrantyRowProps) {
  const theme = useTheme();
  const { warranty } = item;
  const remaining = warranty.totalDays > 0 ? warranty.daysLeft / warranty.totalDays : 0;

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
      <View style={styles.main}>
        <CategoryIcon category={item.category} icon={item.icon} size={40} />
        <View style={styles.text}>
          <ThemedText type="bodyMedium" numberOfLines={1}>
            {item.name}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
            {warranty.plan}
          </ThemedText>
        </View>
        <StatusPill label={warranty.label} tone={warranty.tone} />
      </View>
      {showProgress && <ProgressBar value={remaining} tone={warranty.tone} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.xxs,
  },
});
