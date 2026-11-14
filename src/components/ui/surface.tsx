import { StyleSheet, View, type ViewProps } from 'react-native';

import { Elevation, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SurfaceProps = ViewProps & {
  /**
   * default — white card, hairline border, soft shadow.
   * muted   — recessed, borderless; for grouped lists and secondary blocks.
   * tinted  — brand-tinted; for highlights.
   * outline — transparent with a border; for low-emphasis containers.
   */
  variant?: 'default' | 'muted' | 'tinted' | 'outline';
  padding?: keyof typeof Spacing | 'none';
  radius?: keyof typeof Radius;
};

export function Surface({
  variant = 'default',
  padding = 'lg',
  radius = 'lg',
  style,
  ...rest
}: SurfaceProps) {
  const theme = useTheme();

  const variantStyle = {
    default: { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1, ...Elevation.soft },
    muted: { backgroundColor: theme.cardMuted },
    tinted: { backgroundColor: theme.primaryTint },
    outline: { borderColor: theme.border, borderWidth: 1 },
  }[variant];

  return (
    <View
      style={[
        styles.base,
        variantStyle,
        { borderRadius: Radius[radius] },
        padding !== 'none' && { padding: Spacing[padding] },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
