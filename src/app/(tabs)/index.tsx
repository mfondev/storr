import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AttentionBanner from '@/components/home/attentionBanner';
import CategoriesRow from '@/components/home/categoriesRow';
import ExpiringSoon from '@/components/home/expiringSoon';
import HomeCards from '@/components/home/homeCards';
import QuickActions from '@/components/home/quickActions';
import RecentItems from '@/components/home/recentItems';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/emptyState';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { displayNameOf, useAuth } from '@/hooks/use-auth';
import { useItem } from '@/hooks/use-item';
import type { Item } from '@/utils/types';

const DAY_MS = 86_400_000;

function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Kept out of render so the "now" lookup isn't an impure call during render.
function computeTotals(items: Item[]) {
  const now = Date.now();
  const covered = items.filter((it) => it.warrantyExpiresAt).length;
  const expiring = items.filter((it) => {
    const lapse = it.warrantyExpiresAt ?? it.expiryDate;
    if (!lapse) return false;
    const diff = new Date(lapse).getTime() - now;
    return diff >= 0 && diff <= 30 * DAY_MS;
  }).length;
  return { covered, expiring };
}

export default function Index() {
  const { user } = useAuth();
  const { item } = useItem();
  const name = displayNameOf(user);
  const hasItems = item.length > 0;

  // Headline numbers, recomputed only when the item list changes.
  const totals = useMemo(() => computeTotals(item), [item]);

  return (
    <Screen variant="tab">
      <View style={styles.header}>
        <View style={styles.greeting}>
          <ThemedText type="small" themeColor="textSecondary">
            {greetingForNow()}
          </ThemedText>
          <ThemedText type="title">{user?.firstName || 'there'}</ThemedText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => router.push('/profile')}
          hitSlop={8}>
          <Avatar name={name || '?'} size={44} />
        </Pressable>
      </View>

      <HomeCards items={item.length} covered={totals.covered} expiring={totals.expiring} />
      <QuickActions />

      {hasItems ? (
        <>
          <AttentionBanner count={totals.expiring} />
          <RecentItems items={item} />
          <CategoriesRow items={item} />
          <ExpiringSoon items={item} />
        </>
      ) : (
        <EmptyState
          icon="cube-outline"
          title="Your storr is empty"
          body="Add your first item to start tracking its price, warranty and details — it'll show up here."
          actionLabel="Add item"
          onAction={() => router.push('/add-item')}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
  },
  greeting: {
    gap: Spacing.xxs,
  },
});
