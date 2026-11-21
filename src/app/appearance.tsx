import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screenHeader';
import { Surface } from '@/components/ui/surface';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useThemePreference, type ThemePreference } from '@/hooks/use-theme-preference';

const OPTIONS: { id: ThemePreference; label: string; detail: string; icon: IconName }[] = [
  { id: 'light', label: 'Light', detail: 'Always use the light theme', icon: 'sunny-outline' },
  { id: 'dark', label: 'Dark', detail: 'Always use the dark theme', icon: 'moon-outline' },
  { id: 'system', label: 'System', detail: 'Match your device setting', icon: 'phone-portrait-outline' },
];

export default function Appearance() {
  const theme = useTheme();
  const { preference, setPreference } = useThemePreference();

  return (
    <Screen variant="stack">
      <ScreenHeader title="Appearance" />

      <ThemedText type="small" themeColor="textSecondary" style={styles.intro}>
        Choose how storr looks. Pick a theme, or let it follow your device.
      </ThemedText>

      <Surface padding="none">
        {OPTIONS.map((option, index) => {
          const selected = preference === option.id;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setPreference(option.id)}
              style={({ pressed }) => [
                styles.row,
                index < OPTIONS.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: theme.border,
                },
                pressed && { backgroundColor: theme.backgroundElement },
              ]}>
              <View style={[styles.icon, { backgroundColor: theme.backgroundElement }]}>
                <Icon name={option.icon} size={IconSize.md} color={theme.textSecondary} />
              </View>
              <View style={styles.text}>
                <ThemedText type="bodyMedium">{option.label}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {option.detail}
                </ThemedText>
              </View>
              {selected && (
                <Icon name="checkmark-circle" size={IconSize.lg} color={theme.primary} />
              )}
            </Pressable>
          );
        })}
      </Surface>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: Spacing.xxs,
  },
});
