import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Elevation, IconSize, Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type QuickAction = {
  label: string;
  icon: IconName;
  href: Href;
  /** Badge background and icon colour — colour-codes each action. */
  tint: ThemeColor;
  fg: ThemeColor;
};

const ACTIONS: QuickAction[] = [
  { label: 'Add item', icon: 'add', href: '/onboarding', tint: 'primary', fg: 'onPrimary' },
  { label: 'Scan', icon: 'scan-outline', href: '/add-item', tint: 'primaryTint', fg: 'primary' },
  { label: 'Warranty', icon: 'shield-checkmark', href: '/warranties', tint: 'amberTint', fg: 'amber' },
  { label: 'Activity', icon: 'pulse', href: '/activity', tint: 'coralTint', fg: 'coral' },
];

export default function QuickActions() {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      {ACTIONS.map((action) => (
        <Pressable
          key={action.label}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          onPress={() => router.push(action.href)}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}>
          <View style={[styles.badge, Elevation.soft, { backgroundColor: theme[action.tint] }]}>
            <Icon name={action.icon} size={IconSize.lg} color={theme[action.fg]} />
          </View>
          <ThemedText type="smallBold" themeColor="textSecondary" numberOfLines={1}>
            {action.label}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xxl,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  badge: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: 72,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
});
