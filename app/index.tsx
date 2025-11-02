import { Link } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/theme'
import Header from '@/components/header';
import { languages } from '@/constents'

export default function IndexPage() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>AVAILABLE LANGUAGES</Text>
        <FlatList
          data={languages}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) =>
            <Link href={`/languages/${item.language}`} key={index} style={styles.languageCard}>
              <View style={styles.languageInfo}>
                <View style={styles.iconContainer}>
                  <Text style={styles.languageFlag}>{item.flag}</Text>
                </View>
                <View style={styles.languageTextContainer}>
                  <Text style={styles.languageName}>{item.language}</Text>
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
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
    fontWeight: '500',
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageFlag: {
    fontSize: 20,
  },
  languageTextContainer: {
    gap: 4,
  },
  languageName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  arrow: {
    color: '#444',
    fontSize: 18,
  },
})
