import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppButton } from '@/components/ui/appButton';
import { type Category } from '@/components/ui/categoryIcon';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { InputField } from '@/components/ui/inputField';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screenHeader';
import { sampleCategories } from '@/constants/sampleData';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function AddItem() {
  // UI only — nothing is saved yet. "Save item" closes the sheet.
  const theme = useTheme();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Electronics');
  const canSave = name.trim().length > 0;

  return (
    <Screen
      variant="modal"
      avoidKeyboard
      footer={<AppButton label="Save item" disabled={!canSave} onPress={() => router.back()} />}>
      <ScreenHeader title="New item" backIcon="close" />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add a photo"
        style={({ pressed }) => [
          styles.dropzone,
          { borderColor: theme.borderStrong, backgroundColor: theme.cardMuted },
          pressed && styles.pressed,
        ]}>
        <View style={[styles.dropIcon, { backgroundColor: theme.primaryTint }]}>
          <Icon name="camera-outline" size={IconSize.xl} color={theme.primary} />
        </View>
        <ThemedText type="bodyMedium">Add a photo</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">
          A clear shot of the item or its receipt
        </ThemedText>
      </Pressable>

      <View style={styles.captureRow}>
        <AppButton label="Take photo" icon="camera-outline" variant="secondary" size="md" style={styles.captureButton} />
        <AppButton label="Scan barcode" icon="barcode-outline" variant="secondary" size="md" style={styles.captureButton} />
      </View>

      <View style={styles.form}>
        <InputField
          label="Item name"
          placeholder="e.g. Sony headphones"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <View style={styles.field}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Category
          </ThemedText>
          <View style={styles.chips}>
            {sampleCategories.map((entry) => (
              <Chip
                key={entry.category}
                label={entry.category}
                selected={category === entry.category}
                onPress={() => setCategory(entry.category)}
              />
            ))}
          </View>
        </View>

        <InputField label="Price" icon="cash-outline" placeholder="0.00" keyboardType="decimal-pad" />

        <View style={styles.row}>
          <InputField
            label="Purchase date"
            icon="calendar-outline"
            placeholder="Select date"
            containerStyle={styles.rowField}
          />
          <InputField
            label="Warranty"
            icon="shield-checkmark-outline"
            placeholder="1 year"
            containerStyle={styles.rowField}
          />
        </View>

        <InputField
          label="Store"
          icon="storefront-outline"
          placeholder="e.g. Best Buy"
          hint="Optional"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dropzone: {
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginTop: Spacing.md,
  },
  dropIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  captureRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  captureButton: {
    flex: 1,
  },
  form: {
    gap: Spacing.xl,
    marginTop: Spacing.xxxl,
  },
  field: {
    gap: Spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  rowField: {
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
});
