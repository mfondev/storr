import { StyleSheet, View } from 'react-native';

import { BrandMark } from '@/components/ui/brandMark';
import { Colors } from '@/constants/theme';

type BrandSplashProps = {
  /** True once fonts (and anything else the first frame needs) are loaded. */
  isReady: boolean;
};

/** Web has no native splash: show the brand until fonts are in, then get out of the way. */
export function BrandSplash({ isReady }: BrandSplashProps) {
  if (isReady) return null;

  return (
    <View style={styles.overlay}>
      <BrandMark size={88} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.light.heroEnd,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});
