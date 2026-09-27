import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";

export default function Index() {
  const theme = useTheme();
  console.log(theme);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.button, { backgroundColor: theme.card_add_item }]}
        >
          <ThemedText
            type="default"
            style={[styles.addButtonText, { color: theme.add_item_text }]}
          >
            + Add item
          </ThemedText>
        </Pressable>

        <Pressable
          style={[
            styles.button,
            {
              backgroundColor: theme.card_scan,
              borderColor: theme.border,
              borderWidth: 1,
            },
          ]}
        >
          <ThemedText type="default">Scan</ThemedText>
        </Pressable>
      </View>
      <ThemedView >
        <View style={[styles.attention, { backgroundColor: theme.amberTint }]}>
          <View>
            <ThemedText
              type="default"
              style={[, { color: theme.amber, fontWeight: "700" }]}
            >
              Attention needed
            </ThemedText>
            <ThemedText type="smallBold" style={styles.secondaryText}>
              3 warranties expiring soon
            </ThemedText>
          </View>
          <View>
            <ThemedText type="small" style={[{ color: theme.amber }]}>
              Review
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    paddingVertical: 16,
    gap: 20,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },

  button: {
    flex: 1,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  attention: {
    minHeight: 80,
    borderRadius: 15,
    // marginTop: 55,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  attentionContent: {
    gap: 4,
  },

  secondaryText: {
    opacity: 0.7,
  },
});
