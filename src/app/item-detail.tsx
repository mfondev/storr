import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Fragment } from 'react';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/appButton';
import { glyphForCategory } from '@/components/ui/categoryIcon';
import { EmptyState } from '@/components/ui/emptyState';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/iconButton';
import { ProgressBar } from '@/components/ui/progressBar';
import { StatusPill, type StatusTone } from '@/components/ui/statusPill';
import { Surface } from '@/components/ui/surface';
import { Elevation, IconSize, Layout, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useItem } from '@/hooks/use-item';
import {
  formatCategory,
  formatDate,
  formatPrice,
  formatRelativeDate,
} from '@/utils/format';
import type { Item } from '@/utils/types';

const DAY_MS = 86_400_000;

// Warranty coverage math — kept out of render so the "now" lookup isn't impure.
function coverageFor(detail: Item) {
  const now = Date.now();
  const warrantyAt = detail.warrantyExpiresAt ? new Date(detail.warrantyExpiresAt) : null;
  const purchaseAt = detail.purchaseDate ? new Date(detail.purchaseDate) : null;
  const daysLeft = warrantyAt ? Math.round((warrantyAt.getTime() - now) / DAY_MS) : null;
  const remaining =
    warrantyAt && purchaseAt && warrantyAt.getTime() > purchaseAt.getTime()
      ? Math.min(
          1,
          Math.max(0, (warrantyAt.getTime() - now) / (warrantyAt.getTime() - purchaseAt.getTime())),
        )
      : 0;
  const tone: StatusTone =
    daysLeft === null ? 'neutral' : daysLeft <= 0 ? 'danger' : daysLeft <= 30 ? 'warning' : 'success';
  return { warrantyAt, daysLeft, remaining, tone };
}

export default function ItemDetail() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { item } = useItem();

  const detail = item.find((entry) => entry.id === id) ?? null;

  if (!detail) {
    return (
      <ThemedView style={styles.root}>
        <View style={{ paddingTop: insets.top + Spacing.xxl }}>
          <EmptyState
            icon="help-circle-outline"
            title="Item not found"
            body="This item may have been removed."
            actionLabel="Back to inventory"
            onAction={() => router.back()}
          />
        </View>
      </ThemedView>
    );
  }

  // Warranty coverage, derived from purchase + warranty dates.
  const { warrantyAt, daysLeft, remaining, tone: coverageTone } = coverageFor(detail);

  const facts: { label: string; value: string; icon: IconName }[] = [
    { label: 'Purchased', value: formatDate(detail.purchaseDate) || '—', icon: 'calendar-outline' },
    { label: 'Price', value: formatPrice(detail.priceCents, detail.currency), icon: 'cash-outline' },
    { label: 'Store', value: detail.store || '—', icon: 'storefront-outline' },
    { label: 'Quantity', value: String(detail.quantity ?? 1), icon: 'layers-outline' },
  ];

  const details: { label: string; value: string }[] = [
    { label: 'Brand', value: detail.brand || '—' },
    { label: 'Serial number', value: detail.serialNumber || '—' },
    { label: 'Barcode', value: detail.barcode || '—' },
    { label: 'Reminder', value: `${detail.remindDaysBefore} days before` },
  ];

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
            <IconButton
              icon="share-outline"
              accessibilityLabel="Share item"
              variant="onHero"
              onPress={() =>
                Share.share({
                  message: `${detail.name}${detail.brand ? ` · ${detail.brand}` : ''} — tracked in storr`,
                })
              }
            />
          </View>
          <View style={[styles.heroArt, { backgroundColor: theme.heroOverlay }]}>
            <Icon name={glyphForCategory(detail.category)} size={56} color={theme.onPrimary} />
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.titleBlock}>
            <View style={styles.titleText}>
              <ThemedText type="title">{detail.name}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {formatCategory(detail.category)}
                {detail.brand ? ` · ${detail.brand}` : ''}
              </ThemedText>
            </View>
            <ThemedText type="subtitle">{formatPrice(detail.priceCents, detail.currency)}</ThemedText>
          </View>

          <Surface padding="none" style={styles.facts}>
            <View style={styles.factsGrid}>
              {facts.map((fact, index) => (
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

          {warrantyAt && (
            <Surface variant="tinted" style={styles.coverage}>
              <View style={styles.coverageTop}>
                <View style={[styles.coverageIcon, { backgroundColor: theme.card }]}>
                  <Icon name="shield-checkmark-outline" size={IconSize.md} color={theme.primary} />
                </View>
                <View style={styles.coverageText}>
                  <ThemedText type="bodyMedium">Warranty</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {daysLeft !== null && daysLeft > 0
                      ? `${daysLeft} days of coverage left`
                      : 'Coverage has ended'}
                  </ThemedText>
                </View>
                <StatusPill label={formatRelativeDate(detail.warrantyExpiresAt)} tone={coverageTone} dot />
              </View>
              <ProgressBar value={remaining} tone={coverageTone} />
            </Surface>
          )}

          {detail.expiryDate && (
            <Surface variant="tinted" style={styles.coverage}>
              <View style={styles.coverageTop}>
                <View style={[styles.coverageIcon, { backgroundColor: theme.card }]}>
                  <Icon name="time-outline" size={IconSize.md} color={theme.coral} />
                </View>
                <View style={styles.coverageText}>
                  <ThemedText type="bodyMedium">Expires</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {formatDate(detail.expiryDate)}
                  </ThemedText>
                </View>
                <StatusPill label={formatRelativeDate(detail.expiryDate)} tone="warning" dot />
              </View>
            </Surface>
          )}

          <View style={styles.section}>
            <ThemedText type="label" themeColor="textTertiary" style={styles.sectionLabel}>
              Details
            </ThemedText>
            <Surface padding="none">
              {details.map((row, index) => (
                <View
                  key={row.label}
                  style={[
                    styles.detailRow,
                    index < details.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: theme.border,
                    },
                  ]}>
                  <ThemedText type="small" themeColor="textSecondary">
                    {row.label}
                  </ThemedText>
                  <ThemedText type="small" numberOfLines={1} style={styles.detailValue}>
                    {row.value}
                  </ThemedText>
                </View>
              ))}
            </Surface>
          </View>

          {detail.notes ? (
            <View style={styles.section}>
              <ThemedText type="label" themeColor="textTertiary" style={styles.sectionLabel}>
                Notes
              </ThemedText>
              <Surface>
                <ThemedText type="small" themeColor="textSecondary">
                  {detail.notes}
                </ThemedText>
              </Surface>
            </View>
          ) : null}

          <View style={styles.actions}>
            <AppButton
              label="Edit"
              icon="create-outline"
              variant="secondary"
              style={styles.action}
              onPress={() => router.push({ pathname: '/add-item', params: { id: detail.id } })}
            />
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  detailValue: {
    flexShrink: 1,
    textAlign: 'right',
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
