import MaskedView from '@react-native-masked-view/masked-view';
import { BlurTargetView, BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState, type ComponentRef, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { FrostedTop } from '@/components/ui/frostedTop';
import { Layout, Mask, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ScreenVariant = 'tab' | 'stack' | 'modal';

type ScreenProps = {
  children: ReactNode;
  variant?: ScreenVariant;
  footer?: ReactNode;
  avoidKeyboard?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * Tab and stack screens scroll under the status bar behind a frosted blur, so the
 * top inset is applied as content padding rather than reserved by the safe area.
 * A modal sheet has no status bar, so it keeps a plain top.
 */
const EDGES: Record<ScreenVariant, Edge[]> = {
  tab: ['left', 'right'],
  stack: ['bottom', 'left', 'right'],
  modal: ['bottom', 'left', 'right'],
};

/** Portion of the footer that stays fully frosted; the rest fades to clear upward. */
const FOOTER_SOLID = 0.5;

/**
 * The page shell every screen uses: themed background, safe areas, a centered
 * max-width column (so tablet/web don't stretch), and the right bottom inset.
 */
export function Screen({
  children,
  variant = 'stack',
  footer,
  avoidKeyboard = false,
  contentStyle,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === 'dark';
  const blurTargetRef = useRef<ComponentRef<typeof BlurTargetView>>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  const hasFrostedTop = variant !== 'modal';
  const paddingTop = hasFrostedTop ? insets.top + Spacing.md : Spacing.xl;
  const basePaddingBottom = variant === 'tab' ? Layout.tabBarInset : Spacing.xxl;
  // With a footer, content scrolls under it — pad by the footer's measured height.
  const paddingBottom = footer ? footerHeight + Spacing.lg : basePaddingBottom;

  // When a footer floats, its blur owns the bottom edge, so drop the safe-area bottom.
  const edges = footer ? EDGES[variant].filter((edge) => edge !== 'bottom') : EDGES[variant];

  const body = (
    <View style={styles.fill}>
      <BlurTargetView ref={blurTargetRef} style={styles.fill}>
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.content, { paddingTop, paddingBottom }, contentStyle]}>
          {children}
        </ScrollView>
      </BlurTargetView>

      {footer && (
        <View
          style={styles.footerOverlay}
          onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}>
          <MaskedView
            pointerEvents="none"
            style={StyleSheet.absoluteFill}
            maskElement={
              // Clear at the top, solid at the bottom — the blur fades into the content.
              <LinearGradient
                colors={[Mask.transparent, Mask.opaque, Mask.opaque]}
                locations={[0, FOOTER_SOLID, 1]}
                style={StyleSheet.absoluteFill}
              />
            }>
            <BlurView
              intensity={40}
              tint={isDark ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterialLight'}
              blurMethod="dimezisBlurViewSdk31Plus"
              blurTarget={blurTargetRef}
              style={StyleSheet.absoluteFill}
            />
          </MaskedView>

          <View style={[styles.footerContent, { paddingBottom: insets.bottom + Spacing.md }]}>
            {footer}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.fill} edges={edges}>
        {avoidKeyboard ? (
          <KeyboardAvoidingView
            style={styles.fill}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {body}
          </KeyboardAvoidingView>
        ) : (
          body
        )}

        {hasFrostedTop && <FrostedTop inset={insets.top} blurTarget={blurTargetRef} />}
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
  scroll: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Layout.screenPadding,
  },
  footerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  footerContent: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.lg,
  },
});
