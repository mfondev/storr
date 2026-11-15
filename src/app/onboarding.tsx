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
import { IconSize, Layout, Radius, Spacing, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Slide = {
  icon: IconName;
  eyebrow: string;
  title: string;
  body: string;
  tint: ThemeColor;
  fg: ThemeColor;
};

const SLIDES: Slide[] = [
  {
    icon: 'sparkles',
    eyebrow: 'Welcome to storr',
    title: 'Track what you own.',
    body: 'Snap an item once — storr keeps the receipt, warranty and details together, ready in seconds.',
    tint: 'primaryTint',
    fg: 'primary',
  },
  {
    icon: 'shield-checkmark',
    eyebrow: 'Stay covered',
    title: 'Never miss a warranty.',
    body: 'Get a nudge before coverage lapses, so repairs and replacements stay free.',
    tint: 'amberTint',
    fg: 'amber',
  },
  {
    icon: 'albums',
    eyebrow: 'All in one place',
    title: 'Everything, organised.',
    body: 'Receipts, prices, dates and documents for every item — searchable and always to hand.',
    tint: 'coralTint',
    fg: 'coral',
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
                <View style={[styles.chip, { backgroundColor: theme[slide.tint] }]}>
                  <Icon name={slide.icon} size={IconSize.xl} color={theme[slide.fg]} />
                </View>
                <ThemedText type="label" style={{ color: theme[slide.fg] }}>
                  {slide.eyebrow}
                </ThemedText>
                <ThemedText type="hero">{slide.title}</ThemedText>
                <ThemedText type="subtitle" themeColor="textSecondary" style={styles.body}>
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
            icon="arrow-forward"
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
    justifyContent: 'center',
    paddingHorizontal: Layout.screenPadding,
  },
  slideInner: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    gap: Spacing.md,
  },
  chip: {
    width: 72,
    height: 72,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  body: {
    marginTop: Spacing.xs,
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
