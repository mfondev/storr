import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/chip';
import { SectionHeader } from '@/components/ui/sectionHeader';
import { sampleCategories } from '@/constants/sampleData';
import { Layout, Spacing } from '@/constants/theme';

export default function CategoriesRow() {
  return (
    <View style={styles.section}>
      <SectionHeader title="Categories" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.bleed}
        contentContainerStyle={styles.chips}>
        {sampleCategories.map((entry) => (
          <Chip
            key={entry.category}
            label={entry.category}
            count={entry.count}
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
