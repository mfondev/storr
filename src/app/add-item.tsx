import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppButton } from '@/components/ui/appButton';
import { Chip } from '@/components/ui/chip';
import { Icon, type IconName } from '@/components/ui/icon';
import { InputField } from '@/components/ui/inputField';
import { Screen } from '@/components/ui/screen';
import { ScreenHeader } from '@/components/ui/screenHeader';
import { IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Mirrors the backend Category enum.
const CATEGORIES: { value: string; label: string; icon: IconName }[] = [
  { value: 'ELECTRONICS', label: 'Electronics', icon: 'hardware-chip-outline' },
  { value: 'HOME', label: 'Home', icon: 'home-outline' },
  { value: 'WORK', label: 'Work', icon: 'briefcase-outline' },
  { value: 'FOOD', label: 'Food', icon: 'fast-food-outline' },
  { value: 'PERSONAL_CARE', label: 'Personal care', icon: 'sparkles-outline' },
  { value: 'OTHER', label: 'Other', icon: 'cube-outline' },
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'NGN'];
const REMIND_OPTIONS = [3, 7, 14, 30];

export default function AddItem() {
  // UI only — nothing is saved yet. "Save item" closes the sheet.
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('ELECTRONICS');
  const [price, setPrice] = useState('');
  const [currencyIndex, setCurrencyIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [store, setStore] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [barcode, setBarcode] = useState('');
  const [remindDays, setRemindDays] = useState(7);
  const [notes, setNotes] = useState('');

  const canSave = name.trim().length > 0;
  const currency = CURRENCIES[currencyIndex];

  return (
    <Screen
      variant="modal"
      avoidKeyboard
      footer={
        <AppButton label="Save item"  disabled={!canSave} onPress={() => router.back()} />
      }>
      <ScreenHeader title="Add item" backIcon="close" />

      {/* Compact capture row — add a photo or scan to autofill. */}
      <View style={styles.mediaRow}>
        <CaptureTile icon="camera-outline" label="Add photo" />
        <ScanTile />
      </View>

      <Section label="Details">
        <InputField
          label="Item name"
          placeholder="e.g. Sony WH-1000XM6"
          value={name}
          onChangeText={setName}
          autoFocus
        />
        <InputField
          label="Brand"
          placeholder="e.g. Sony"
          value={brand}
          onChangeText={setBrand}
          hint="Optional"
        />
        <FieldLabel>Category</FieldLabel>
        <View style={styles.chips}>
          {CATEGORIES.map((entry) => (
            <Chip
              key={entry.value}
              label={entry.label}
              icon={entry.icon}
              selected={category === entry.value}
              onPress={() => setCategory(entry.value)}
            />
          ))}
        </View>
      </Section>

      <Section label="Purchase">
        <InputField
          label="Price"
          icon="pricetag-outline"
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={setPrice}
          rightSlot={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Currency: ${currency}`}
              hitSlop={6}
              onPress={() => setCurrencyIndex((index) => (index + 1) % CURRENCIES.length)}>
              <CurrencyPill code={currency} />
            </Pressable>
          }
        />
        <View style={styles.row}>
          <QuantityStepper value={quantity} onChange={setQuantity} style={styles.rowField} />
          <DateField label="Purchase date" placeholder="Select date" style={styles.rowField} />
        </View>
        <InputField label="Store" icon="storefront-outline" placeholder="e.g. Best Buy" value={store} onChangeText={setStore} />
      </Section>

      <Section label="Warranty & expiry">
        <View style={styles.row}>
          <DateField label="Warranty ends" placeholder="Select date" style={styles.rowField} />
          <DateField label="Expiry date" placeholder="Select date" style={styles.rowField} />
        </View>
        <InputField
          label="Serial number"
          icon="barcode-outline"
          placeholder="Optional"
          autoCapitalize="characters"
          value={serialNumber}
          onChangeText={setSerialNumber}
        />
      </Section>

      <Section label="Tracking">
        <InputField
          label="Barcode"
          icon="barcode-outline"
          placeholder="Scan or enter manually"
          keyboardType="number-pad"
          value={barcode}
          onChangeText={setBarcode}
          rightSlot={<ScanButton />}
        />
        <FieldLabel>Remind me before expiry</FieldLabel>
        <View style={styles.chips}>
          {REMIND_OPTIONS.map((days) => (
            <Chip
              key={days}
              label={`${days} days`}
              selected={remindDays === days}
              onPress={() => setRemindDays(days)}
            />
          ))}
        </View>
        <AttachRow label="Attach receipt" icon="receipt-outline" />
      </Section>

      <Section label="Notes">
        <InputField
          placeholder="Anything worth remembering — condition, location, who it's for…"
          value={notes}
          onChangeText={setNotes}
          multiline
          style={styles.notes}
        />
      </Section>
    </Screen>
  );
}

/* ---------- Local building blocks (UI only) ---------- */

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="label" themeColor="textTertiary">
        {label}
      </ThemedText>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <ThemedText type="smallBold" themeColor="textSecondary">
      {children}
    </ThemedText>
  );
}

function CaptureTile({ icon, label }: { icon: IconName; label: string }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.photoTile,
        { backgroundColor: theme.primaryTint, borderColor: theme.primary },
        pressed && styles.pressed,
      ]}>
      <Icon name={icon} size={IconSize.lg} color={theme.primary} />
      <ThemedText type="smallBold" style={{ color: theme.primary }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function ScanTile() {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Scan barcode"
      style={({ pressed }) => [
        styles.scanTile,
        { backgroundColor: theme.card, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <View style={[styles.scanIcon, { backgroundColor: theme.backgroundElement }]}>
        <Icon name="barcode-outline" size={IconSize.lg} color={theme.text} />
      </View>
      <View style={styles.scanText}>
        <ThemedText type="bodyMedium">Scan barcode</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">
          Autofill the item details
        </ThemedText>
      </View>
      <Icon name="chevron-forward" size={IconSize.sm} color={theme.textTertiary} />
    </Pressable>
  );
}

function CurrencyPill({ code }: { code: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.currencyPill, { backgroundColor: theme.backgroundElement }]}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {code}
      </ThemedText>
      <Icon name="chevron-down" size={12} color={theme.textTertiary} />
    </View>
  );
}

function ScanButton() {
  const theme = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Scan barcode" hitSlop={6}>
      <Icon name="scan-outline" size={IconSize.md} color={theme.primary} />
    </Pressable>
  );
}

function QuantityStepper({
  value,
  onChange,
  style,
}: {
  value: number;
  onChange: (next: number) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  return (
    <View style={style}>
      <FieldLabel>Quantity</FieldLabel>
      <View style={[styles.stepper, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <StepButton icon="remove" onPress={() => onChange(Math.max(1, value - 1))} disabled={value <= 1} />
        <ThemedText type="bodyMedium">{value}</ThemedText>
        <StepButton icon="add" onPress={() => onChange(value + 1)} />
      </View>
    </View>
  );
}

function StepButton({
  icon,
  onPress,
  disabled,
}: {
  icon: IconName;
  onPress: () => void;
  disabled?: boolean;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.stepButton,
        { backgroundColor: theme.backgroundElement },
        disabled && { opacity: 0.4 },
        pressed && styles.pressed,
      ]}>
      <Icon name={icon} size={IconSize.md} color={theme.text} />
    </Pressable>
  );
}

function DateField({
  label,
  placeholder,
  style,
}: {
  label: string;
  placeholder: string;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  return (
    <View style={style}>
      <FieldLabel>{label}</FieldLabel>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        style={({ pressed }) => [
          styles.dateField,
          { backgroundColor: theme.card, borderColor: theme.border },
          pressed && styles.pressed,
        ]}>
        <Icon name="calendar-outline" size={IconSize.md} color={theme.textTertiary} />
        <ThemedText type="default" themeColor="textTertiary" style={styles.flex} numberOfLines={1}>
          {placeholder}
        </ThemedText>
      </Pressable>
    </View>
  );
}

function AttachRow({ label, icon }: { label: string; icon: IconName }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.attach,
        { borderColor: theme.borderStrong },
        pressed && styles.pressed,
      ]}>
      <Icon name={icon} size={IconSize.md} color={theme.primary} />
      <ThemedText type="smallBold" style={{ color: theme.primary }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mediaRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  photoTile: {
    width: 104,
    height: 104,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  scanTile: {
    flex: 1,
    height: 104,
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  scanIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: {
    flex: 1,
    gap: Spacing.xxs,
  },
  section: {
    marginTop: Spacing.xxxl,
    gap: Spacing.md,
  },
  sectionBody: {
    gap: Spacing.lg,
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
    gap: Spacing.sm,
  },
  currencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
  },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 52,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
  },
  flex: {
    flex: 1,
  },
  attach: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    minHeight: 52,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: Radius.md,
  },
  notes: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
