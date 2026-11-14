import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/appButton';
import { Icon, type IconName } from '@/components/ui/icon';
import { Elevation, Layout, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const SLIDES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'camera-outline',
    title: 'Track what you own, without the spreadsheet',
    body: 'Photograph an item once and storr keeps the receipt, the warranty and the details together, so you can find any of it in seconds.',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Never miss a warranty again',
    body: 'storr reminds you before coverage lapses, so you can claim repairs and replacements while they are still free.',
  },
  {
    icon: 'layers-outline',
    title: 'Everything in one place',
    body: 'Receipts, prices, purchase dates and documents for every item you own, organised and searchable.',
  },
];

export default function Onboarding() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const pagerRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const isLast = index === SLIDES.length - 1;

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  const onContinue = () => {
    if (isLast) {
      router.push('/sign-up');
      return;
    }
    pagerRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
  };

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.fill} edges={['top', 'bottom']}>
        <View style={styles.top}>
          <Pressable accessibilityRole="button" onPress={() => router.push('/sign-in')} hitSlop={8}>
            <ThemedText type="link" themeColor="textSecondary">
              Skip
            </ThemedText>
          </Pressable>
        </View>

        <ScrollView
          ref={pagerRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={styles.fill}>
          {SLIDES.map((slide) => (
            <View key={slide.title} style={[styles.slide, { width }]}>
              <View style={styles.slideInner}>
                <LinearGradient
                  colors={[theme.heroStart, theme.heroEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.art, Elevation.hero]}>
                  <View style={[styles.orb, styles.orbA, { backgroundColor: theme.heroOverlay }]} />
                  <View style={[styles.orb, styles.orbB, { backgroundColor: theme.heroOverlay }]} />
                  <View style={[styles.glyph, { backgroundColor: theme.heroOverlay }]}>
                    <Icon name={slide.icon} size={44} color={theme.onPrimary} />
                  </View>
                </LinearGradient>

                <ThemedText type="title" style={styles.title}>
                  {slide.title}
                </ThemedText>
                <ThemedText type="default" themeColor="textSecondary">
                  {slide.body}
                </ThemedText>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {SLIDES.map((slide, dotIndex) => (
              <View
                key={slide.title}
                style={[
                  styles.dot,
                  { backgroundColor: dotIndex === index ? theme.primary : theme.borderStrong },
                  dotIndex === index && styles.dotActive,
                ]}
              />
            ))}
          </View>
          <AppButton
            label={isLast ? 'Get started' : 'Continue'}
            icon={isLast ? 'arrow-forward' : undefined}
            iconPosition="right"
            onPress={onContinue}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/sign-in')}
            hitSlop={8}
            style={styles.signIn}>
            <ThemedText type="small" themeColor="textSecondary">
              Already have an account?{' '}
            </ThemedText>
            <ThemedText type="linkPrimary">Sign in</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.screenPadding,
  },
  slideInner: {
    width: '100%',
    maxWidth: 440,
    gap: Spacing.lg,
  },
  art: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  orb: {
    position: 'absolute',
    borderRadius: Radius.pill,
  },
  orbA: {
    width: 260,
    height: 260,
    top: -110,
    right: -80,
  },
  orbB: {
    width: 180,
    height: 180,
    bottom: -70,
    left: -50,
  },
  glyph: {
    width: 112,
    height: 112,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: Spacing.sm,
  },
  footer: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingBottom: Spacing.md,
    gap: Spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
  },
  dotActive: {
    width: 22,
  },
  signIn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
