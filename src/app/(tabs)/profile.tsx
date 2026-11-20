import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppButton } from '@/components/ui/appButton';
import { Avatar } from '@/components/ui/avatar';
import { Icon, type IconName } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/listRow';
import { Screen } from '@/components/ui/screen';
import { StatusPill } from '@/components/ui/statusPill';
import { Surface } from '@/components/ui/surface';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { displayNameOf, useAuth } from '@/hooks/use-auth';
import { useItem } from '@/hooks/use-item';
import { useTheme } from '@/hooks/use-theme';
import { useThemePreference } from '@/hooks/use-theme-preference';
import { ensureNotificationPermission, syncItemReminders } from '@/utils/notifications';

type Row = {
  label: string;
  icon: IconName;
  value?: string;
  pill?: string;
  onPress?: () => void;
};

type Section = { label: string; rows: Row[] };

const APPEARANCE_LABEL = { light: 'Light', dark: 'Dark', system: 'System' } as const;

export default function Profile() {
  const theme = useTheme();
  const { user, signOut } = useAuth();
  const { item } = useItem();
  const { preference } = useThemePreference();
  const name = displayNameOf(user);

  const covered = item.filter((it) => it.warrantyExpiresAt).length;
  const expiring = item.filter((it) => it.warrantyExpiresAt ?? it.expiryDate).length;
  const stats = [
    { label: 'Items', value: String(item.length) },
    { label: 'Covered', value: String(covered) },
    { label: 'Tracked dates', value: String(expiring) },
  ];

  const sections: Section[] = [
    {
      label: 'Preferences',
      rows: [
        {
          label: 'Notifications',
          icon: 'notifications-outline',
          onPress: async () => {
            const granted = await ensureNotificationPermission();
            if (granted) await syncItemReminders(item);
          },
        },
        {
          label: 'Appearance',
          icon: 'contrast-outline',
          value: APPEARANCE_LABEL[preference],
          onPress: () => router.push('/appearance'),
        },
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
        { label: 'Privacy', icon: 'lock-closed-outline', onPress: () => router.push('/privacy') },
        { label: 'Security', icon: 'shield-outline', onPress: () => router.push('/security') },
        { label: 'About storr', icon: 'information-circle-outline', onPress: () => router.push('/about') },
      ],
    },
  ];

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
        {stats.map((stat) => (
          <Surface key={stat.label} variant="muted" padding="md" radius="md" style={styles.stat}>
            <ThemedText type="heading">{stat.value}</ThemedText>
            <ThemedText type="caption" themeColor="textSecondary">
              {stat.label}
            </ThemedText>
          </Surface>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Upgrade to storr Pro"
        onPress={() => router.push('/subscription')}
        style={({ pressed }) => [styles.pro, pressed && styles.proPressed]}>
        <LinearGradient
          colors={[theme.heroStart, theme.heroEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.proInner}>
          <View style={[styles.proIcon, { backgroundColor: theme.heroOverlay }]}>
            <Icon name="sparkles" size={IconSize.md} color={theme.onPrimary} />
          </View>
          <View style={styles.proText}>
            <ThemedText type="bodyMedium" style={{ color: theme.onPrimary }}>
              Go Pro
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.heroMuted }}>
              Unlimited items, reminders and cloud backup
            </ThemedText>
          </View>
          <Icon name="chevron-forward" size={IconSize.sm} color={theme.onPrimary} />
        </LinearGradient>
      </Pressable>

      {sections.map((section) => (
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
    marginBottom: Spacing.xxl,
  },
  pro: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.xxxl,
  },
  proPressed: {
    opacity: 0.9,
  },
  proInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  proIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proText: {
    flex: 1,
    gap: Spacing.xxs,
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
