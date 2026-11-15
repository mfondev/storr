import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import AttentionBanner from '@/components/home/attentionBanner';
import CategoriesRow from '@/components/home/categoriesRow';
import ExpiringSoon from '@/components/home/expiringSoon';
import HeroCard from '@/components/home/heroCard';
import QuickActions from '@/components/home/quickActions';
import RecentItems from '@/components/home/recentItems';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/emptyState';
import { Screen } from '@/components/ui/screen';
import { sampleItems } from '@/constants/sampleData';
import { Spacing } from '@/constants/theme';
import { displayNameOf, useAuth } from '@/hooks/use-auth';

function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Index() {
  const { user } = useAuth();
  const name = displayNameOf(user);
  // Prefer the user's actual name; fall back to the email handle, then a generic greeting.
  const firstName = user?.firstName || user?.lastName || name;
  const hasItems = sampleItems.length > 0;

  return (
    <Screen variant="tab">
      <View style={styles.header}>
        <View style={styles.greeting}>
          <ThemedText type="small" themeColor="textSecondary">
            {greetingForNow()}
          </ThemedText>
          <ThemedText type="title">{firstName || 'there'}</ThemedText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => router.push('/profile')}
          hitSlop={8}>
          <Avatar name={name || '?'} size={44} />
        </Pressable>
      </View>

      <HeroCard />
      <QuickActions />

      {hasItems ? (
        <>
          <AttentionBanner />
          <RecentItems />
          <CategoriesRow />
          <ExpiringSoon />
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
