import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, Link } from 'expo-router'
import useLanguageChapters from "@/hooks/useLanguageChapters";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/styles/theme";
import { FlashList } from '@shopify/flash-list'

export default function LanguagePage() {
  const { lang } = useLocalSearchParams<{ lang: string }>()
  const { data: chapters } = useLanguageChapters(lang)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{lang}</Text>
          <Text style={styles.subtitle}>{chapters?.length || 0} chapters available</Text>
        </View>
        <FlashList
          style={styles.chaptersList}
          data={chapters}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          removeClippedSubviews={true}
          overrideItemLayout={() => ({ width: '100%', height: 100 })}
          renderItem={({ item, index }) =>
            <Link href={`/chapters/${item.id}`} style={styles.chapterCard} key={index}>
              <View style={styles.chapterInfo}>
                <View style={styles.chapterNumber}>
                  <Text style={styles.chapterNumberText}>{item.number}</Text>
                </View>
                <View style={styles.chapterTextContainer}>
                  <Text style={styles.chapterTitle}>Chapter {item.number}</Text>
                  <Text style={styles.chapterMeta}>{item.title || 'Untitled'}</Text>
                </View>
              </View>
              <Text style={styles.arrow}>→</Text>
            </Link>
          }
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  chaptersList: {
    flex: 1,
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chapterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  chapterNumber: {
    width: 40,
    height: 40,
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNumberText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  chapterTextContainer: {
    gap: 4,
    flex: 1,
  },
  chapterTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  chapterMeta: {
    color: '#666',
    fontSize: 13,
  },
  arrow: {
    color: '#444',
    fontSize: 18,
  },
})
