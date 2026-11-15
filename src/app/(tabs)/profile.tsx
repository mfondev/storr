import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppButton } from '@/components/ui/appButton';
import { Avatar } from '@/components/ui/avatar';
import { Icon, type IconName } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/listRow';
import { Screen } from '@/components/ui/screen';
import { StatusPill } from '@/components/ui/statusPill';
import { Surface } from '@/components/ui/surface';
import { sampleTotals } from '@/constants/sampleData';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { displayNameOf, useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';

type Row = {
  label: string;
  icon: IconName;
  value?: string;
  pill?: string;
  onPress?: () => void;
};

type Section = { label: string; rows: Row[] };

const SECTIONS: Section[] = [
  {
    label: 'Preferences',
    rows: [
      { label: 'Notifications', icon: 'notifications-outline', value: 'On' },
      { label: 'Appearance', icon: 'moon-outline', value: 'System' },
      { label: 'Currency', icon: 'cash-outline', value: 'USD' },
      { label: 'Categories', icon: 'pricetags-outline' },
    ],
  },
  {
    label: 'Data',
    rows: [
      { label: 'Storage', icon: 'server-outline', value: '0 GB used' },
      { label: 'Backup & sync', icon: 'cloud-outline' },
    ],
  },
  {
    label: 'Account',
    rows: [
      { label: 'Privacy', icon: 'lock-closed-outline' },
      { label: 'Security', icon: 'shield-outline' },
      { label: 'Replay onboarding', icon: 'sparkles-outline', onPress: () => router.push('/onboarding') },
      { label: 'About storr', icon: 'information-circle-outline' },
    ],
  },
];

const STATS = [
  { label: 'Items', value: String(sampleTotals.items) },
  { label: 'Value', value: sampleTotals.value },
  { label: 'Covered', value: String(sampleTotals.covered) },
];

export default function Profile() {
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const name = displayNameOf(user);

  return (
    <Screen variant="tab">
      <View style={styles.identity}>
        <Avatar name={name || '?'} size={76} />
        <View style={styles.identityText}>
          <ThemedText type="subtitle">{name || 'Your account'}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {user?.email ?? ''}
          </ThemedText>
        </View>
      </View>

      <View style={styles.stats}>
        {STATS.map((stat) => (
          <Surface key={stat.label} variant="muted" padding="md" radius="md" style={styles.stat}>
            <ThemedText type="heading">{stat.value}</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              {stat.label}
            </ThemedText>
          </Surface>
        ))}
      </View>

      {SECTIONS.map((section) => (
        <View key={section.label} style={styles.section}>
          <ThemedText type="label" themeColor="textTertiary" style={styles.sectionLabel}>
            {section.label}
          </ThemedText>
          <Surface padding="none">
            {section.rows.map((row, index) => (
              <ListRow
                key={row.label}
                title={row.label}
                leading={
                  <View style={[styles.rowIcon, { backgroundColor: theme.backgroundElement }]}>
                    <Icon name={row.icon} size={IconSize.md} color={theme.textSecondary} />
                  </View>
                }
                trailing={
                  row.pill ? (
                    <StatusPill label={row.pill} tone="success" dot />
                  ) : row.value ? (
                    <ThemedText type="small" themeColor="textSecondary">
                      {row.value}
                    </ThemedText>
                  ) : undefined
                }
                chevron
                onPress={row.onPress}
                isLast={index === section.rows.length - 1}
              />
            ))}
          </Surface>
        </View>
      ))}

      <AppButton
        label="Sign out"
        icon="log-out-outline"
        variant="destructive"
        onPress={signOut}
        style={styles.signOut}
      />
      <ThemedText type="caption" themeColor="textTertiary" style={styles.version}>
        storr 1.0.0
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  identityText: {
    flex: 1,
    gap: Spacing.xxs,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xxxl,
  },
  stat: {
    flex: 1,
    gap: Spacing.xxs,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionLabel: {
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOut: {
    marginTop: Spacing.sm,
  },
  version: {
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
