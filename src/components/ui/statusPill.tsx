import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type StatusTone = 'success' | 'warning' | 'danger' | 'neutral';

type StatusPillProps = {
  label: string;
  tone?: StatusTone;
  /** Show a small leading dot in the tone color. */
  dot?: boolean;
};

export function StatusPill({ label, tone = 'neutral', dot = false }: StatusPillProps) {
  const theme = useTheme();

  const colors: Record<StatusTone, { bg: string; fg: string }> = {
    success: { bg: theme.primaryTint, fg: theme.primary },
    warning: { bg: theme.amberTint, fg: theme.amber },
    danger: { bg: theme.coralTint, fg: theme.coral },
    neutral: { bg: theme.backgroundElement, fg: theme.textSecondary },
  };
  const { bg, fg } = colors[tone];

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      {dot && <View style={[styles.dot, { backgroundColor: fg }]} />}
      <ThemedText type="smallBold" style={[styles.label, { color: fg }]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs + Spacing.xxs,
    paddingHorizontal: Spacing.md - Spacing.xxs,
    paddingVertical: Spacing.xs + Spacing.xxs,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
  },
});
