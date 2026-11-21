import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { CategoryIcon } from "@/components/ui/categoryIcon";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/emptyState";
import { Icon } from "@/components/ui/icon";
import { Screen } from "@/components/ui/screen";
import { PageTitle } from "@/components/ui/screenHeader";
import { Surface } from "@/components/ui/surface";
import { IconSize, Layout, Spacing } from "@/constants/theme";
import { useItem } from "@/hooks/use-item";
import { useTheme } from "@/hooks/use-theme";
import { formatCategory, formatDate, formatPrice, formatTime } from "@/utils/format";
import type { Category, Item } from "@/utils/types";

type Filter = Category | "All";

type ActivityEntry = {
  id: string;
  category: Category;
  title: string;
  detail: string;
  price: string;
};

type ActivityGroup = { label: string; entries: ActivityEntry[] };

// Items added in the last 7 days — kept out of render because it reads "now".
function addedThisWeek(items: Item[]): number {
  const cutoff = Date.now() - 7 * 86_400_000;
  return items.filter((it) => new Date(it.createdAt).getTime() >= cutoff).length;
}

// Today / Yesterday / Earlier this week / the date.
function bucketLabel(iso: string): string {
  const atDay = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy.getTime();
  };
  const days = Math.round((atDay(new Date()) - atDay(new Date(iso))) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return "Earlier this week";
  return formatDate(iso);
}

function buildGroups(items: Item[]): ActivityGroup[] {
  const sorted = [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const groups: ActivityGroup[] = [];
  for (const it of sorted) {
    const entry: ActivityEntry = {
      id: it.id,
      category: it.category,
      title: it.name,
      detail: `Added · ${formatTime(it.createdAt)}`,
      price: formatPrice(it.priceCents, it.currency),
    };
    const last = groups[groups.length - 1];
    const label = bucketLabel(it.createdAt);
    if (last && last.label === label) last.entries.push(entry);
    else groups.push({ label, entries: [entry] });
  }
  return groups;
}

export default function Activity() {
  const theme = useTheme();
  const { item } = useItem();
  const [filter, setFilter] = useState<Filter>("All");

  const thisWeek = useMemo(() => addedThisWeek(item), [item]);
  const categories = useMemo(
    () => Array.from(new Set(item.map((it) => it.category))) as Category[],
    [item],
  );
  const groups = useMemo(() => {
    const visible = filter === "All" ? item : item.filter((it) => it.category === filter);
    return buildGroups(visible);
  }, [item, filter]);

  if (item.length === 0) {
    return (
      <Screen variant="tab">
        <PageTitle eyebrow="Log" title="Activity" />
        <EmptyState
          icon="pulse-outline"
          title="No activity yet"
          body="Your recent actions — adding items, warranty reminders, updates — will appear here."
        />
      </Screen>
    );
  }

  const tiles = [
    { label: "Items", value: String(item.length) },
    { label: "This week", value: String(thisWeek) },
  ];

  return (
    <Screen variant="tab">
      <PageTitle eyebrow="Log" title="Activity" />

      <View style={styles.stats}>
        {tiles.map((tile) => (
          <Surface key={tile.label} variant="muted" padding="md" radius="md" style={styles.statTile}>
            <ThemedText type="heading" numberOfLines={1} adjustsFontSizeToFit>
              {tile.value}
            </ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              {tile.label}
            </ThemedText>
          </Surface>
        ))}
      </View>

      {categories.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bleed}
          contentContainerStyle={styles.chips}>
          <Chip label="All" selected={filter === "All"} onPress={() => setFilter("All")} />
          {categories.map((category) => (
            <Chip
              key={category}
              label={formatCategory(category)}
              selected={filter === category}
              onPress={() => setFilter(category)}
            />
          ))}
        </ScrollView>
      )}

      {groups.map((group) => (
        <View key={group.label} style={styles.group}>
          <ThemedText type="label" themeColor="textTertiary" style={styles.groupLabel}>
            {group.label}
          </ThemedText>

          <Surface padding="none">
            {group.entries.map((entry, index) => {
              const isLast = index === group.entries.length - 1;
              return (
                <Pressable
                  key={entry.id}
                  accessibilityRole="button"
                  onPress={() =>
                    router.push({ pathname: "/item-detail", params: { id: entry.id } })
                  }
                  style={({ pressed }) => [
                    styles.row,
                    !isLast && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: theme.border,
                    },
                    pressed && { backgroundColor: theme.backgroundElement },
                  ]}>
                  <CategoryIcon category={entry.category} size={40} />
                  <View style={styles.body}>
                    <ThemedText type="bodyMedium" numberOfLines={1}>
                      {entry.title}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {entry.detail}
                    </ThemedText>
                  </View>
                  <ThemedText type="smallBold" themeColor="textSecondary">
                    {entry.price}
                  </ThemedText>
                  <Icon name="chevron-forward" size={IconSize.sm} color={theme.textTertiary} />
                </Pressable>
              );
            })}
          </Surface>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  statTile: {
    flex: 1,
    gap: Spacing.xxs,
  },
  bleed: {
    marginHorizontal: -Layout.screenPadding,
    marginBottom: Spacing.xl,
  },
  chips: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingHorizontal: Layout.screenPadding,
  },
  group: {
    marginBottom: Spacing.xxl,
  },
  groupLabel: {
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  body: {
    flex: 1,
    gap: Spacing.xxs,
  },
});
