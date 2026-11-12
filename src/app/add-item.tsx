import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { InputField } from '@/components/ui/inputField';
import { PrimaryButton } from '@/components/ui/primaryButton';
import { useTheme } from '@/hooks/use-theme';

export default function AddItem() {
  // UI only — no saving yet. "Save item" just closes the screen.
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <ThemedText type="small" themeColor="textSecondary">
                Cancel
              </ThemedText>
            </Pressable>
          </View>

          <ThemedText type="small" themeColor="textSecondary">
            New item
          </ThemedText>
          <ThemedText type="subtitle" style={styles.title}>
            Add item
          </ThemedText>

          <View style={styles.captureRow}>
            <Pressable style={[styles.capture, { backgroundColor: theme.card_add_item }]}>
              <ThemedText type="small" style={{ color: theme.add_item_text, fontWeight: '700' }}>
                📷  Take photo
              </ThemedText>
            </Pressable>
            <Pressable style={[styles.capture, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
              <ThemedText type="small" style={{ fontWeight: '700' }}>
                ⌗  Scan barcode
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.form}>
            <InputField label="Item name" placeholder="e.g. Sony headphones" />
            <View style={styles.row}>
              <View style={styles.rowField}>
                <InputField label="Category" placeholder="Electronics" />
              </View>
              <View style={styles.rowField}>
                <InputField label="Price" placeholder="$0.00" keyboardType="decimal-pad" />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowField}>
                <InputField label="Purchase date" placeholder="Select date" />
              </View>
              <View style={styles.rowField}>
                <InputField label="Warranty" placeholder="1 year" />
              </View>
            </View>
            <InputField label="Store (optional)" placeholder="e.g. Best Buy" />
          </View>

          <PrimaryButton label="Save item" onPress={() => router.back()} style={styles.save} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 8,
  },
  title: {
    marginTop: 2,
    marginBottom: 20,
  },
  captureRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  capture: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowField: {
    flex: 1,
  },
  save: {
    marginTop: 24,
  },
});
