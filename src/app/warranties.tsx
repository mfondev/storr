import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

type Tone = 'ok' | 'warn' | 'expired';
type Warranty = { name: string; plan: string; status: string; tone: Tone };
type Group = { label: string; items: Warranty[] };

const groups: Group[] = [
  {
    label: 'Expiring soon',
    items: [
      { name: 'Sony WH-1000XM6', plan: 'Manufacturer warranty', status: '7 days', tone: 'warn' },
      { name: 'Sony Bravia TV', plan: 'Extended plan', status: '24 days', tone: 'warn' },
    ],
  },
  {
    label: 'Active',
    items: [
      { name: 'MacBook Pro 14"', plan: 'AppleCare+', status: '214 days', tone: 'ok' },
      { name: 'Dyson V15', plan: 'Manufacturer warranty', status: '340 days', tone: 'ok' },
    ],
  },
  {
    label: 'Expired',
    items: [
      { name: 'Standing desk', plan: 'Manufacturer warranty', status: 'Expired', tone: 'expired' },
    ],
  },
];

export default function Warranties() {
  const theme = useTheme();

  const tone: Record<Tone, { bg: string; text: string }> = {
    ok: { bg: theme.accentTint, text: theme.accent },
    warn: { bg: theme.amberTint, text: theme.amber },
    expired: { bg: theme.coralTint, text: theme.coral },
  };

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

          <ThemedText type="small" themeColor="textSecondary">
            Coverage
          </ThemedText>
          <ThemedText type="subtitle" style={styles.title}>
            Warranties
          </ThemedText>

          {groups.map((group) => (
            <View key={group.label} style={styles.group}>
              <ThemedText type="smallBold" themeColor="textSecondary" style={styles.groupLabel}>
                {group.label}
              </ThemedText>
              {group.items.map((item) => (
                <View
                  key={item.name}
                  style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.info}>
                    <ThemedText type="smallBold">{item.name}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.sub}>
                      {item.plan}
                    </ThemedText>
                  </View>
                  <View style={[styles.pill, { backgroundColor: tone[item.tone].bg }]}>
                    <ThemedText style={[styles.pillText, { color: tone[item.tone].text }]}>
                      {item.status}
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 8,
    marginBottom: 4,
  },
  title: {
    marginTop: 2,
    marginBottom: 16,
  },
  group: {
    marginBottom: 22,
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
  info: {
    flex: 1,
    minWidth: 0,
  },
  sub: {
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
});
