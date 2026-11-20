import DateTimePicker from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppButton } from "@/components/ui/appButton";
import { Chip } from "@/components/ui/chip";
import { Icon, type IconName } from "@/components/ui/icon";
import { InputField } from "@/components/ui/inputField";
import { Screen } from "@/components/ui/screen";
import { ScreenHeader } from "@/components/ui/screenHeader";
import { IconSize, Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useItem } from "@/hooks/use-item";
import { takePendingBarcode } from "@/utils/scanBridge";
import { type Item } from "@/utils/types";

// Mirrors the backend Category enum.
const CATEGORIES: { value: string; label: string; icon: IconName }[] = [
  { value: "ELECTRONICS", label: "Electronics", icon: "hardware-chip-outline" },
  { value: "HOME", label: "Home", icon: "home-outline" },
  { value: "WORK", label: "Work", icon: "briefcase-outline" },
  { value: "FOOD", label: "Food", icon: "fast-food-outline" },
  { value: "PERSONAL_CARE", label: "Personal care", icon: "sparkles-outline" },
  { value: "OTHER", label: "Other", icon: "cube-outline" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "NGN"];
const REMIND_OPTIONS = [3, 7, 14, 30];

// Perishable categories track an expiry date; everything else tracks a warranty.
const EXPIRY_CATEGORIES = new Set(["FOOD", "PERSONAL_CARE"]);
const dateKindFor = (category: string): "warranty" | "expiry" =>
  EXPIRY_CATEGORIES.has(category) ? "expiry" : "warranty";

// End of today, so the whole of today is selectable but future days are not.
const endOfToday = (): Date => {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
};

// The in-progress form, kept alive while the modal is closed (this session only),
// so reopening restores whatever was typed. Cleared after a successful save.
type Draft = {
  name: string;
  brand: string;
  category: string;
  price: string;
  currencyIndex: number;
  quantity: number;
  store: string;
  purchaseDate: Date | null;
  warrantyExpiresAt: Date | null;
  expiryDate: Date | null;
  serialNumber: string;
  barcode: string;
  remindDays: number;
  notes: string;
};

const emptyDraft = (): Draft => ({
  name: "",
  brand: "",
  category: "ELECTRONICS",
  price: "",
  currencyIndex: 0,
  quantity: 1,
  store: "",
  purchaseDate: null,
  warrantyExpiresAt: null,
  expiryDate: null,
  serialNumber: "",
  barcode: "",
  remindDays: 7,
  notes: "",
});

let draft: Draft = emptyDraft();

// Prefill the form from an existing item when editing.
function draftFromItem(it: Item): Draft {
  const currencyIndex = CURRENCIES.indexOf(it.currency);
  return {
    name: it.name,
    brand: it.brand ?? "",
    category: it.category,
    price: it.priceCents != null ? (it.priceCents / 100).toString() : "",
    currencyIndex: currencyIndex >= 0 ? currencyIndex : 0,
    quantity: it.quantity ?? 1,
    store: it.store ?? "",
    purchaseDate: it.purchaseDate ? new Date(it.purchaseDate) : null,
    warrantyExpiresAt: it.warrantyExpiresAt ? new Date(it.warrantyExpiresAt) : null,
    expiryDate: it.expiryDate ? new Date(it.expiryDate) : null,
    serialNumber: it.serialNumber ?? "",
    barcode: it.barcode ?? "",
    remindDays: it.remindDaysBefore ?? 7,
    notes: it.notes ?? "",
  };
}

export default function AddItem() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { addItem, updateItem, item } = useItem();
  const existing = id ? (item.find((entry) => entry.id === id) ?? null) : null;
  const editing = existing !== null;
  // Editing prefills from the item; adding restores the kept draft.
  const initial = existing ? draftFromItem(existing) : draft;

  const [name, setName] = useState(initial.name);
  const [brand, setBrand] = useState(initial.brand);
  const [category, setCategory] = useState(initial.category);
  const [price, setPrice] = useState(initial.price);
  const [currencyIndex, setCurrencyIndex] = useState(initial.currencyIndex);
  const [quantity, setQuantity] = useState(initial.quantity);
  const [store, setStore] = useState(initial.store);
  const [purchaseDate, setPurchaseDate] = useState<Date | null>(initial.purchaseDate);
  const [warrantyExpiresAt, setWarrantyExpiresAt] = useState<Date | null>(
    initial.warrantyExpiresAt,
  );
  const [expiryDate, setExpiryDate] = useState<Date | null>(initial.expiryDate);
  const [serialNumber, setSerialNumber] = useState(initial.serialNumber);
  const [barcode, setBarcode] = useState(initial.barcode);
  const [remindDays, setRemindDays] = useState(initial.remindDays);
  const [notes, setNotes] = useState(initial.notes);
  const [imageUri, setImageUri] = useState<string | null>(existing?.imageUrl ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  // When the scanner closes, pick up the barcode it read.
  useFocusEffect(
    useCallback(() => {
      const scanned = takePendingBarcode();
      if (scanned) setBarcode(scanned);
    }, []),
  );

  const openScanner = () => router.push('/scan');

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  // Remember the latest field values (for stashing on close) and whether we saved.
  const latest = useRef<Draft>(initial);
  const saved = useRef(false);

  // Keep the ref in sync after each render (refs must not be written during render).
  useEffect(() => {
    latest.current = {
      name,
      brand,
      category,
      price,
      currencyIndex,
      quantity,
      store,
      purchaseDate,
      warrantyExpiresAt,
      expiryDate,
      serialNumber,
      barcode,
      remindDays,
      notes,
    };
  });

  // On close (unmount): keep the add draft if nothing was saved. Editing never
  // touches the add draft.
  useEffect(() => {
    if (editing) return;
    return () => {
      draft = saved.current ? emptyDraft() : latest.current;
    };
  }, [editing]);

  const currency = CURRENCIES[currencyIndex];
  // Which lapse date this item tracks, decided by its category.
  const dateKind = dateKindFor(category);

  // Drop a field's error (and the summary banner) as soon as it's edited.
  const clearError = (key: string) => {
    setError(null);
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // Collect every missing/invalid required field into one map.
  const validate = (): Record<string, string> => {
    const found: Record<string, string> = {};
    if (!name.trim()) found.name = "Required";
    if (!brand.trim()) found.brand = "Required";

    const priceValue = Number.parseFloat(price);
    if (!price.trim() || Number.isNaN(priceValue) || priceValue <= 0) {
      found.price = "Enter a valid price";
    }
    if (!store.trim()) found.store = "Required";
    if (!serialNumber.trim()) found.serialNumber = 'Required — type "N/A" if none';
    if (!barcode.trim()) found.barcode = 'Required — type "N/A" if none';
    if (!notes.trim()) found.notes = "Required";

    if (!purchaseDate) found.purchaseDate = "Required";

    if (dateKind === "warranty") {
      if (!warrantyExpiresAt) found.warrantyExpiresAt = "Required";
      else if (purchaseDate && warrantyExpiresAt < purchaseDate)
        found.warrantyExpiresAt = "Can't be before the purchase date";
    } else {
      if (!expiryDate) found.expiryDate = "Required";
      else if (purchaseDate && expiryDate < purchaseDate)
        found.expiryDate = "Can't be before the purchase date";
    }
    return found;
  };

  const handleAddItem = async () => {
    // Ignore taps while a save is in flight or already done.
    if (submitting || success) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setError("Please complete the required fields.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const priceCents = Math.round((Number.parseFloat(price) || 0) * 100);
      const payload = {
        name: name.trim(),
        brand: brand.trim(),
        category: category as Item["category"],
        priceCents,
        currency,
        quantity,
        store: store.trim(),
        purchaseDate: purchaseDate ? purchaseDate.toISOString() : null,
        // Send only the date this category tracks; clear the other.
        warrantyExpiresAt:
          dateKind === "warranty" && warrantyExpiresAt
            ? warrantyExpiresAt.toISOString()
            : null,
        expiryDate:
          dateKind === "expiry" && expiryDate ? expiryDate.toISOString() : null,
        serialNumber: serialNumber.trim(),
        barcode: barcode.trim(),
        remindDaysBefore: remindDays,
        notes: notes.trim(),
      };

      if (editing && existing) {
        // Keep the item's identity (id/userId/timestamps), override edited fields.
        await updateItem({ ...existing, ...payload } as Item);
      } else {
        await addItem(payload as Item);
      }

      // Confirm, then close so the change shows on the list behind.
      saved.current = true; // so the draft is cleared, not restored, on close
      setSuccess(true);
      setTimeout(() => router.back(), 900);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Couldn't add the item. Please try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <Screen
      variant="modal"
      avoidKeyboard
      footer={
        <View style={styles.footer}>
          {error ? (
            <FeedbackBanner
              tone="error"
              icon="alert-circle"
              message={error}
            />
          ) : null}
          {success ? (
            <FeedbackBanner
              tone="success"
              icon="checkmark-circle"
              message={editing ? "Changes saved" : "Item added"}
            />
          ) : null}
          <AppButton
            label={
              success
                ? editing
                  ? "Saved"
                  : "Added"
                : editing
                  ? "Save changes"
                  : "Add item"
            }
            icon={success ? "checkmark" : undefined}
            loading={submitting}
            disabled={submitting || success}
            onPress={handleAddItem}
          />
        </View>
      }
    >
      <ScreenHeader title={editing ? "Edit item" : "Add item"} backIcon="close" />

      {/* Compact capture row — add a photo or scan to autofill. */}
      <View style={styles.mediaRow}>
        <CaptureTile
          icon="camera-outline"
          label="Add photo"
          imageUri={imageUri}
          onPress={pickPhoto}
        />
        <ScanTile onPress={openScanner} />
      </View>

      <Section label="Details">
        <InputField
          label="Item name"
          required
          placeholder="e.g. Sony WH-1000XM6"
          value={name}
          onChangeText={(text) => {
            setName(text);
            clearError("name");
          }}
          error={errors.name}
          autoFocus
        />
        <InputField
          label="Brand"
          required
          placeholder="e.g. Sony"
          value={brand}
          onChangeText={(text) => {
            setBrand(text);
            clearError("brand");
          }}
          error={errors.brand}
        />
        <FieldLabel required>Category</FieldLabel>
        <View style={styles.chips}>
          {CATEGORIES.map((entry) => (
            <Chip
              key={entry.value}
              label={entry.label}
              icon={entry.icon}
              selected={category === entry.value}
              onPress={() => {
                setCategory(entry.value);
                // Switching category can swap which date applies — clear both.
                clearError("warrantyExpiresAt");
                clearError("expiryDate");
              }}
            />
          ))}
        </View>
      </Section>

      <Section label="Purchase">
        <InputField
          label="Price"
          required
          icon="pricetag-outline"
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={(text) => {
            setPrice(text);
            clearError("price");
          }}
          error={errors.price}
          rightSlot={
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Currency: ${currency}`}
              hitSlop={6}
              onPress={() =>
                setCurrencyIndex((index) => (index + 1) % CURRENCIES.length)
              }
            >
              <CurrencyPill code={currency} />
            </Pressable>
          }
        />
        <View style={styles.row}>
          <QuantityStepper
            value={quantity}
            onChange={setQuantity}
            style={styles.rowField}
          />
          <DateField
            label="Purchase date"
            required
            placeholder="Select date"
            value={purchaseDate}
            onChange={(date) => {
              setPurchaseDate(date);
              clearError("purchaseDate");
            }}
            maximumDate={endOfToday()}
            error={errors.purchaseDate}
            style={styles.rowField}
          />
        </View>
        <InputField
          label="Store"
          required
          icon="storefront-outline"
          placeholder="e.g. Best Buy"
          value={store}
          onChangeText={(text) => {
            setStore(text);
            clearError("store");
          }}
          error={errors.store}
        />
      </Section>

      <Section label={dateKind === "warranty" ? "Warranty" : "Expiry"}>
        {dateKind === "warranty" ? (
          <DateField
            label="Warranty ends"
            required
            placeholder="Select date"
            value={warrantyExpiresAt}
            onChange={(date) => {
              setWarrantyExpiresAt(date);
              clearError("warrantyExpiresAt");
            }}
            minimumDate={purchaseDate ?? undefined}
            error={errors.warrantyExpiresAt}
          />
        ) : (
          <DateField
            label="Expiry date"
            required
            placeholder="Select date"
            value={expiryDate}
            onChange={(date) => {
              setExpiryDate(date);
              clearError("expiryDate");
            }}
            minimumDate={purchaseDate ?? undefined}
            error={errors.expiryDate}
          />
        )}
        <InputField
          label="Serial number"
          required
          icon="barcode-outline"
          placeholder='Type "N/A" if none'
          autoCapitalize="characters"
          value={serialNumber}
          onChangeText={(text) => {
            setSerialNumber(text);
            clearError("serialNumber");
          }}
          error={errors.serialNumber}
        />
      </Section>

      <Section label="Tracking">
        <InputField
          label="Barcode"
          required
          icon="barcode-outline"
          placeholder='Scan, enter, or "N/A"'
          autoCapitalize="characters"
          value={barcode}
          onChangeText={(text) => {
            setBarcode(text);
            clearError("barcode");
          }}
          error={errors.barcode}
          rightSlot={<ScanButton onPress={openScanner} />}
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

      <Section label="Notes" required>
        <InputField
          placeholder="Anything worth remembering — condition, location, who it's for…"
          value={notes}
          onChangeText={(text) => {
            setNotes(text);
            clearError("notes");
          }}
          error={errors.notes}
          multiline
          style={styles.notes}
        />
      </Section>
    </Screen>
  );
}

/* ---------- Local building blocks (UI only) ---------- */

function Section({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <ThemedText type="label" themeColor="textTertiary">
        {label}
        {required ? <ThemedText themeColor="coral"> *</ThemedText> : null}
      </ThemedText>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <ThemedText type="smallBold" themeColor="textSecondary">
      {children}
      {required ? <ThemedText themeColor="coral"> *</ThemedText> : null}
    </ThemedText>
  );
}

function CaptureTile({
  icon,
  label,
  imageUri,
  onPress,
}: {
  icon: IconName;
  label: string;
  imageUri: string | null;
  onPress: () => void;
}) {
  const theme = useTheme();
  if (imageUri) {
    return (
      <Pressable accessibilityRole="button" accessibilityLabel="Change photo" onPress={onPress}>
        <Image source={{ uri: imageUri }} style={styles.photo} contentFit="cover" />
      </Pressable>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.photoTile,
        { backgroundColor: theme.primaryTint, borderColor: theme.primary },
        pressed && styles.pressed,
      ]}
    >
      <Icon name={icon} size={IconSize.lg} color={theme.primary} />
      <ThemedText type="smallBold" style={{ color: theme.primary }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

function ScanTile({ onPress }: { onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Scan barcode"
      onPress={onPress}
      style={({ pressed }) => [
        styles.scanTile,
        { backgroundColor: theme.card, borderColor: theme.border },
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[styles.scanIcon, { backgroundColor: theme.backgroundElement }]}
      >
        <Icon name="barcode-outline" size={IconSize.lg} color={theme.text} />
      </View>
      <View style={styles.scanText}>
        <ThemedText type="bodyMedium">Scan barcode</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">
          Autofill the item details
        </ThemedText>
      </View>
      <Icon
        name="chevron-forward"
        size={IconSize.sm}
        color={theme.textTertiary}
      />
    </Pressable>
  );
}

function CurrencyPill({ code }: { code: string }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.currencyPill,
        { backgroundColor: theme.backgroundElement },
      ]}
    >
      <ThemedText type="smallBold" themeColor="textSecondary">
        {code}
      </ThemedText>
      <Icon name="chevron-down" size={12} color={theme.textTertiary} />
    </View>
  );
}

function ScanButton({ onPress }: { onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Scan barcode"
      onPress={onPress}
      hitSlop={6}
    >
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
      <View
        style={[
          styles.stepper,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        <StepButton
          icon="remove"
          onPress={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
        />
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
      ]}
    >
      <Icon name={icon} size={IconSize.md} color={theme.text} />
    </Pressable>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function DateField({
  label,
  placeholder,
  value,
  onChange,
  minimumDate,
  maximumDate,
  required,
  error,
  style,
}: {
  label: string;
  placeholder: string;
  value: Date | null;
  onChange: (next: Date | null) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  required?: boolean;
  error?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const [show, setShow] = useState(false);

  return (
    <View style={style}>
      <FieldLabel required={required}>{label}</FieldLabel>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setShow(true)}
        style={({ pressed }) => [
          styles.dateField,
          {
            backgroundColor: theme.card,
            borderColor: error ? theme.coral : theme.border,
          },
          pressed && styles.pressed,
        ]}
      >
        <Icon
          name="calendar-outline"
          size={IconSize.md}
          color={value ? theme.primary : theme.textTertiary}
        />
        <ThemedText
          type="default"
          themeColor={value ? "text" : "textTertiary"}
          style={styles.flex}
          numberOfLines={1}
        >
          {value ? formatDate(value) : placeholder}
        </ThemedText>
        {value ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Clear ${label}`}
            hitSlop={8}
            onPress={() => onChange(null)}
          >
            <Icon
              name="close-circle"
              size={IconSize.md}
              color={theme.textTertiary}
            />
          </Pressable>
        ) : null}
      </Pressable>
      {error ? (
        <ThemedText type="caption" themeColor="coral">
          {error}
        </ThemedText>
      ) : null}
      {show ? (
        <DateTimePicker
          value={value ?? new Date()}
          mode="date"
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          onValueChange={(_event, selected) => {
            setShow(false);
            onChange(selected);
          }}
          onDismiss={() => setShow(false)}
        />
      ) : null}
    </View>
  );
}

function FeedbackBanner({
  tone,
  icon,
  message,
}: {
  tone: "error" | "success";
  icon: IconName;
  message: string;
}) {
  const theme = useTheme();
  const bg = tone === "error" ? theme.coralTint : theme.primaryTint;
  const fg = tone === "error" ? theme.coral : theme.primary;
  return (
    <View
      accessibilityLiveRegion="polite"
      style={[styles.banner, { backgroundColor: bg }]}
    >
      <Icon name={icon} size={IconSize.md} color={fg} />
      <ThemedText type="smallBold" style={[styles.flex, { color: fg }]}>
        {message}
      </ThemedText>
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
      ]}
    >
      <Icon name={icon} size={IconSize.md} color={theme.primary} />
      <ThemedText type="smallBold" style={{ color: theme.primary }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  mediaRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  photoTile: {
    width: 104,
    height: 104,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  photo: {
    width: 104,
    height: 104,
    borderRadius: Radius.lg,
  },
  scanTile: {
    flex: 1,
    height: 104,
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  scanIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  rowField: {
    flex: 1,
    gap: Spacing.sm,
  },
  currencyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 52,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
  },
  stepButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  dateField: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    minHeight: 52,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: Radius.md,
  },
  notes: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  footer: {
    gap: Spacing.md,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
