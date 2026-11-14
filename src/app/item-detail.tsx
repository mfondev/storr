import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Fragment } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/appButton';
import { CategoryIcon } from '@/components/ui/categoryIcon';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/iconButton';
import { ListRow } from '@/components/ui/listRow';
import { ProgressBar } from '@/components/ui/progressBar';
import { StatusPill } from '@/components/ui/statusPill';
import { Surface } from '@/components/ui/surface';
import { hasWarranty, sampleItems } from '@/constants/sampleData';
import { Elevation, IconSize, Layout, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const ITEM = sampleItems.find(hasWarranty) ?? null;

const FACTS: { label: string; value: string; icon: IconName }[] = [
  { label: 'Purchased', value: 'Mar 14, 2025', icon: 'calendar-outline' },
  { label: 'Price', value: '$2,399', icon: 'cash-outline' },
  { label: 'Store', value: 'Apple Store', icon: 'storefront-outline' },
  { label: 'Location', value: 'Home office', icon: 'location-outline' },
];

const DOCUMENTS = [
  { name: 'Receipt.pdf', size: '240 KB' },
  { name: 'AppleCare terms.pdf', size: '1.1 MB' },
];

export default function ItemDetail() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  if (!ITEM) return null;
  const { warranty } = ITEM;
  const remaining = warranty.totalDays > 0 ? warranty.daysLeft / warranty.totalDays : 0;

  return (
    <ThemedView style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xxl }}>
        <LinearGradient
          colors={[theme.heroStart, theme.heroEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + Spacing.sm }]}>
          <View style={[styles.orb, styles.orbA, { backgroundColor: theme.heroOverlay }]} />
          <View style={[styles.orb, styles.orbB, { backgroundColor: theme.heroOverlay }]} />
          <View style={styles.heroBar}>
            <IconButton icon="chevron-back" accessibilityLabel="Go back" variant="onHero" onPress={() => router.back()} />
            <IconButton icon="share-outline" accessibilityLabel="Share item" variant="onHero" />
          </View>
          <View style={[styles.heroArt, { backgroundColor: theme.heroOverlay }]}>
            <Icon name={ITEM.icon} size={56} color={theme.onPrimary} />
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.titleBlock}>
            <View style={styles.titleText}>
              <ThemedText type="title">{ITEM.name}</ThemedText>
              <View style={styles.meta}>
                <CategoryIcon category={ITEM.category} size={22} />
                <ThemedText type="small" themeColor="textSecondary">
                  {ITEM.category} · {ITEM.addedLabel.toLowerCase()}
                </ThemedText>
              </View>
            </View>
            <ThemedText type="subtitle">{ITEM.price}</ThemedText>
          </View>

          <Surface padding="none" style={styles.facts}>
            <View style={styles.factsGrid}>
              {FACTS.map((fact, index) => (
                <Fragment key={fact.label}>
                  <View
                    style={[
                      styles.fact,
                      index % 2 === 0 && { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: theme.border },
                      index < 2 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.border },
                    ]}>
                    <Icon name={fact.icon} size={IconSize.sm} color={theme.textTertiary} />
                    <ThemedText type="caption" themeColor="textSecondary">
                      {fact.label}
                    </ThemedText>
                    <ThemedText type="bodyMedium">{fact.value}</ThemedText>
                  </View>
                </Fragment>
              ))}
            </View>
          </Surface>

          <Surface variant="tinted" style={styles.coverage}>
            <View style={styles.coverageTop}>
              <View style={[styles.coverageIcon, { backgroundColor: theme.card }]}>
                <Icon name="shield-checkmark-outline" size={IconSize.md} color={theme.primary} />
              </View>
              <View style={styles.coverageText}>
                <ThemedText type="bodyMedium">{warranty.plan}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {warranty.daysLeft} days of coverage left
                </ThemedText>
              </View>
              <StatusPill label="Active" tone="success" dot />
            </View>
            <ProgressBar value={remaining} tone={warranty.tone} />
          </Surface>

          <View style={styles.section}>
            <ThemedText type="label" themeColor="textTertiary" style={styles.sectionLabel}>
              Documents
            </ThemedText>
            <Surface padding="none">
              {DOCUMENTS.map((doc, index) => (
                <ListRow
                  key={doc.name}
                  title={doc.name}
                  subtitle={doc.size}
                  leading={
                    <View style={[styles.docIcon, { backgroundColor: theme.backgroundElement }]}>
                      <Icon name="document-text-outline" size={IconSize.md} color={theme.textSecondary} />
                    </View>
                  }
                  chevron
                  isLast={index === DOCUMENTS.length - 1}
                />
              ))}
            </Surface>
          </View>

          <View style={styles.actions}>
            <AppButton label="Edit" icon="create-outline" variant="secondary" style={styles.action} />
            <AppButton label="Set reminder" icon="alarm-outline" style={styles.action} />
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    paddingBottom: Spacing.xxxl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    overflow: 'hidden',
    ...Elevation.hero,
  },
  heroBar: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing.xl,
  },
  heroArt: {
    width: 128,
    height: 128,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    position: 'absolute',
    borderRadius: Radius.pill,
  },
  orbA: {
    width: 260,
    height: 260,
    top: -120,
    right: -90,
  },
  orbB: {
    width: 160,
    height: 160,
    bottom: -70,
    left: -40,
  },
  content: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.xxl,
    gap: Spacing.xl,
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.lg,
  },
  titleText: {
    flex: 1,
    gap: Spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  facts: {
    marginTop: Spacing.xs,
  },
  factsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fact: {
    width: '50%',
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  coverage: {
    gap: Spacing.lg,
  },
  coverageTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  coverageIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverageText: {
    flex: 1,
    gap: Spacing.xxs,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionLabel: {
    paddingHorizontal: Spacing.xs,
  },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  action: {
    flex: 1,
  },
});
