import MaskedViewLib from '@react-native-masked-view/masked-view';
import type { ComponentType, ReactElement } from 'react';
import type { ViewProps } from 'react-native';

/**
 * `@react-native-masked-view/masked-view@0.3.2` (its latest release, and the version Expo
 * SDK 58 pins) ships a default-export class type that React 19.3's stricter JSX typing
 * rejects with "cannot be used as a JSX component". The component works at runtime, so we
 * re-expose it here with its correct props type. Remove this wrapper once the library
 * publishes React 19-compatible types and import the package directly again.
 */
export type MaskedViewProps = ViewProps & {
  maskElement: ReactElement;
  androidRenderingMode?: 'software' | 'hardware';
};

export const MaskedView = MaskedViewLib as unknown as ComponentType<MaskedViewProps>;
