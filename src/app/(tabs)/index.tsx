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
import { Screen } from '@/components/ui/screen';
import { sampleUser } from '@/constants/sampleData';
import { Spacing } from '@/constants/theme';

function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Index() {
  const [firstName] = sampleUser.name.split(' ');

  return (
    <Screen variant="tab">
      <View style={styles.header}>
        <View style={styles.greeting}>
          <ThemedText type="small" themeColor="textSecondary">
            {greetingForNow()}
          </ThemedText>
          <ThemedText type="title">{firstName}</ThemedText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => router.push('/profile')}
          hitSlop={8}>
          <Avatar name={sampleUser.name} size={44} />
        </Pressable>
      </View>

      <HeroCard />
      <QuickActions />
      <AttentionBanner />
      <RecentItems />
      <CategoriesRow />
      <ExpiringSoon />
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
