import { View, type ViewProps } from 'react-native';

import { type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  /** Which background role this view plays. Defaults to the screen background. */
  type?: ThemeColor;
};

export function ThemedView({ style, type = 'background', ...otherProps }: ThemedViewProps) {
  const theme = useTheme();

  return <View style={[{ backgroundColor: theme[type] }, style]} {...otherProps} />;
}
