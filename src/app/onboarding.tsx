import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primaryButton';
import { useTheme } from '@/hooks/use-theme';

const slides = [
  {
    title: 'Track what you own, without the spreadsheet',
    body: 'Photograph an item once and storr keeps the receipt, the warranty, and the details together — so you can find any of it in seconds.',
  },
  {
    title: 'Never miss a warranty again',
    body: 'storr reminds you before coverage lapses, so you can claim repairs and replacements while they are still free.',
  },
  {
    title: 'Everything in one place',
    body: 'Receipts, prices, purchase dates and documents for every item you own — organised and searchable.',
  },
];

export default function Onboarding() {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;
  const slide = slides[index];

  const onContinue = () => {
    if (isLast) {
      router.push('/sign-up');
      return;
    }
    setIndex((current) => current + 1);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.top}>
          <Pressable onPress={() => router.push('/sign-in')} hitSlop={8}>
            <ThemedText type="small" themeColor="textSecondary">
              Skip
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={[styles.art, { backgroundColor: theme.accentTint }]} />
          <ThemedText type="subtitle" style={styles.title}>
            {slide.title}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.bodyText}>
            {slide.body}
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {slides.map((item, dotIndex) => (
              <View
                key={item.title}
                style={[
                  styles.dot,
                  { backgroundColor: dotIndex === index ? theme.text : theme.border },
                  dotIndex === index && styles.dotActive,
                ]}
              />
            ))}
          </View>
          <PrimaryButton label={isLast ? 'Get started' : 'Continue'} onPress={onContinue} />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 8,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  art: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  bodyText: {
    lineHeight: 22,
  },
  footer: {
    gap: 22,
    paddingBottom: 12,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 18,
  },
});
