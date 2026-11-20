import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.baslik}>Valorant Haritaları</Text>
      <Text style={styles.altYazi}>BSM447 · B231210077</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1923',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baslik: {
    color: '#ff4655',
    fontSize: 28,
    fontWeight: 'bold',
  },
  altYazi: {
    color: '#ece8e1',
    fontSize: 14,
    marginTop: 8,
  },
});