import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextType =
  | 'display'
  | 'title'
  | 'subtitle'
  | 'heading'
  | 'default'
  | 'bodyMedium'
  | 'small'
  | 'smallBold'
  | 'label'
  | 'caption'
  | 'link'
  | 'linkPrimary'
  | 'code';

export type ThemedTextProps = TextProps & {
  type?: ThemedTextType;
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  const isLink = type === 'link' || type === 'linkPrimary';
  const color = theme[themeColor ?? (isLink ? 'primary' : 'text')];

  return <Text style={[{ color }, styles[type], style]} {...rest} />;
}

/**
 * Type scale. Each weight of a custom font is its own family, so variants set
 * `fontFamily` only — never `fontWeight` — or Android will synthesise a bold.
 */
const styles = StyleSheet.create({
  display: {
    fontFamily: Fonts.displayBold,
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -1.2,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontFamily: Fonts.display,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  heading: {
    fontFamily: Fonts.displayMedium,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  default: {
    fontFamily: Fonts.body,
    fontSize: 15,
    lineHeight: 22,
  },
  bodyMedium: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
    lineHeight: 22,
  },
  small: {
    fontFamily: Fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  smallBold: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    lineHeight: 18,
  },
  label: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: Fonts.body,
    fontSize: 12,
    lineHeight: 16,
  },
  link: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  linkPrimary: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  code: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    lineHeight: 16,
  },
});
