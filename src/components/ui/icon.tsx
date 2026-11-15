import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

import { IconSize } from '@/constants/theme';

/** One icon set for the whole app. Swap the implementation here, not at call sites. */
export type IconName = ComponentProps<typeof Ionicons>['name'];

type IconProps = {
  name: IconName;
  color: string;
  size?: number;
  style?: StyleProp<TextStyle>;
};

export function Icon({ name, color, size = IconSize.md, style }: IconProps) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}
