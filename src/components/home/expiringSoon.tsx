import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { SectionHeader } from '@/components/ui/sectionHeader';
import { Surface } from '@/components/ui/surface';
import { WarrantyRow } from '@/components/ui/warrantyRow';
import { hasWarranty, sampleItems } from '@/constants/sampleData';
import { Spacing } from '@/constants/theme';

const EXPIRING = sampleItems.filter(hasWarranty).filter((item) => item.warranty.tone === 'warning');

export default function ExpiringSoon() {
  return (
    <View style={styles.section}>
      <SectionHeader
        title="Expiring soon"
        subtitle="Coverage ending in the next 30 days"
        actionLabel="See all"
        onAction={() => router.push('/warranties')}
      />
      <Surface padding="none">
        {EXPIRING.map((item, index) => (
          <WarrantyRow
            key={item.id}
            item={item}
            showProgress
            onPress={() => router.push('/item-detail')}
            isLast={index === EXPIRING.length - 1}
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
