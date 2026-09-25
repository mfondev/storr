import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

export default function Index() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>

      {/* Buttons */}
      <View style={styles.buttonRow}>

        <Pressable
          style={[
            styles.button,
            { backgroundColor: theme.accent },
          ]}
        >
          <ThemedText style={styles.addButtonText}>
            + Add item
          </ThemedText>
        </Pressable>

        <Pressable
          style={[
            styles.button,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
              borderWidth: 2,
            },
          ]}
        >
          <ThemedText>
            Scan
          </ThemedText>
        </Pressable>

      </View>


      {/* Attention */}
      <ThemedView
        type="amberTint"
        style={styles.attention}
      >
        <ThemedView style={styles.attentionContent}>

          <ThemedText
            style={[
              styles.attentionTitle,
              { color: theme.amber },
            ]}
          >
            Attention needed
          </ThemedText>

          <ThemedText style={styles.secondaryText}>
            3 warranties expiring soon
          </ThemedText>

        </ThemedView>

        <ThemedText
          style={[
            styles.review,
            { color: theme.amber },
          ]}
        >
          Review
        </ThemedText>
      </ThemedView>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 24,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },

  button: {
    flex: 1,
    height: 90,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
  },

  attention: {
    minHeight: 128,
    borderRadius: 26,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  attentionContent: {
    gap: 4,
  },

  attentionTitle: {
    fontSize: 26,
    fontWeight: '700',
  },

  secondaryText: {
    opacity: 0.7,
  },

  review: {
    fontSize: 20,
    fontWeight: '700',
  },
});