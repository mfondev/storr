import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { sampleTotals } from '@/constants/sampleData';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AttentionBanner() {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push('/warranties')}
      style={({ pressed }) => [
        styles.banner,
        { backgroundColor: theme.amberTint },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.card }]}>
        <Icon name="warning-outline" size={IconSize.md} color={theme.amber} />
      </View>
      <View style={styles.text}>
        <ThemedText type="bodyMedium" style={{ color: theme.amber }}>
          {sampleTotals.expiringSoon} warranties expiring soon
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Review them before coverage ends
        </ThemedText>
      </View>
      <Icon name="chevron-forward" size={IconSize.sm} color={theme.amber} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    paddingRight: Spacing.lg,
    borderRadius: Radius.lg,
    marginTop: Spacing.xxl,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: Spacing.xxs,
  },
  pressed: {
    opacity: 0.85,
  },
});
