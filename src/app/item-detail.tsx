import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

const info = [
  { label: 'Purchased', value: 'Mar 14, 2025' },
  { label: 'Price', value: '$2,399' },
  { label: 'Store', value: 'Apple Store' },
  { label: 'Location', value: 'Home office' },
];

const documents = [
  { name: 'Receipt.pdf', size: '240 KB' },
  { name: 'AppleCare terms.pdf', size: '1.1 MB' },
];

export default function ItemDetail() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <ThemedText type="small" themeColor="textSecondary">
                ‹ Back
              </ThemedText>
            </Pressable>
          </View>

          <View style={[styles.photo, { backgroundColor: theme.accentTint }]} />
          <ThemedText type="subtitle" style={styles.name}>
            MacBook Pro 14"
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.category}>
            Electronics
          </ThemedText>

          <View style={styles.grid}>
            {info.map((row) => (
              <View key={row.label} style={styles.gridItem}>
                <ThemedText type="small" themeColor="textSecondary">
                  {row.label}
                </ThemedText>
                <ThemedText type="smallBold" style={styles.gridValue}>
                  {row.value}
                </ThemedText>
              </View>
            ))}
          </View>

          <View style={[styles.warranty, { backgroundColor: theme.accentTint }]}>
            <View>
              <ThemedText type="smallBold" style={{ color: theme.accent }}>
                AppleCare+
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.warrantySub}>
                Expires in 214 days
              </ThemedText>
            </View>
            <View style={[styles.pill, { backgroundColor: theme.card }]}>
              <ThemedText style={[styles.pillText, { color: theme.accent }]}>Active</ThemedText>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
            Documents
          </ThemedText>
          {documents.map((doc) => (
            <View
              key={doc.name}
              style={[styles.docCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.docThumb, { backgroundColor: theme.accentTint }]} />
              <View style={styles.docInfo}>
                <ThemedText type="smallBold">{doc.name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary" style={styles.docSize}>
                  {doc.size}
                </ThemedText>
              </View>
            </View>
          ))}

          <View style={styles.actions}>
            <Pressable style={[styles.actionBtn, { borderColor: theme.border }]}>
              <ThemedText type="small" style={styles.actionText}>
                Edit
              </ThemedText>
            </Pressable>
            <Pressable style={[styles.actionBtn, { borderColor: theme.border }]}>
              <ThemedText type="small" style={styles.actionText}>
                Set reminder
              </ThemedText>
            </Pressable>
          </View>
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
    paddingVertical: 8,
    marginBottom: 4,
  },
  photo: {
    width: '100%',
    aspectRatio: 16 / 11,
    borderRadius: 16,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
  },
  category: {
    marginTop: 4,
    marginBottom: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  gridItem: {
    width: '50%',
    gap: 3,
    marginBottom: 14,
  },
  gridValue: {
    fontSize: 14,
  },
  warranty: {
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  warrantySub: {
    marginTop: 2,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 18,
  },
  sectionLabel: {
    marginBottom: 10,
  },
  docCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  docThumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  docInfo: {
    flex: 1,
    minWidth: 0,
  },
  docSize: {
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontWeight: '700',
  },
});
