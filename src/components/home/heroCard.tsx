import { LinearGradient } from 'expo-linear-gradient';
import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { sampleTotals } from '@/constants/sampleData';
import { Elevation, IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const STATS = [
  { label: 'Items', value: String(sampleTotals.items) },
  { label: 'Covered', value: String(sampleTotals.covered) },
  { label: 'Expiring', value: String(sampleTotals.expiringSoon) },
];

export default function HeroCard() {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[theme.heroStart, theme.heroEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, Elevation.hero]}>
      <View style={[styles.orb, styles.orbLarge, { backgroundColor: theme.heroOverlay }]} />
      <View style={[styles.orb, styles.orbSmall, { backgroundColor: theme.heroOverlay }]} />

      <View style={styles.top}>
        <ThemedText type="label" style={{ color: theme.heroMuted }}>
          Total value
        </ThemedText>
        <View style={[styles.trend, { backgroundColor: theme.heroOverlay }]}>
          <Icon name="trending-up-outline" size={IconSize.sm} color={theme.onPrimary} />
          <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
            +4.2% this month
          </ThemedText>
        </View>
      </View>

      <ThemedText type="display" style={{ color: theme.onPrimary }}>
        {sampleTotals.value}
      </ThemedText>

      <View style={styles.stats}>
        {STATS.map((stat, index) => (
          <Fragment key={stat.label}>
            {index > 0 && <View style={[styles.divider, { backgroundColor: theme.heroOverlay }]} />}
            <View style={styles.stat}>
              <ThemedText type="heading" style={{ color: theme.onPrimary }}>
                {stat.value}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.heroMuted }}>
                {stat.label}
              </ThemedText>
            </View>
          </Fragment>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    gap: Spacing.lg,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: Radius.pill,
  },
  orbLarge: {
    width: 220,
    height: 220,
    top: -90,
    right: -60,
  },
  orbSmall: {
    width: 120,
    height: 120,
    bottom: -50,
    left: -30,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm + Spacing.xxs,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  stat: {
    flex: 1,
    gap: Spacing.xxs,
  },
  divider: {
    width: 1,
    height: 32,
    marginHorizontal: Spacing.lg,
  },
});
