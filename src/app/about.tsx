import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BrandMark } from '@/components/ui/brandMark';
import { Icon, type IconName } from '@/components/ui/icon';
import { ListRow } from '@/components/ui/listRow';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screenHeader';
import { Surface } from '@/components/ui/surface';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const LINKS: { label: string; icon: IconName; value?: string; onPress?: () => void }[] = [
  { label: 'Version', icon: 'cube-outline', value: '1.0.0' },
  { label: 'Privacy policy', icon: 'lock-closed-outline', onPress: () => router.push('/privacy') },
  { label: 'Terms of service', icon: 'document-text-outline' },
  { label: 'Rate storr', icon: 'star-outline' },
  { label: 'Contact support', icon: 'mail-outline' },
];

export default function About() {
  const theme = useTheme();

  return (
    <Screen variant="stack">
      <ScreenHeader title="About" />

      <View style={styles.brand}>
        <BrandMark size={72} />
        <ThemedText type="title">storr</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Version 1.0.0
        </ThemedText>
      </View>

      <Surface style={styles.blurb}>
        <ThemedText type="small" themeColor="textSecondary">
          storr keeps everything you own in one calm place — prices, receipts, warranties and
          expiry dates — and reminds you before anything lapses.
        </ThemedText>
      </Surface>

      <Surface padding="none">
        {LINKS.map((row, index) => (
          <ListRow
            key={row.label}
            title={row.label}
            leading={
              <View style={[styles.icon, { backgroundColor: theme.backgroundElement }]}>
                <Icon name={row.icon} size={IconSize.md} color={theme.textSecondary} />
              </View>
            }
            trailing={
              row.value ? (
                <ThemedText type="small" themeColor="textSecondary">
                  {row.value}
                </ThemedText>
              ) : undefined
            }
            chevron={!row.value}
            onPress={row.onPress}
            isLast={index === LINKS.length - 1}
          />
        ))}
      </Surface>

      <ThemedText type="caption" themeColor="textTertiary" style={styles.footer}>
        Made with care · © 2026 storr
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginVertical: Spacing.xxl,
  },
  blurb: {
    marginBottom: Spacing.xxl,
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
    marginTop: Spacing.xxl,
  },
});
