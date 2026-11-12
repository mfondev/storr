import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

type Row = { label: string; value: string };
type Section = { label: string; rows: Row[] };

const sections: Section[] = [
  {
    label: 'Preferences',
    rows: [
      { label: 'Notifications', value: 'On' },
      { label: 'Appearance', value: 'System' },
      { label: 'Currency', value: 'USD' },
      { label: 'Categories', value: '4 custom' },
    ],
  },
  {
    label: 'Data',
    rows: [
      { label: 'Storage', value: '1.2 GB used' },
      { label: 'Backup & sync', value: 'Synced' },
    ],
  },
  {
    label: 'Account',
    rows: [
      { label: 'Privacy', value: '›' },
      { label: 'Security', value: '›' },
      { label: 'About storr', value: '›' },
    ],
  },
];

export default function Profile() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={[styles.avatar, { backgroundColor: theme.accentTint }]} />
          <ThemedText type="subtitle" style={styles.name}>
            Gideon Atauba
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.email}>
            gideon@storr.app
          </ThemedText>

          {sections.map((section) => (
            <View key={section.label} style={styles.section}>
              <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
                {section.label}
              </ThemedText>
              <View style={[styles.group, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {section.rows.map((row, index) => (
                  <View
                    key={row.label}
                    style={[
                      styles.row,
                      index < section.rows.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: theme.border,
                      },
                    ]}>
                    <ThemedText type="small">{row.label}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">
                      {row.value}
                    </ThemedText>
                  </View>
                ))}
              </View>
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
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
  },
  email: {
    marginTop: 2,
    marginBottom: 24,
  },
  section: {
    marginBottom: 22,
  },
  sectionLabel: {
    marginBottom: 8,
  },
  group: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
});
