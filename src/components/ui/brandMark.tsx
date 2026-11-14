import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { Colors, Radius } from '@/constants/theme';

type BrandMarkProps = {
  size?: number;
};

/**
 * The storr mark: three stacked "shelves" on a brand gradient.
 * Pure shapes — no font or image dependency — so it's safe on the splash before assets load.
 */
export function BrandMark({ size = 64 }: BrandMarkProps) {
  const bar = size * 0.12;
  const gap = size * 0.1;

  return (
    <LinearGradient
      colors={[Colors.light.heroStart, Colors.light.heroEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.box, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <View style={{ gap }}>
        <View style={[styles.bar, { width: size * 0.5, height: bar }]} />
        <View style={[styles.bar, { width: size * 0.36, height: bar }]} />
        <View style={[styles.bar, { width: size * 0.22, height: bar }]} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    backgroundColor: Colors.light.onPrimary,
    borderRadius: Radius.pill,
  },
});
