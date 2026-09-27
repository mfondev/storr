import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Cards from "@/components/home/cards";
import RecentItems from "@/components/home/recentItems";

const Index = () => {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <ThemedText type="default">Good morning</ThemedText>

          <ThemedText type="subtitle">Gideon</ThemedText>

          <ThemedText type="subtitle">$1,234.56</ThemedText>

          <ThemedText type="small">124 items tracked</ThemedText>

          <Cards />

          <RecentItems />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 16,
    // paddingTop: 16,
    // paddingBottom: 30,
    // gap: 20,
  },
});
