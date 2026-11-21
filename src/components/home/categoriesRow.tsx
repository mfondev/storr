import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { SectionHeader } from '@/components/ui/sectionHeader';
import { Layout, Spacing } from '@/constants/theme';
import { formatCategory } from '@/utils/format';
import type { Item } from '@/utils/types';

export default function CategoriesRow({ items }: { items: Item[] }) {
  const counts = items.reduce<Record<string, number>>((acc, it) => {
    acc[it.category] = (acc[it.category] ?? 0) + 1;
    return acc;
  }, {});
  const categories = Object.keys(counts);

  if (categories.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader title="Categories" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.bleed}
        contentContainerStyle={styles.chips}>
        {categories.map((category) => (
          <Chip
            key={category}
            label={formatCategory(category)}
            count={counts[category]}
            onPress={() => router.push('/inventory')}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: Spacing.xxxl,
  },
  bleed: {
    marginHorizontal: -Layout.screenPadding,
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Layout.screenPadding,
  },
});
