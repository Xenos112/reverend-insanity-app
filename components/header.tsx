import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/styles/theme"

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.logo}>Reverend Insanity</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    boxShadow: '0 21px 69px -2px rgba(0,0,0,0.39)', // TODO: make it later
  },
  logo: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  }
})
