import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppButton } from '@/components/ui/appButton';
import { Icon, type IconName } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screenHeader';
import { StatusPill } from '@/components/ui/statusPill';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Plan = 'monthly' | 'yearly';

const PLANS: {
  id: Plan;
  name: string;
  price: string;
  cadence: string;
  note?: string;
  badge?: string;
}[] = [
  { id: 'yearly', name: 'Yearly', price: '$39.99', cadence: 'per year', note: '$3.33 / month', badge: 'Save 33%' },
  { id: 'monthly', name: 'Monthly', price: '$4.99', cadence: 'per month' },
];

const FEATURES: { icon: IconName; text: string }[] = [
  { icon: 'infinite-outline', text: 'Track unlimited items' },
  { icon: 'notifications-outline', text: 'Smart warranty & expiry reminders' },
  { icon: 'cloud-outline', text: 'Cloud backup & sync across devices' },
  { icon: 'scan-outline', text: 'Receipt & barcode scanning' },
  { icon: 'download-outline', text: 'Export your full inventory' },
  { icon: 'heart-outline', text: 'Priority support' },
];

export default function Subscription() {
  const theme = useTheme();
  const [plan, setPlan] = useState<Plan>('yearly');

  return (
    <Screen
      variant="stack"
      footer={
        <View style={styles.footer}>
          <AppButton
            label="Start 7-day free trial"
            icon="sparkles"
            onPress={() => {
              // UI only for now — billing is wired up later.
            }}
          />
          <ThemedText type="caption" themeColor="textTertiary" style={styles.fine}>
            {plan === 'yearly' ? '$39.99/year after trial' : '$4.99/month after trial'} · Cancel anytime
          </ThemedText>
        </View>
      }>
      <ScreenHeader title="storr Pro" />

      <LinearGradient
        colors={[theme.heroStart, theme.heroEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <View style={[styles.heroIcon, { backgroundColor: theme.heroOverlay }]}>
          <Icon name="sparkles" size={IconSize.xl} color={theme.onPrimary} />
        </View>
        <ThemedText type="title" style={{ color: theme.onPrimary }}>
          Unlock everything
        </ThemedText>
        <ThemedText type="small" style={[styles.heroSub, { color: theme.heroMuted }]}>
          Go Pro for unlimited items, reminders and backup — so nothing you own ever slips through.
        </ThemedText>
      </LinearGradient>

      <View style={styles.features}>
        {FEATURES.map((feature) => (
          <View key={feature.text} style={styles.feature}>
            <View style={[styles.featureIcon, { backgroundColor: theme.primaryTint }]}>
              <Icon name={feature.icon} size={IconSize.sm} color={theme.primary} />
            </View>
            <ThemedText type="small" style={styles.featureText}>
              {feature.text}
            </ThemedText>
          </View>
        ))}
      </View>

      <View style={styles.plans}>
        {PLANS.map((entry) => {
          const selected = plan === entry.id;
          return (
            <Pressable
              key={entry.id}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setPlan(entry.id)}
              style={[
                styles.plan,
                {
                  backgroundColor: theme.card,
                  borderColor: selected ? theme.primary : theme.border,
                },
                selected && { borderWidth: 2 },
              ]}>
              <View
                style={[
                  styles.radio,
                  { borderColor: selected ? theme.primary : theme.borderStrong },
                ]}>
                {selected && <View style={[styles.radioDot, { backgroundColor: theme.primary }]} />}
              </View>
              <View style={styles.planText}>
                <View style={styles.planTop}>
                  <ThemedText type="bodyMedium">{entry.name}</ThemedText>
                  {entry.badge && <StatusPill label={entry.badge} tone="success" />}
                </View>
                {entry.note && (
                  <ThemedText type="caption" themeColor="textSecondary">
                    {entry.note}
                  </ThemedText>
                )}
              </View>
              <View style={styles.planPrice}>
                <ThemedText type="bodyMedium">{entry.price}</ThemedText>
                <ThemedText type="caption" themeColor="textTertiary">
                  {entry.cadence}
                </ThemedText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.xxl,
    borderRadius: Radius.xl,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  heroSub: {
    textAlign: 'center',
  },
  features: {
    gap: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  plans: {
    gap: Spacing.md,
  },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    borderWidth: 1,
    borderRadius: Radius.lg,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.pill,
  },
  planText: {
    flex: 1,
    gap: Spacing.xxs,
  },
  planTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  planPrice: {
    alignItems: 'flex-end',
  },
  footer: {
    gap: Spacing.sm,
  },
  fine: {
    textAlign: 'center',
  },
});
