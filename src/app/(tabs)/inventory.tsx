import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { CategoryIcon, type Category } from '@/components/ui/categoryIcon';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/emptyState';
import { IconButton } from '@/components/ui/iconButton';
import { InputField } from '@/components/ui/inputField';
import { ListRow } from '@/components/ui/listRow';
import { Screen } from '@/components/ui/screen';
import { PageTitle } from '@/components/ui/screenHeader';
import { StatusPill } from '@/components/ui/statusPill';
import { Surface } from '@/components/ui/surface';
import { Layout, Spacing } from '@/constants/theme';
import { useItem } from '@/hooks/use-item';
import { formatCategory, formatPrice, formatRelativeDate } from '@/utils/format';
type Filter = Category | 'All';

export default function Inventory() {
  const { item } = useItem();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  // The categories actually present, with a count, for the filter chips.
  const categoryCounts = item.reduce<Record<string, number>>((acc, it) => {
    acc[it.category] = (acc[it.category] ?? 0) + 1;
    return acc;
  }, {});
  const categories = Object.keys(categoryCounts) as Category[];

  const needle = query.trim().toLowerCase();
  const visible = item.filter(
    (entry) =>
      (filter === 'All' || entry.category === filter) &&
      (needle === '' || entry.name.toLowerCase().includes(needle)),
  );

  return (
    <Screen variant="tab">
      <PageTitle
        eyebrow="Inventory"
        title={`${item.length} items`}
        rightSlot={<IconButton icon="options-outline" accessibilityLabel="Sort and filter" />}
      />

      <InputField
        icon="search-outline"
        placeholder="Search your belongings"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.bleed}
        contentContainerStyle={styles.chips}>
        <Chip label="All" selected={filter === 'All'} onPress={() => setFilter('All')} />
        {categories.map((category) => (
          <Chip
            key={category}
            label={formatCategory(category)}
            count={categoryCounts[category]}
            selected={filter === category}
            onPress={() => setFilter(category)}
          />
        ))}
      </ScrollView>

      {visible.length === 0 ? (
        <EmptyState
          icon={item.length === 0 ? 'cube-outline' : 'search-outline'}
          title={item.length === 0 ? 'No items yet' : 'Nothing matches'}
          body={
            item.length === 0
              ? 'Add your first item to start building your inventory — its price, warranty and details live here.'
              : 'No items match this search or category. Try a different term.'
          }
          actionLabel="Add item"
          onAction={() => router.push('/add-item')}
        />
      ) : (
        <View style={styles.list}>
          <ThemedText type="label" themeColor="textTertiary" style={styles.count}>
            {visible.length} shown
          </ThemedText>
          <Surface padding="none">
            {visible.map((entry, index) => (
              <ListRow
                key={entry.id}
                title={entry.name}
                subtitle={
                  <View style={styles.subtitle}>
                    <ThemedText type="caption" themeColor="textTertiary">
                      {formatCategory(entry.category)}
                    </ThemedText>
                    <ThemedText type="smallBold">
                      {formatPrice(entry.priceCents, entry.currency)}
                    </ThemedText>
                  </View>
                }
                leading={<CategoryIcon category={entry.category} />}
                trailing={
                  entry.warrantyExpiresAt && (
                    <StatusPill label={formatRelativeDate(entry.warrantyExpiresAt)} />
                  )
                }
                chevron
                onPress={() => router.push({ pathname: '/item-detail', params: { id: entry.id } })}
                isLast={index === visible.length - 1}
              />
            ))}
          </Surface>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  bleed: {
    marginHorizontal: -Layout.screenPadding,
    marginTop: Spacing.lg,
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Layout.screenPadding,
  },
  list: {
    marginTop: Spacing.xxl,
    gap: Spacing.md,
  },
  count: {
    paddingHorizontal: Spacing.xs,
  },
  subtitle: {
    gap: 2,
  },
});
