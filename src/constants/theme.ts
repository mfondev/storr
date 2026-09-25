/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1C2620',
    textSecondary: '#3E4A43',

    background: '#F6F4EE',
    card: '#FFFFFF',
    border: '#E3DFD3',

    accent: '#245240',
    accentTint: '#E4EEE8',

    amber: '#B4791C',
    amberTint: '#F6EBD8',

    coral: '#B4402F',
    coralTint: '#F5E4E0',
  },

  dark: {
    text: '#EDEAE1',
    textSecondary: '#B9B3A4',

    background: '#15181A',
    card: '#1E2225',
    border: '#31363A',

    accent: '#6FAF93',
    accentTint: '#1E2E27',

    amber: '#D9A24B',
    amberTint: '#332A17',

    coral: '#E2897A',
    coralTint: '#33201C',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
