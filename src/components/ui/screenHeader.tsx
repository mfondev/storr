import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconButton } from '@/components/ui/iconButton';
import { Spacing } from '@/constants/theme';

type ScreenHeaderProps = {
  title?: string;
  /** Defaults to `router.back()`. */
  onBack?: () => void;
  backIcon?: 'back' | 'close';
  rightSlot?: ReactNode;
};

/** Compact header for pushed/modal screens: back · centered title · optional action. */
export function ScreenHeader({ title, onBack, backIcon = 'back', rightSlot }: ScreenHeaderProps) {
  return (
    <View style={styles.bar}>
      <IconButton
        icon={backIcon === 'close' ? 'close' : 'chevron-back'}
        accessibilityLabel={backIcon === 'close' ? 'Close' : 'Go back'}
        onPress={onBack ?? (() => router.back())}
      />
      {title ? (
        <ThemedText type="heading" numberOfLines={1} style={styles.title}>
          {title}
        </ThemedText>
      ) : (
        <View style={styles.title} />
      )}
      <View style={styles.right}>{rightSlot}</View>
    </View>
  );
}

type PageTitleProps = {
  eyebrow?: string;
  title: string;
  rightSlot?: ReactNode;
};

/** Large title block for tab screens: small-caps eyebrow over a display title. */
export function PageTitle({ eyebrow, title, rightSlot }: PageTitleProps) {
  return (
    <View style={styles.page}>
      <View style={styles.pageText}>
        {eyebrow && (
          <ThemedText type="label" themeColor="textTertiary">
            {eyebrow}
          </ThemedText>
        )}
        <ThemedText type="title">{title}</ThemedText>
      </View>
      {rightSlot}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
  page: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  pageText: {
    flex: 1,
    gap: Spacing.xs,
  },
});
