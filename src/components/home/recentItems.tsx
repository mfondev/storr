import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CategoryIcon } from '@/components/ui/categoryIcon';
import { ListRow } from '@/components/ui/listRow';
import { SectionHeader } from '@/components/ui/sectionHeader';
import { StatusPill } from '@/components/ui/statusPill';
import { Surface } from '@/components/ui/surface';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { formatCategory, formatPrice, formatRelativeDate } from '@/utils/format';
import type { Item } from '@/utils/types';

export default function RecentItems({ items }: { items: Item[] }) {
  const recent = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  if (recent.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Recent items"
        subtitle="Your latest additions"
        actionLabel="See all"
        onAction={() => router.push('/inventory')}
      />
      <Surface padding="none">
        {recent.map((item, index) => (
          <ListRow
            key={item.id}
            title={item.name}
            subtitle={
              <View style={styles.subtitle}>
                <ThemedText type="caption" themeColor="textTertiary">
                  {formatCategory(item.category)}
                </ThemedText>
                <ThemedText type="smallBold">
                  {formatPrice(item.priceCents, item.currency)}
                </ThemedText>
              </View>
            }
            leading={<CategoryIcon category={item.category} />}
            trailing={
              item.warrantyExpiresAt && (
                <StatusPill label={formatRelativeDate(item.warrantyExpiresAt)} />
              )
            }
            chevron
            onPress={() => router.push({ pathname: '/item-detail', params: { id: item.id } })}
            isLast={index === recent.length - 1}
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
  subtitle: {
    gap: 2,
  },
});
