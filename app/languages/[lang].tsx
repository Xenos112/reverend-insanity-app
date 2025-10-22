import { FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams, Link } from 'expo-router'
import useLanguageChapters from "@/hooks/useLanguageChapters";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/styles/theme";

export default function LanguagePage() {
  const { lang } = useLocalSearchParams<{ lang: string }>()
  const { data: chapters } = useLanguageChapters(lang)

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.chaptersList}
        data={chapters}
        removeClippedSubviews={true}
        windowSize={5}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        renderItem={({ item, index }) => <Link href={`/chapters/${item.id}`} style={styles.chapter} key={index}>Chapter {item.number}</Link>}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  chaptersList: {
  },
  chapter: {
    color: colors.text,
    fontSize: 24,
    marginTop: 16,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  }
})
