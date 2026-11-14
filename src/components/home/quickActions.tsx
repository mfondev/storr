import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const ACTIONS: { label: string; icon: IconName; href: Href; isPrimary?: boolean }[] = [
  { label: 'Add item', icon: 'add', href: '/add-item', isPrimary: true },
  { label: 'Scan', icon: 'scan-outline', href: '/add-item' },
  { label: 'Warranties', icon: 'shield-checkmark-outline', href: '/warranties' },
  { label: 'Activity', icon: 'time-outline', href: '/activity' },
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
          <View
            style={[
              styles.tile,
              { backgroundColor: action.isPrimary ? theme.primary : theme.card, borderColor: theme.border },
              !action.isPrimary && styles.tileBordered,
            ]}>
            <Icon
              name={action.icon}
              size={IconSize.lg}
              color={action.isPrimary ? theme.onPrimary : theme.primary}
            />
          </View>
          <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
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
    gap: Spacing.sm,
    marginTop: Spacing.xxl,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  tile: {
    width: '100%',
    aspectRatio: 1.35,
    maxHeight: 64,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileBordered: {
    borderWidth: 1,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});
