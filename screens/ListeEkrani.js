// ==========================================================
// LİSTE EKRANI
// Valorant haritalarını API'den çeker ve FlatList ile listeler.
// ==========================================================

// useState: ekranda değişen verileri tutmak için (state)
// useEffect: ekran açılınca bir iş yapmak için (veri çekme)
import { useEffect, useState } from 'react';

// React Native'in hazır bileşenleri
// ActivityIndicator: dönen yükleniyor çarkı
// FlatList: uzun listeleri verimli çizen liste
// Image: resim, Pressable: basılabilen alan (düğme)
// StyleSheet: stil tanımlama, Text: yazı, View: kutu
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

// Konu kartımdaki adres (K18 · c) Haritalar), language=tr-TR → metinler Türkçe gelir
const API_URL = 'https://valorant-api.com/v1/maps?language=tr-TR';

export default function ListeEkrani() {
    // ---------------- 1. DURUM (STATE) ----------------
    // haritalar: API'den gelen harita listesi (başta boş dizi)
    const [haritalar, setHaritalar] = useState([]);
    // yukleniyor: veri bekleniyor mu? Ekran açılınca hemen beklediğimiz için true başlar
    const [yukleniyor, setYukleniyor] = useState(true);
    // hata: bir sorun olursa hata mesajını tutar (başta null = hata yok)
    const [hata, setHata] = useState(null);

    // ---------------- 2. VERİYİ ÇEK ----------------
    // async: içinde bekleme (await) olan fonksiyon
    const haritalariGetir = async () => {
        setYukleniyor(true);   // çark dönmeye başlasın
        setHata(null);         // eski hata varsa temizle ("Tekrar dene"de lazım)
        try {
            // API'ye istek at, cevap gelene kadar bekle
            const cevap = await fetch(API_URL);

            // Sunucu hata kodu döndürdüyse (404, 500 ...) kendimiz hata fırlatıyoruz → catch'e düşer
            if (!cevap.ok) {
                throw new Error('Sunucu hatası: ' + cevap.status);
            }

            // Gelen yazıyı JavaScript nesnesine çevir → { status: 200, data: [ ...haritalar ] }
            const json = await cevap.json();

            // KONUYA ÖZEL KURAL: görseli (displayIcon) olmayan kayıtları listeden çıkar
            // filter bir elek gibidir: koşulu sağlayanlar kalır (27 kayıt → 18 harita)
            const gorselliler = json.data.filter((harita) => harita.displayIcon);

            // Süzülmüş listeyi state'e yaz → ekran kendini yeniden çizer
            setHaritalar(gorselliler);
        } catch (e) {
            // İnternet yoksa ya da sunucu hata verdiyse buraya gelir; uygulama çökmez
            console.log(e);
            setHata('Haritalar yüklenemedi. İnterneti kontrol edin.');
        } finally {
            // Başarılı da olsa hatalı da olsa en sonda çarkı durdur
            setYukleniyor(false);
        }
    };

    // Ekran ilk açıldığında BİR KEZ veriyi çek
    // [] (boş bağımlılık dizisi) = "tekrar çalışma" demek; yazılmazsa sonsuz döngü olur
    useEffect(() => {
        haritalariGetir();
    }, []);

    // ---------------- 3. EKRAN ----------------
    // DURUM 1: Veri bekleniyorsa ortada dönen çark ve "Yükleniyor…" yazısı
    if (yukleniyor) {
        return (
            <View style={styles.orta}>
                <ActivityIndicator size="large" color="#ff4655" />
                <Text style={styles.bilgi}>Yükleniyor…</Text>
            </View>
        );
    }

    // DURUM 2: Hata varsa hata mesajı ve "Tekrar dene" düğmesi
    if (hata) {
        return (
            <View style={styles.orta}>
                <Text style={styles.hataYazi}>{hata}</Text>
                {/* Düğmeye basınca veriyi baştan çeker */}
                <Pressable style={styles.tekrarDugme} onPress={haritalariGetir}>
                    <Text style={styles.tekrarYazi}>Tekrar dene</Text>
                </Pressable>
            </View>
        );
    }

    // DURUM 3: Veri geldiyse listeyi göster
    return (
        <FlatList
            // Hangi dizi listelenecek
            data={haritalar}
            // Her satırın benzersiz anahtarı (konu kartında anahtar: uuid)
            keyExtractor={(item) => item.uuid}
            // Tek bir satırın nasıl görüneceği; item = o anki harita
            renderItem={({ item }) => (
                <View style={styles.satir}>
                    {/* İnternetten resim: adres uri ile verilir */}
                    <Image source={{ uri: item.displayIcon }} style={styles.resim} />
                    {/* Haritanın adı (displayName) */}
                    <Text style={styles.ad}>{item.displayName}</Text>
                </View>
            )}
            // Satırların arasına ince çizgi
            ItemSeparatorComponent={() => <View style={styles.ayrac} />}
        />
    );
}

// ---------------- 4. STİLLER ----------------
const styles = StyleSheet.create({
    // Yükleniyor ve hata ekranı: içeriği tam ortaya koyar
    orta: {
        flex: 1,                  // bütün alanı kapla
        alignItems: 'center',     // yatayda ortala
        justifyContent: 'center', // dikeyde ortala
        padding: 16,
    },
    // "Yükleniyor…" yazısı
    bilgi: {
        color: '#ece8e1',
        marginTop: 12,
    },
    // Hata mesajı (Valorant kırmızısı)
    hataYazi: {
        color: '#ff4655',
        textAlign: 'center',
    },
    // "Tekrar dene" düğmesi
    tekrarDugme: {
        marginTop: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,          // köşeleri yuvarla
        backgroundColor: '#ff4655',
    },
    tekrarYazi: {
        color: '#fff',
        fontWeight: 'bold',
    },
    // Liste satırı: resim ve yazı yan yana
    satir: {
        flexDirection: 'row',     // yan yana diz (varsayılan alt alta)
        alignItems: 'center',     // dikeyde hizala
        gap: 12,                  // resim ile yazı arası boşluk
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    // Harita görseli
    resim: {
        width: 64,
        height: 64,
        resizeMode: 'contain',    // resmi kesmeden kutuya sığdır
    },
    // Harita adı
    ad: {
        color: '#ece8e1',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Satır arası çizgi (soldan resim kadar boşluk bırakır)
    ayrac: {
        height: 1,
        marginLeft: 92,
        backgroundColor: '#2a3a47',
    },
});