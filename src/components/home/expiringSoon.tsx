import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CategoryIcon } from '@/components/ui/categoryIcon';
import { ListRow } from '@/components/ui/listRow';
import { SectionHeader } from '@/components/ui/sectionHeader';
import { StatusPill } from '@/components/ui/statusPill';
import { Surface } from '@/components/ui/surface';
import { Spacing } from '@/constants/theme';
import { formatRelativeDate } from '@/utils/format';
import type { Item } from '@/utils/types';

const DAY_MS = 86_400_000;

/** The soonest lapse date an item has (warranty, else expiry), as a timestamp. */
function lapseAt(item: Item): number | null {
  const value = item.warrantyExpiresAt ?? item.expiryDate;
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

// Kept out of render so the "now" lookup isn't an impure call during render.
function getExpiring(items: Item[]): Item[] {
  const now = Date.now();
  return items
    .map((item) => ({ item, at: lapseAt(item) }))
    .filter((entry): entry is { item: Item; at: number } => {
      if (entry.at === null) return false;
      const diff = entry.at - now;
      return diff >= 0 && diff <= 30 * DAY_MS;
    })
    .sort((a, b) => a.at - b.at)
    .map((entry) => entry.item);
}

export default function ExpiringSoon({ items }: { items: Item[] }) {
  const expiring = getExpiring(items);

  if (expiring.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Expiring soon"
        subtitle="Ending in the next 30 days"
        actionLabel="See all"
        onAction={() => router.push('/warranties')}
      />
      <Surface padding="none">
        {expiring.map((item, index) => (
          <ListRow
            key={item.id}
            title={item.name}
            subtitle={item.warrantyExpiresAt ? 'Warranty ends' : 'Expires'}
            leading={<CategoryIcon category={item.category} />}
            trailing={
              <StatusPill
                label={formatRelativeDate(item.warrantyExpiresAt ?? item.expiryDate)}
                tone="warning"
              />
            }
            chevron
            onPress={() => router.push({ pathname: '/item-detail', params: { id: item.id } })}
            isLast={index === expiring.length - 1}
          />
        ))}
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: Spacing.xxxl,
  },
});
