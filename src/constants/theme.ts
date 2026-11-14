/**
 * storr design tokens — the single source of color, type, spacing, radius and elevation.
 * Components read these via `useTheme()` (colors) and the static scales below.
 * Every color key exists in both palettes; their union is `ThemeColor`.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#141A17',
    textSecondary: '#5F6A64',
    textTertiary: '#98A09B',
    textInverse: '#F6F5F1',

    background: '#F6F5F1',
    backgroundElement: '#EDEBE5',
    backgroundSelected: '#E1EEE7',
    card: '#FFFFFF',
    cardMuted: '#F1EFEA',

    border: '#E6E2D9',
    borderStrong: '#D3CEC2',

    primary: '#1E5A44',
    primaryStrong: '#153F30',
    primaryTint: '#E1EEE7',
    onPrimary: '#F4FBF7',
    heroStart: '#23654D',
    heroEnd: '#0F3527',
    heroOverlay: 'rgba(255, 255, 255, 0.14)',
    heroMuted: 'rgba(244, 251, 247, 0.72)',

    accent: '#1E5A44',
    accentTint: '#E1EEE7',
    amber: '#A8701A',
    amberTint: '#F7ECD9',
    coral: '#B33F2E',
    coralTint: '#F8E5E1',

    overlay: 'rgba(20, 26, 23, 0.4)',
  },

  dark: {
    text: '#EEF0EC',
    textSecondary: '#A2ABA5',
    textTertiary: '#6E7772',
    textInverse: '#0E1311',

    background: '#0E1311',
    backgroundElement: '#161C19',
    backgroundSelected: '#1B2D26',
    card: '#161C19',
    cardMuted: '#1C2320',

    border: '#242C28',
    borderStrong: '#303A35',

    primary: '#6FB893',
    primaryStrong: '#4E9A75',
    primaryTint: '#172A23',
    onPrimary: '#0B1A14',
    heroStart: '#215742',
    heroEnd: '#0F2119',
    heroOverlay: 'rgba(255, 255, 255, 0.12)',
    heroMuted: 'rgba(244, 251, 247, 0.68)',

    accent: '#6FB893',
    accentTint: '#172A23',
    amber: '#DCA54C',
    amberTint: '#2E2615',
    coral: '#E58B7C',
    coralTint: '#321F1B',

    overlay: 'rgba(0, 0, 0, 0.5)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** Font families. Each weight is its own family name (loaded in the root layout). */
export const Fonts = {
  display: 'PlusJakartaSans_700Bold',
  displayBold: 'PlusJakartaSans_800ExtraBold',
  displayMedium: 'PlusJakartaSans_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  mono:
    Platform.select({ ios: 'ui-monospace', android: 'monospace', default: 'monospace' }) ??
    'monospace',
} as const;

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const Radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const IconSize = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
} as const;

/** Elevation presets. `boxShadow` renders natively on iOS/Android (new architecture) and on web. */
export const Elevation = {
  soft: { boxShadow: '0 6px 20px rgba(20, 26, 23, 0.06)' },
  raised: { boxShadow: '0 12px 32px rgba(20, 26, 23, 0.12)' },
  hero: { boxShadow: '0 18px 40px rgba(15, 53, 39, 0.28)' },
} as const;

export const Layout = {
  screenPadding: Spacing.xl,
  maxContentWidth: 800,
  /** Extra bottom padding so scroll content clears the native tab bar. */
  tabBarInset: (Platform.select({ ios: 50, android: 80 }) ?? 0) + Spacing.xxxl,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = Layout.maxContentWidth;
