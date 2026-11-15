import { StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type Category = 'Electronics' | 'Home' | 'Work' | 'Other';

type CategoryIconProps = {
  category: Category;
  /** Override the glyph (e.g. a specific product) while keeping the category tone. */
  icon?: IconName;
  size?: number;
};

const glyphs: Record<Category, IconName> = {
  Electronics: 'laptop-outline',
  Home: 'home-outline',
  Work: 'briefcase-outline',
  Other: 'cube-outline',
};

/** Rounded-square thumbnail that stands in for an item photo, toned by category. */
export function CategoryIcon({ category, icon, size = 44 }: CategoryIconProps) {
  const theme = useTheme();

  const tone = {
    Electronics: { bg: theme.primaryTint, fg: theme.primary },
    Home: { bg: theme.amberTint, fg: theme.amber },
    Work: { bg: theme.backgroundSelected, fg: theme.primaryStrong },
    Other: { bg: theme.backgroundElement, fg: theme.textSecondary },
  }[category];

  return (
    <View
      style={[
        styles.box,
        { width: size, height: size, borderRadius: size >= 56 ? Radius.md : Radius.sm, backgroundColor: tone.bg },
      ]}>
      <Icon name={icon ?? glyphs[category]} size={Math.round(size * 0.46)} color={tone.fg} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
