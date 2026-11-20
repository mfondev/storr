import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { useMemo } from "react";
import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/emptyState";
import { Icon, type IconName } from "@/components/ui/icon";
import { Screen } from "@/components/ui/screen";
import { PageTitle } from "@/components/ui/screenHeader";
import type { StatusTone } from "@/components/ui/statusPill";
import { Surface } from "@/components/ui/surface";
import { IconSize, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useItem } from "@/hooks/use-item";
import { formatCategory, formatDate, formatTime } from "@/utils/format";
import type { Item } from "@/utils/types";

type ActivityEntry = {
  id: string;
  icon: IconName;
  tone: StatusTone;
  title: string;
  detail: string;
};

type ActivityGroup = { label: string; entries: ActivityEntry[] };

// Items added in the last 7 days — kept out of render (uses "now").
function addedThisWeek(items: Item[]): number {
  const cutoff = Date.now() - 7 * 86_400_000;
  return items.filter((it) => new Date(it.createdAt).getTime() >= cutoff).length;
}

// A human day-bucket for a timestamp: Today / Yesterday / Earlier this week / the date.
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

// Build the timeline straight from the items, newest first, grouped by day.
function buildGroups(items: Item[]): ActivityGroup[] {
  const sorted = [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const groups: ActivityGroup[] = [];
  for (const it of sorted) {
    const entry: ActivityEntry = {
      id: it.id,
      icon: "add-circle-outline",
      tone: "success",
      title: `Added ${it.name}`,
      detail: `${formatCategory(it.category)} · ${formatTime(it.createdAt)}`,
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

  // Recompute the timeline only when the item list changes.
  const groups = useMemo(() => buildGroups(item), [item]);
  const thisWeek = useMemo(() => addedThisWeek(item), [item]);

  const toneColors: Record<StatusTone, { bg: string; fg: string }> = {
    success: { bg: theme.primaryTint, fg: theme.primary },
    warning: { bg: theme.amberTint, fg: theme.amber },
    danger: { bg: theme.coralTint, fg: theme.coral },
    neutral: { bg: theme.backgroundElement, fg: theme.textSecondary },
  };

  return (
    <Screen variant="tab">
      <PageTitle eyebrow="Log" title="Activity" />

      {item.length === 0 ? (
        <EmptyState
          icon="pulse-outline"
          title="No activity yet"
          body="Your recent actions — adding items, warranty reminders, updates — will appear here."
        />
      ) : (
        <Surface padding="none" style={styles.summary}>
          <View style={styles.summaryStat}>
            <ThemedText type="heading">{item.length}</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              Total items
            </ThemedText>
          </View>
          <View style={[styles.summaryDivider, { backgroundColor: theme.border }]} />
          <View style={styles.summaryStat}>
            <ThemedText type="heading">{thisWeek}</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              Added this week
            </ThemedText>
          </View>
        </Surface>
      )}

      {groups.map((group) => (
        <View key={group.label} style={styles.group}>
          <ThemedText
            type="label"
            themeColor="textTertiary"
            style={styles.groupLabel}
          >
            {group.label}
          </ThemedText>

          {group.entries.map((entry, index) => {
            const colors = toneColors[entry.tone];
            const isLast = index === group.entries.length - 1;
            return (
              <Pressable
                key={entry.id}
                accessibilityRole="button"
                onPress={() =>
                  router.push({ pathname: "/item-detail", params: { id: entry.id } })
                }
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              >
                <View style={styles.rail}>
                  <View style={[styles.node, { backgroundColor: colors.bg }]}>
                    <Icon
                      name={entry.icon}
                      size={IconSize.sm}
                      color={colors.fg}
                    />
                  </View>
                  {!isLast && (
                    <View
                      style={[styles.line, { backgroundColor: theme.border }]}
                    />
                  )}
                </View>
                <View style={[styles.body, !isLast && styles.bodySpaced]}>
                  <ThemedText type="bodyMedium">{entry.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {entry.detail}
                  </ThemedText>
                </View>
                <Icon
                  name="chevron-forward"
                  size={IconSize.sm}
                  color={theme.textTertiary}
                  style={styles.chevron}
                />
              </Pressable>
            );
          })}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxl,
    paddingVertical: Spacing.lg,
  },
  summaryStat: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xxs,
  },
  summaryDivider: {
    width: StyleSheet.hairlineWidth,
    height: 36,
  },
  group: {
    marginBottom: Spacing.xxl,
  },
  groupLabel: {
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  rowPressed: {
    opacity: 0.6,
  },
  chevron: {
    alignSelf: "center",
  },
  rail: {
    width: 36,
    alignItems: "center",
  },
  node: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    flex: 1,
    width: 2,
    marginVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  body: {
    flex: 1,
    gap: Spacing.xxs,
    paddingTop: Spacing.sm,
  },
  bodySpaced: {
    paddingBottom: Spacing.xl,
  },
});
