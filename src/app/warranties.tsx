import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CategoryIcon } from '@/components/ui/categoryIcon';
import { EmptyState } from '@/components/ui/emptyState';
import { ListRow } from '@/components/ui/listRow';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screenHeader';
import { StatusPill, type StatusTone } from '@/components/ui/statusPill';
import { Surface } from '@/components/ui/surface';
import { Radius, Spacing } from '@/constants/theme';
import { useItem } from '@/hooks/use-item';
import { useTheme } from '@/hooks/use-theme';
import { formatRelativeDate } from '@/utils/format';
import type { Item } from '@/utils/types';

const DAY_MS = 86_400_000;

type Status = 'expiring' | 'active' | 'expired';
type Tracked = { item: Item; kind: 'Warranty' | 'Expiry'; iso: string; status: Status };

function lapseOf(item: Item): { kind: 'Warranty' | 'Expiry'; iso: string } | null {
  if (item.warrantyExpiresAt) return { kind: 'Warranty', iso: item.warrantyExpiresAt };
  if (item.expiryDate) return { kind: 'Expiry', iso: item.expiryDate };
  return null;
}

// Kept out of render so the "now" lookup isn't an impure call during render.
function buildTracked(items: Item[]): Tracked[] {
  const now = Date.now();
  const result: Tracked[] = [];
  for (const item of items) {
    const lapse = lapseOf(item);
    if (!lapse) continue;
    const at = new Date(lapse.iso).getTime();
    if (Number.isNaN(at)) continue;
    const days = (at - now) / DAY_MS;
    const status: Status = days < 0 ? 'expired' : days <= 30 ? 'expiring' : 'active';
    result.push({ item, kind: lapse.kind, iso: lapse.iso, status });
  }
  // Soonest first.
  return result.sort((a, b) => new Date(a.iso).getTime() - new Date(b.iso).getTime());
}

const GROUPS: { status: Status; label: string; tone: StatusTone }[] = [
  { status: 'expiring', label: 'Expiring soon', tone: 'warning' },
  { status: 'active', label: 'Active', tone: 'success' },
  { status: 'expired', label: 'Expired', tone: 'danger' },
];

export default function Warranties() {
  const theme = useTheme();
  const { item } = useItem();
  const tracked = useMemo(() => buildTracked(item), [item]);

  const toneColor: Record<StatusTone, string> = {
    success: theme.primary,
    warning: theme.amber,
    danger: theme.coral,
    neutral: theme.textTertiary,
  };

  const countFor = (status: Status) => tracked.filter((entry) => entry.status === status).length;

  return (
    <Screen variant="stack">
      <ScreenHeader title="Warranties & expiry" />

      {tracked.length === 0 ? (
        <EmptyState
          icon="shield-checkmark-outline"
          title="Nothing to track yet"
          body="Add a warranty or expiry date to an item and it'll show up here, sorted by what lapses first."
          actionLabel="Add item"
          onAction={() => router.push('/add-item')}
        />
      ) : (
        <>
          <View style={styles.summary}>
            {GROUPS.map((group) => (
              <Surface
                key={group.status}
                variant="muted"
                padding="md"
                radius="md"
                style={styles.summaryTile}>
                <View style={[styles.dot, { backgroundColor: toneColor[group.tone] }]} />
                <ThemedText type="subtitle">{countFor(group.status)}</ThemedText>
                <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
                  {group.label}
                </ThemedText>
              </Surface>
            ))}
          </View>

          {GROUPS.map((group) => {
            const rows = tracked.filter((entry) => entry.status === group.status);
            if (rows.length === 0) return null;
            return (
              <View key={group.status} style={styles.group}>
                <ThemedText type="label" themeColor="textTertiary" style={styles.groupLabel}>
                  {group.label}
                </ThemedText>
                <Surface padding="none">
                  {rows.map((entry, index) => (
                    <ListRow
                      key={entry.item.id}
                      title={entry.item.name}
                      subtitle={`${entry.kind} · ${formatRelativeDate(entry.iso)}`}
                      leading={<CategoryIcon category={entry.item.category} />}
                      trailing={<StatusPill label={formatRelativeDate(entry.iso)} tone={group.tone} />}
                      chevron
                      onPress={() =>
                        router.push({ pathname: '/item-detail', params: { id: entry.item.id } })
                      }
                      isLast={index === rows.length - 1}
                    />
                  ))}
                </Surface>
              </View>
            );
          })}
        </>
      )}
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
