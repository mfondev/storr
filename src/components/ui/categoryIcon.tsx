import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Category } from '@/utils/types';

// Re-exported so existing callers can keep importing it from here.
export type { Category };

type CategoryIconProps = {
  category: Category;
  /** Override the glyph (e.g. a specific product) while keeping the category tone. */
  icon?: IconName;
  size?: number;
};

const glyphs: Record<Category, IconName> = {
  ELECTRONICS: 'laptop-outline',
  HOME: 'home-outline',
  WORK: 'briefcase-outline',
  FOOD: 'fast-food-outline',
  PERSONAL_CARE: 'sparkles-outline',
  OTHER: 'cube-outline',
};

/** The outline glyph used for a category (e.g. for a large hero icon). */
export function glyphForCategory(category: Category): IconName {
  return glyphs[category];
}

/** Rounded-square thumbnail that stands in for an item photo, toned by category. */
export function CategoryIcon({ category, icon, size = 48 }: CategoryIconProps) {
  const theme = useTheme();

  const tone: Record<Category, { bg: string; fg: string }> = {
    ELECTRONICS: { bg: theme.primaryTint, fg: theme.primary },
    HOME: { bg: theme.amberTint, fg: theme.amber },
    WORK: { bg: theme.backgroundSelected, fg: theme.primaryStrong },
    FOOD: { bg: theme.coralTint, fg: theme.coral },
    PERSONAL_CARE: { bg: theme.primaryTint, fg: theme.primaryStrong },
    OTHER: { bg: theme.backgroundElement, fg: theme.textSecondary },
  };
  const { bg, fg } = tone[category];

  return (
    <View
      style={[
        styles.box,
        {
          width: size,
          height: size,
          borderRadius: size >= 56 ? Radius.md : Radius.sm,
          backgroundColor: bg,
        },
      ]}>
      <Icon name={icon ?? glyphs[category]} size={Math.round(size * 0.46)} color={fg} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
