import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Elevation, IconSize, Layout, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type HomeCardsProps = {
  items: number;
  covered: number;
  expiring: number;
};

const GAP = Spacing.md;

export default function HomeCards({ items, covered, expiring }: HomeCardsProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const pagerRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const cardWidth = Math.min(width, Layout.maxContentWidth) - Layout.screenPadding * 2;
  const cardHeight = Math.round(cardWidth / 1.9);

  const cards: {
    key: string;
    label: string;
    value: string;
    caption: string;
    icon: IconName;
    colors: readonly [string, string];
  }[] = [
    {
      key: 'items',
      label: 'Items tracked',
      value: String(items),
      caption: items === 1 ? '1 item in your storr' : `${items} items in your storr`,
      icon: 'cube-outline',
      colors: [theme.heroStart, theme.heroEnd],
    },
    {
      key: 'covered',
      label: 'Under warranty',
      value: String(covered),
      caption: 'items with active coverage',
      icon: 'shield-checkmark-outline',
      colors: [theme.primary, theme.primaryStrong],
    },
    {
      key: 'expiring',
      label: 'Expiring soon',
      value: String(expiring),
      caption: 'within the next 30 days',
      icon: 'alarm-outline',
      colors: [theme.amber, theme.coral],
    },
  ];

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / (cardWidth + GAP)));
  };

  return (
    <View>
      <ScrollView
        ref={pagerRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + GAP}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={onScrollEnd}
        style={styles.bleed}
        contentContainerStyle={styles.track}>
        {cards.map((card) => (
          <LinearGradient
            key={card.key}
            colors={card.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, { width: cardWidth, height: cardHeight }, Elevation.hero]}>
            <View style={[styles.orb, { backgroundColor: theme.heroOverlay }]} />
            <View style={styles.cardTop}>
              <ThemedText type="label" style={[styles.brand, { color: theme.onPrimary }]}>
                STORR
              </ThemedText>
              <Icon name={card.icon} size={IconSize.md} color={theme.onPrimary} />
            </View>

            <View style={[styles.chip, { backgroundColor: theme.heroOverlay }]} />

            <View style={styles.cardBottom}>
              <ThemedText type="display" style={{ color: theme.onPrimary }}>
                {card.value}
              </ThemedText>
              <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
                {card.label}
              </ThemedText>
              <ThemedText type="caption" style={{ color: theme.heroMuted }}>
                {card.caption}
              </ThemedText>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {cards.map((card, dotIndex) => (
          <View
            key={card.key}
            style={[
              styles.dot,
              { backgroundColor: dotIndex === index ? theme.primary : theme.borderStrong },
              dotIndex === index && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bleed: {
    marginHorizontal: -Layout.screenPadding,
  },
  track: {
    paddingHorizontal: Layout.screenPadding,
    gap: GAP,
  },
  card: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    padding: Spacing.xl,
    justifyContent: 'space-between',
  },
  orb: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: Radius.pill,
    top: -80,
    right: -60,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    letterSpacing: 2,
  },
  chip: {
    width: 42,
    height: 30,
    borderRadius: Radius.sm,
  },
  cardBottom: {
    gap: Spacing.xxs,
  },
  dots: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
  },
  dotActive: {
    width: 20,
  },
});
