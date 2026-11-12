import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

type WarrantyTone = 'ok' | 'warn' | 'expired';

type InventoryItem = {
  name: string;
  category: string;
  price: string;
  warranty?: { label: string; tone: WarrantyTone };
};

const filters = ['All', 'Electronics', 'Home', 'Work', 'Other'] as const;

const items: InventoryItem[] = [
  { name: 'MacBook Pro 14"', category: 'Electronics', price: '$2,399', warranty: { label: 'Covered', tone: 'ok' } },
  { name: 'Sony WH-1000XM6', category: 'Electronics', price: '$399', warranty: { label: '7d left', tone: 'warn' } },
  { name: 'Dyson V15', category: 'Home', price: '$649', warranty: { label: 'Covered', tone: 'ok' } },
  { name: 'Standing desk', category: 'Work', price: '$410', warranty: { label: 'Expired', tone: 'expired' } },
  { name: 'Canon EOS R6', category: 'Electronics', price: '$2,499' },
];

export default function Inventory() {
  const theme = useTheme();
  const [active, setActive] = useState<string>('All');

  const toneColor: Record<WarrantyTone, { bg: string; text: string }> = {
    ok: { bg: theme.accentTint, text: theme.accent },
    warn: { bg: theme.amberTint, text: theme.amber },
    expired: { bg: theme.coralTint, text: theme.coral },
  };

  const visible = active === 'All' ? items : items.filter((item) => item.category === active);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          <ThemedText type="small" themeColor="textSecondary">
            Inventory
          </ThemedText>
          <ThemedText type="subtitle" style={styles.title}>
            {items.length} items
          </ThemedText>

          <View style={[styles.search, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <ThemedText type="small" themeColor="textSecondary">
              🔍  Search your belongings
            </ThemedText>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}>
            {filters.map((filter) => {
              const on = filter === active;
              return (
                <Pressable
                  key={filter}
                  onPress={() => setActive(filter)}
                  style={[
                    styles.filterChip,
                    { borderColor: theme.border },
                    on && { backgroundColor: theme.card_add_item, borderColor: theme.card_add_item },
                  ]}>
                  <ThemedText
                    type="small"
                    style={{ color: on ? theme.add_item_text : theme.textSecondary }}>
                    {filter}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.list}>
            {visible.map((item) => (
              <Pressable
                key={item.name}
                onPress={() => router.push('/item-detail')}
                style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={[styles.thumb, { backgroundColor: theme.accentTint }]} />
                <View style={styles.info}>
                  <ThemedText type="smallBold">{item.name}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.sub}>
                    {item.category} · {item.price}
                  </ThemedText>
                </View>
                {item.warranty && (
                  <View style={[styles.pill, { backgroundColor: toneColor[item.warranty.tone].bg }]}>
                    <ThemedText style={[styles.pillText, { color: toneColor[item.warranty.tone].text }]}>
                      {item.warranty.label}
                    </ThemedText>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    marginTop: 2,
    marginBottom: 16,
  },
  search: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 16,
  },
  filterRow: {
    gap: 8,
    paddingRight: 16,
    marginBottom: 20,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  list: {
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  sub: {
    marginTop: 2,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
