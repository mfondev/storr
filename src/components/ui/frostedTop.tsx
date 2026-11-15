import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

import { Mask } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type FrostedTopProps = {
  /** Height of the frosted band — normally the top safe-area inset. */
  inset: number;
  blurTarget: ComponentProps<typeof BlurView>['blurTarget'];
};

/**
 * Portion of the inset that stays fully frosted. The remainder fades to clear by the
 * inset's bottom edge, which sits at about the base of the Dynamic Island.
 */
const SOLID_PORTION = 0.6;

/**
 * A progressive blur over the status bar: frost behind the system chrome that
 * dissolves into the content, so scrolling never meets a hard edge.
 * Renders nothing when there is no inset (web, or a screen without a status bar).
 */
export function FrostedTop({ inset, blurTarget }: FrostedTopProps) {
  const isDark = useColorScheme() === 'dark';
  if (inset <= 0) return null;

  return (
    <MaskedView
      pointerEvents="none"
      style={[styles.container, { height: inset }]}
      maskElement={
        // The mask's alpha decides how much blur shows: solid, then a fade to clear.
        <LinearGradient
          colors={[Mask.opaque, Mask.opaque, Mask.transparent]}
          locations={[0, SOLID_PORTION, 1]}
          style={StyleSheet.absoluteFill}
        />
      }>
      <BlurView
        intensity={20}
        tint={isDark ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterialLight'}
        blurMethod="dimezisBlurViewSdk31Plus"
        blurTarget={blurTarget}
        style={StyleSheet.absoluteFill}
      />
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
