import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screenHeader';
import { Surface } from '@/components/ui/surface';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const BLOCKS: { title: string; body: string }[] = [
  {
    title: 'What we collect',
    body: 'Only what you add — your account name and email, and the items you track (names, prices, dates, photos and notes). Nothing more.',
  },
  {
    title: 'How we use it',
    body: 'To show your inventory and send the reminders you ask for before a warranty or expiry date lapses. That is the whole job.',
  },
  {
    title: 'Your controls',
    body: 'You can edit or delete any item at any time, and deleting your account removes your data from our systems.',
  },
];

export default function Privacy() {
  const theme = useTheme();

  return (
    <Screen variant="stack">
      <ScreenHeader title="Privacy" />

      <Surface variant="tinted" style={styles.callout}>
        <View style={[styles.calloutIcon, { backgroundColor: theme.card }]}>
          <Icon name="shield-checkmark-outline" size={IconSize.md} color={theme.primary} />
        </View>
        <ThemedText type="bodyMedium" style={styles.calloutText}>
          We never sell your data, and we never show you ads.
        </ThemedText>
      </Surface>

      {BLOCKS.map((block) => (
        <View key={block.title} style={styles.block}>
          <ThemedText type="label" themeColor="textTertiary" style={styles.blockLabel}>
            {block.title}
          </ThemedText>
          <Surface>
            <ThemedText type="small" themeColor="textSecondary">
              {block.body}
            </ThemedText>
          </Surface>
        </View>
      ))}

      <ThemedText type="caption" themeColor="textTertiary" style={styles.footer}>
        Last updated 20 Nov 2026
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  callout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  calloutIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutText: {
    flex: 1,
  },
  block: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  blockLabel: {
    paddingHorizontal: Spacing.xs,
  },
  footer: {
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
