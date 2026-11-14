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
import { sampleCategories, sampleItems, sampleTotals } from '@/constants/sampleData';
import { Layout, Spacing } from '@/constants/theme';

type Filter = Category | 'All';

export default function Inventory() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  const needle = query.trim().toLowerCase();
  const visible = sampleItems.filter(
    (item) =>
      (filter === 'All' || item.category === filter) &&
      (needle === '' || item.name.toLowerCase().includes(needle)),
  );

  return (
    <Screen variant="tab">
      <PageTitle
        eyebrow="Inventory"
        title={`${sampleTotals.items} items`}
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
        {sampleCategories.map((entry) => (
          <Chip
            key={entry.category}
            label={entry.category}
            count={entry.count}
            selected={filter === entry.category}
            onPress={() => setFilter(entry.category)}
          />
        ))}
      </ScrollView>

      {visible.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="Nothing here yet"
          body="No items match this search or category. Add the item you're looking for and it will show up here."
          actionLabel="Add item"
          onAction={() => router.push('/add-item')}
        />
      ) : (
        <View style={styles.list}>
          <ThemedText type="label" themeColor="textTertiary" style={styles.count}>
            {visible.length} shown
          </ThemedText>
          <Surface padding="none">
            {visible.map((item, index) => (
              <ListRow
                key={item.id}
                title={item.name}
                subtitle={`${item.category} · ${item.price}`}
                leading={<CategoryIcon category={item.category} icon={item.icon} />}
                trailing={
                  item.warranty && (
                    <StatusPill label={item.warranty.label} tone={item.warranty.tone} />
                  )
                }
                chevron
                onPress={() => router.push('/item-detail')}
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
});
