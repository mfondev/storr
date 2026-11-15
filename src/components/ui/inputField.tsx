import { useState, type ReactNode } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Fonts, IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type InputFieldProps = TextInputProps & {
  label?: string;
  icon?: IconName;
  /** Rendered inside the field on the right, e.g. a password visibility toggle. */
  rightSlot?: ReactNode;
  hint?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function InputField({
  label,
  icon,
  rightSlot,
  hint,
  error,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? theme.coral : focused ? theme.primary : theme.border;
  const ring = focused ? { boxShadow: `0 0 0 3px ${error ? theme.coralTint : theme.primaryTint}` } : null;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <ThemedText type="smallBold" themeColor="textSecondary">
          {label}
        </ThemedText>
      )}
      <View style={[styles.field, { backgroundColor: theme.card, borderColor }, ring]}>
        {icon && (
          <Icon
            name={icon}
            size={IconSize.md}
            color={focused ? theme.primary : theme.textTertiary}
          />
        )}
        <TextInput
          placeholderTextColor={theme.textTertiary}
          selectionColor={theme.primary}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[styles.input, { color: theme.text }, style]}
          {...rest}
        />
        {rightSlot}
      </View>
      {(error || hint) && (
        <ThemedText type="caption" themeColor={error ? 'coral' : 'textTertiary'}>
          {error ?? hint}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 52,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 15,
    paddingVertical: Spacing.md,
  },
});
