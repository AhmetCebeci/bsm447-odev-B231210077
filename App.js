// ==========================================================
// UYGULAMANIN GİRİŞ NOKTASI
// Expo uygulamayı açınca ilk bu dosyadaki App bileşenini çalıştırır.
// (4. commit'te burası navigasyon iskeleti olacak)
// ==========================================================

// Telefonun üstündeki saat/şarj çubuğu
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// Kendi yazdığımız liste ekranı ( ./ = bu klasörün içinden )
import ListeEkrani from './screens/ListeEkrani';

export default function App() {
  return (
    // Bütün ekranı kaplayan koyu arka planlı ana kutu
    <View style={styles.container}>
      {/* Üstteki başlık */}
      <Text style={styles.baslik}>Valorant Haritaları</Text>
      {/* Liste ekranını bir etiket gibi kullanıyoruz */}
      <ListeEkrani />
      {/* Koyu arka planda saat/şarj simgeleri beyaz görünsün */}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                    // bütün ekranı kapla
    backgroundColor: '#0f1923', // Valorant lacivert-siyahı
    paddingTop: 50,             // GEÇİCİ: saat/çentik altında kalmasın (navigasyon gelince silinecek)
  },
  baslik: {
    color: '#ff4655',           // Valorant kırmızısı
    fontSize: 28,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
});