import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";

export default function RecentItems() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Recent items</ThemedText>

          <ThemedText style={styles.subtitle}>
            Your recently added belongings
          </ThemedText>
        </View>

        {/* Recent Items */}
        <View style={styles.itemsContainer}>
          {/* MacBook */}
          <View
            style={[
              styles.itemCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={[styles.itemImage, { backgroundColor: theme.accentTint }]}
            />

            <View style={styles.itemInfo}>
              <ThemedText style={styles.itemName}>MacBook Pro 14</ThemedText>

              <ThemedText style={styles.itemSubtitle}>
                Added 2 hours ago
              </ThemedText>
            </View>
          </View>

          {/* Sony */}
          <View
            style={[
              styles.itemCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={[styles.itemImage, { backgroundColor: theme.accentTint }]}
            />

            <View style={styles.itemInfo}>
              <ThemedText style={styles.itemName}>Sony WH-1000XM6</ThemedText>

              <ThemedText style={styles.itemSubtitle}>
                Added yesterday
              </ThemedText>
            </View>

            <View style={[styles.badge, { backgroundColor: theme.accentTint }]}>
              <ThemedText style={[styles.badgeText, { color: theme.accent }]}>
                Covered
              </ThemedText>
            </View>
          </View>

          {/* Canon */}
          <View
            style={[
              styles.itemCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={[styles.itemImage, { backgroundColor: theme.accentTint }]}
            />

            <View style={styles.itemInfo}>
              <ThemedText style={styles.itemName}>Canon EOS R6</ThemedText>

              <ThemedText style={styles.itemSubtitle}>
                Added 3 days ago
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <ThemedText style={styles.sectionTitle}>Categories</ThemedText>

          <View style={styles.categoryRow}>
            <View style={[styles.categoryChip, { borderColor: theme.border }]}>
              <ThemedText>Electronics · 42</ThemedText>
            </View>

            <View style={[styles.categoryChip, { borderColor: theme.border }]}>
              <ThemedText>Home · 31</ThemedText>
            </View>

            <View style={[styles.categoryChip, { borderColor: theme.border }]}>
              <ThemedText>Work · 18</ThemedText>
            </View>

            <View style={[styles.categoryChip, { borderColor: theme.border }]}>
              <ThemedText>Other · 33</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    // paddingHorizontal: 12,
    // paddingTop: 20,
    paddingBottom: 40,
    gap: 24,
  },

  /* Header */

  header: {
    // gap: 5,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 14,
    opacity: 0.6,
  },

  /* Recent items */

  itemsContainer: {
    gap: 12,
  },

  itemCard: {
    height: 78,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,

    flexDirection: "row",
    alignItems: "center",
  },

  itemImage: {
    width: 46,
    height: 46,
    borderRadius: 11,
  },

  itemInfo: {
    flex: 1,
    marginLeft: 13,
  },

  itemName: {
    fontSize: 15,
    fontWeight: "700",
  },

  itemSubtitle: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 3,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },

  /* Categories */

  categoriesSection: {
    gap: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  categoryChip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
});
