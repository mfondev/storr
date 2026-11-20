import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/listRow';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screenHeader';
import { StatusPill } from '@/components/ui/statusPill';
import { Surface } from '@/components/ui/surface';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const ACCOUNT: { label: string; icon: IconName; pill?: string }[] = [
  { label: 'Change password', icon: 'key-outline' },
  { label: 'Two-factor authentication', icon: 'phone-portrait-outline', pill: 'Off' },
  { label: 'Active sessions', icon: 'laptop-outline' },
];

export default function Security() {
  const theme = useTheme();
  const [appLock, setAppLock] = useState(false);

  return (
    <Screen variant="stack">
      <ScreenHeader title="Security" />

      <View style={styles.section}>
        <ThemedText type="label" themeColor="textTertiary" style={styles.sectionLabel}>
          App lock
        </ThemedText>
        <Surface>
          <View style={styles.lockRow}>
            <View style={[styles.icon, { backgroundColor: theme.backgroundElement }]}>
              <Icon name="finger-print-outline" size={IconSize.md} color={theme.textSecondary} />
            </View>
            <View style={styles.lockText}>
              <ThemedText type="bodyMedium">Require Face ID</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Unlock storr with Face ID or your passcode
              </ThemedText>
            </View>
            <Switch
              value={appLock}
              onValueChange={setAppLock}
              trackColor={{ true: theme.primary, false: theme.borderStrong }}
            />
          </View>
        </Surface>
      </View>

      <View style={styles.section}>
        <ThemedText type="label" themeColor="textTertiary" style={styles.sectionLabel}>
          Account
        </ThemedText>
        <Surface padding="none">
          {ACCOUNT.map((row, index) => (
            <ListRow
              key={row.label}
              title={row.label}
              leading={
                <View style={[styles.icon, { backgroundColor: theme.backgroundElement }]}>
                  <Icon name={row.icon} size={IconSize.md} color={theme.textSecondary} />
                </View>
              }
              trailing={row.pill ? <StatusPill label={row.pill} tone="neutral" /> : undefined}
              chevron
              isLast={index === ACCOUNT.length - 1}
            />
          ))}
        </Surface>
      </View>

      <ThemedText type="caption" themeColor="textTertiary" style={styles.footer}>
        Your password is stored encrypted and never shared.
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    paddingHorizontal: Spacing.xs,
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  lockText: {
    flex: 1,
    gap: Spacing.xxs,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
