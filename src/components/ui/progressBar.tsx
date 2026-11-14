import { StyleSheet, View } from 'react-native';

import type { StatusTone } from '@/components/ui/statusPill';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ProgressBarProps = {
  /** 0–1. Values outside the range are clamped. */
  value: number;
  tone?: StatusTone;
  height?: number;
};

export function ProgressBar({ value, tone = 'success', height = 6 }: ProgressBarProps) {
  const theme = useTheme();
  const clamped = Math.min(1, Math.max(0, value));

  const fill = {
    success: theme.primary,
    warning: theme.amber,
    danger: theme.coral,
    neutral: theme.textTertiary,
  }[tone];

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { height, borderRadius: height, backgroundColor: theme.backgroundElement }]}>
      <View style={[styles.fill, { width: `${clamped * 100}%`, backgroundColor: fill }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
});
