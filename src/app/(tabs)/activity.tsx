import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { PageTitle } from '@/components/ui/screenHeader';
import type { StatusTone } from '@/components/ui/statusPill';
import { sampleActivity } from '@/constants/sampleData';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function Activity() {
  const theme = useTheme();

  const toneColors: Record<StatusTone, { bg: string; fg: string }> = {
    success: { bg: theme.primaryTint, fg: theme.primary },
    warning: { bg: theme.amberTint, fg: theme.amber },
    danger: { bg: theme.coralTint, fg: theme.coral },
    neutral: { bg: theme.backgroundElement, fg: theme.textSecondary },
  };

  return (
    <Screen variant="tab">
      <PageTitle eyebrow="Log" title="Activity" />

      {sampleActivity.map((group) => (
        <View key={group.label} style={styles.group}>
          <ThemedText type="label" themeColor="textTertiary" style={styles.groupLabel}>
            {group.label}
          </ThemedText>

          {group.entries.map((entry, index) => {
            const colors = toneColors[entry.tone];
            const isLast = index === group.entries.length - 1;
            return (
              <View key={entry.id} style={styles.row}>
                <View style={styles.rail}>
                  <View style={[styles.node, { backgroundColor: colors.bg }]}>
                    <Icon name={entry.icon} size={IconSize.sm} color={colors.fg} />
                  </View>
                  {!isLast && <View style={[styles.line, { backgroundColor: theme.border }]} />}
                </View>
                <View style={[styles.body, !isLast && styles.bodySpaced]}>
                  <ThemedText type="bodyMedium">{entry.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {entry.detail}
                  </ThemedText>
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: Spacing.xxl,
  },
  groupLabel: {
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  rail: {
    width: 36,
    alignItems: 'center',
  },
  node: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
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
