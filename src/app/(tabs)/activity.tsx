import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

type Entry = { title: string; sub: string };
type Group = { label: string; entries: Entry[] };

const groups: Group[] = [
  {
    label: 'Today',
    entries: [
      { title: 'Added MacBook Pro 14"', sub: '2 hours ago' },
      { title: 'Warranty reminder scheduled', sub: '5 hours ago · Sony WH-1000XM6' },
    ],
  },
  {
    label: 'Yesterday',
    entries: [
      { title: 'Receipt added', sub: 'Canon EOS R6' },
      { title: 'Item updated', sub: 'Standing desk · location changed' },
    ],
  },
  {
    label: '3 days ago',
    entries: [{ title: 'Dyson V15 marked as covered', sub: 'Manufacturer warranty linked' }],
  },
];

export default function Activity() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <ThemedText type="small" themeColor="textSecondary">
            Log
          </ThemedText>
          <ThemedText type="subtitle" style={styles.title}>
            Activity
          </ThemedText>

          {groups.map((group) => (
            <View key={group.label} style={styles.group}>
              <ThemedText type="smallBold" themeColor="textSecondary" style={styles.groupLabel}>
                {group.label}
              </ThemedText>
              {group.entries.map((entry) => (
                <View
                  key={entry.title}
                  style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={[styles.thumb, { backgroundColor: theme.accentTint }]} />
                  <View style={styles.info}>
                    <ThemedText type="smallBold">{entry.title}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.sub}>
                      {entry.sub}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    marginTop: 2,
    marginBottom: 16,
  },
  group: {
    marginBottom: 18,
  },
  groupLabel: {
    marginBottom: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  sub: {
    marginTop: 2,
  },
});
