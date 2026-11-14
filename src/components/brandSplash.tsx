import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';

import { BrandMark } from '@/components/ui/brandMark';
import { Colors } from '@/constants/theme';

type BrandSplashProps = {
  /** True once fonts (and anything else the first frame needs) are loaded. */
  isReady: boolean;
};

/**
 * Covers the app until it is ready, then hands off from the native splash and fades out.
 * Mounted from the first render so it is laid out before the native splash hides.
 */
export function BrandSplash({ isReady }: BrandSplashProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isReady) return;
    SplashScreen.hideAsync().finally(() => setIsVisible(false));
  }, [isReady]);

  if (!isVisible) return null;

  return (
    <Animated.View exiting={FadeOut.duration(350)} style={styles.overlay}>
      <BrandMark size={88} />
    </Animated.View>
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
