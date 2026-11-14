import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { Layout, Spacing } from '@/constants/theme';

type ScreenVariant = 'tab' | 'stack' | 'modal';

type ScreenProps = {
  children: ReactNode;
  /** tab — sits under the tab bar; stack — pushed; modal — presented as a sheet. */
  variant?: ScreenVariant;
  /** Pinned under the scroll area (e.g. a submit button). */
  footer?: ReactNode;
  /** Lift content above the keyboard; use on forms. */
  avoidKeyboard?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

const EDGES: Record<ScreenVariant, Edge[]> = {
  tab: ['top', 'left', 'right'],
  stack: ['top', 'bottom', 'left', 'right'],
  modal: ['bottom', 'left', 'right'],
};

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
  const paddingBottom = variant === 'tab' ? Layout.tabBarInset : Spacing.xxl;
  const paddingTop = variant === 'modal' ? Spacing.xl : Spacing.md;

  const body = (
    <>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingTop, paddingBottom: footer ? Spacing.lg : paddingBottom },
          contentStyle,
        ]}>
        {children}
      </ScrollView>
      {footer && <View style={styles.footer}>{footer}</View>}
    </>
  );

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.fill} edges={EDGES[variant]}>
        {avoidKeyboard ? (
          <KeyboardAvoidingView
            style={styles.fill}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {body}
          </KeyboardAvoidingView>
        ) : (
          body
        )}
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
  footer: {
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Layout.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
});
