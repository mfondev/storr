import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screenHeader';
import type { StatusTone } from '@/components/ui/statusPill';
import { Surface } from '@/components/ui/surface';
import { WarrantyRow } from '@/components/ui/warrantyRow';
import { hasWarranty, sampleItems, type CoveredItem } from '@/constants/sampleData';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const COVERED = sampleItems.filter(hasWarranty);

const GROUPS: { label: string; tone: StatusTone; items: CoveredItem[] }[] = [
  { label: 'Expiring soon', tone: 'warning', items: COVERED.filter((item) => item.warranty.tone === 'warning') },
  { label: 'Active', tone: 'success', items: COVERED.filter((item) => item.warranty.tone === 'success') },
  { label: 'Expired', tone: 'danger', items: COVERED.filter((item) => item.warranty.tone === 'danger') },
];

export default function Warranties() {
  const theme = useTheme();

  const toneColor: Record<StatusTone, string> = {
    success: theme.primary,
    warning: theme.amber,
    danger: theme.coral,
    neutral: theme.textTertiary,
  };

  return (
    <Screen variant="stack">
      <ScreenHeader title="Warranties" />

      <View style={styles.summary}>
        {GROUPS.map((group) => (
          <Surface key={group.label} variant="muted" padding="md" radius="md" style={styles.summaryTile}>
            <View style={[styles.dot, { backgroundColor: toneColor[group.tone] }]} />
            <ThemedText type="subtitle">{group.items.length}</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
              {group.label}
            </ThemedText>
          </Surface>
        ))}
      </View>

      {GROUPS.map((group) => (
        <View key={group.label} style={styles.group}>
          <ThemedText type="label" themeColor="textTertiary" style={styles.groupLabel}>
            {group.label}
          </ThemedText>
          <Surface padding="none">
            {group.items.map((item, index) => (
              <WarrantyRow
                key={item.id}
                item={item}
                showProgress={group.tone === 'warning'}
                onPress={() => router.push('/item-detail')}
                isLast={index === group.items.length - 1}
              />
            ))}
          </Surface>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxxl,
  },
  summaryTile: {
    flex: 1,
    gap: Spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
    marginBottom: Spacing.xs,
  },
  group: {
    marginBottom: Spacing.xxl,
  },
  groupLabel: {
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
});
