import { Link } from 'expo-router';
import { FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/theme'
import Header from '@/components/header';
import { languages } from '@/constents'

export default function IndexPage() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FlatList
        data={languages}
        renderItem={({ item, index }) =>
          <Link href={`/languages/${item.language}`} key={index} style={styles.languageContainer}>
            <Text style={styles.languageFlag}>{item.flag}</Text>
            <Text style={styles.languageText}>{item.language}</Text>
          </Link>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  languageContainer: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: colors.surface,
    padding: 16,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  languageText: {
    color: colors.text,
    fontSize: 24,
  },
  languageFlag: {
    fontSize: 32,
  },
})
