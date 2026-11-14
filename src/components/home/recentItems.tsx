import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CategoryIcon } from '@/components/ui/categoryIcon';
import { ListRow } from '@/components/ui/listRow';
import { SectionHeader } from '@/components/ui/sectionHeader';
import { StatusPill } from '@/components/ui/statusPill';
import { Surface } from '@/components/ui/surface';
import { sampleItems } from '@/constants/sampleData';
import { Spacing } from '@/constants/theme';

const RECENT = sampleItems.slice(0, 3);

export default function RecentItems() {
  return (
    <View style={styles.section}>
      <SectionHeader
        title="Recent items"
        subtitle="Your latest additions"
        actionLabel="See all"
        onAction={() => router.push('/inventory')}
      />
      <Surface padding="none">
        {RECENT.map((item, index) => (
          <ListRow
            key={item.id}
            title={item.name}
            subtitle={item.addedLabel}
            leading={<CategoryIcon category={item.category} icon={item.icon} />}
            trailing={
              item.warranty && <StatusPill label={item.warranty.label} tone={item.warranty.tone} />
            }
            chevron
            onPress={() => router.push('/item-detail')}
            isLast={index === RECENT.length - 1}
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
