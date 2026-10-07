# RDAT güncel içerik ve navigasyon doğrulaması

Tarih: 8 Ekim 2026 (Europe/Istanbul). Başlangıç sürümü: `origin/main` / `69d41bb`.

## Teşhis

- Proje `iyazarli/RDAT`; W&D Airsoft çalışma alanı kullanılmadı.
- SSR/hydration kullanılmıyor: statik HTML, ardından `/api/public-state` ve istemci çizimi var.
- Canlı ana sayfada API altı saniye geciktirilerek hata yeniden üretildi. İlk menü: Hakkımızda, Ekip, Saha, SSS, Takım profili, Başvur. Yanıt sonrası: Hakkımızda, Ekip, Saha, SSS, Turnuva - Organizasyon, Sponsorlarımız, Blog, Başvur.
- Ana sayfada ilk çizim koruması yoktu. Kategori/etkinlik sayfaları beklese de hata durumunda `SiteConfig.load()` ile localStorage/varsayılan verilere dönüyordu.
- Sunucu kategorileri normalleştirilirken boş listeler, eksik kategoriler ve temizlenmiş görsel/URL alanları eski örneklerle doldurulabiliyordu.
- Canlı tarayıcıda service worker kaydı yoktu. API: `Cache-Control: no-store`, `x-vercel-cache: MISS`. HTML: `public, max-age=0, must-revalidate`. Dolayısıyla saptanan ana neden CDN stale-while-revalidate değil, statik ilk çizim ve istemci fallback davranışı.
- İnceleme anındaki güncel API cevabı yaklaşık 2,64 MB JSON içeriyordu. İçerik/görseller silinmedi; ağ gecikmesi tamamen ortadan kaldırılmış sayılmaz.

## Düzeltme

- Güncel veri isteği HTML head içinde başlar; stil, font ve diğer sayfa koduyla paralel indirilir. Bir sayfa açılışında tek istek paylaşılır.
- Head içindeki ilk stil kuralı ve `inert`, ana menüyü, ana içeriği ve alt menüyü veri doğrulanana kadar hem görünmez hem etkileşimsiz tutar. Nötr, erişilebilir yükleme mesajı vardır.
- HTTP/JSON hatasında ve 15 saniyelik zaman aşımında eski veri çizilmez. Yeniden deneme sunulur. JavaScript kapalıysa eski HTML/placeholder açılmadan açık bilgi mesajı gösterilir.
- Public çizim localStorage okumaz/yazmaz. Güncel kategoriler, boş listeler ve temizlenmiş alanlar korunur; admin'in eski veri dönüştürme davranışı değiştirilmedi.
- `pagehide` sırasında içerik kapanır; BFCache `pageshow.persisted` dönüşünde tekrar doğrulanır. Önceki geç yanıt, yeni ekranı değiştiremez. İlk açılışta dinamik hash hedefi çizimden sonra konumlandırılır.
- Mobil menü dinleyicisi sonradan çizilen bağlantıları da kapsar. Uzun alt menü bağlantıları satır kırar.
- Boş ekipte eski kartlar temizlenir ve metadata güncellenir. Boş sponsor bağlantısı tahmin edilerek geri eklenmez.
- HTTP 404 dönen eski SpeedQB kaynak URL'si, aynı kuruluşun erişilebilir 2024 5v5 arşivine çizim sırasında yönlendirilir: https://www.speedqb.com/pages/speedqb-2024-season-updates . Kayıtlı yazı metni değiştirilmedi.

## Gerçekleştirilen kontroller

- `npm ci --ignore-scripts`: mevcut kilit dosyasındaki bağımlılıklar kuruldu; manifest/kilit sürümü değiştirilmedi.
- `node --test tests/*.test.js`: **31/31 geçti**.
- Değişen JavaScript dosyalarında `node --check`; `git diff --check`: geçti.
- Projede npm build script'i veya frontend derleyicisi yok. Mevcut statik yayın modeline göre HTML/CSS/JS, assets, API ve tournament-app içeren **72 dosyalık** yayın paketi hazırlandı. Dört public HTML dosyasının yerel script/stil/görsel/bağlantı hedeflerinde eksik dosya bulunmadı. Bu kontrol uzak serverless çalıştırma kanıtı değildir.
- Gerçek Chromium tarayıcısında güncel canlı API cevabının salt okunur yerel kopyasıyla **108 kontrol** geçti: 1440×900 masaüstü, 390×844 mobil; yedi kategori için menü tıklama, yenileme, geri–ileri; 12 blog ve 12 etkinliğin tüm detayları ve dönüşleri; geçersiz kategori/yazı/etkinlik; legacy highlights yönlendirmesi; #apply ve dinamik kategori çapası; takım profili mobil menüsü; API 503 → yeniden deneme.
- Altı saniyelik gecikmede her animasyon karesinde pending yüzeylerin görünürlüğü ve inert durumu izlendi; sızıntı bulunmadı. Eski localStorage sentinel'leri ekranda görünmedi ve değişmeden korundu.
- Son düzeltmelerden sonra boş takım, boş etkinlik, boş sponsor URL'si ve ana sayfa için dört ek tarayıcı kontrolü geçti. Masaüstü/mobil/1200 piksel kontrollerinde yatay taşma **0 piksel**.
- Normal yerel akışta yakalanan JavaScript istisnası, başarısız kaynak isteği ve kontrol edilen kırık iç CTA yok. Bilerek oluşturulan 503 test hatası bu sonuçtan ayrıldı. Vercel Speed Insights yerel sunucuda bulunmadığı için tarayıcı testinde boş yanıtla taklit edildi; canlı provider kanıtı olarak sayılmadı.
- 15 benzersiz dış URL kontrol edildi: sekizinde HTTP 200, altısında erişim engeli HTTP 403, birinde HTTP 404. 404 hedefi düzeltildi ve yeni hedef HTTP 200 doğrulandı. 403 sonuçları kırık URL olarak kabul edilmedi; Evike, KRYTAC ve Wolverine bağlantılarının uzak tarayıcı erişimi bu ortamda kesinleşmedi. Beş sponsorun tamamı HTTP 200 döndü.

## Çalıştırma ve beklenen davranış

```sh
npm ci --ignore-scripts
node --test tests/*.test.js
```

API destekli Vercel önizlemede `/`, `/category?slug=events`, `/category?slug=blog&post=kac-kisi` ve bir etkinlik detayını açın. Yanıt beklerken yalnızca yükleme mesajı, ardından güncel içerik görünmelidir. API engellendiğinde eski kayıt yerine yeniden deneme çıkmalıdır. Mobil menü, yenileme ve geri–ileri akışlarında eski kategori/kart görünmemelidir.

## Yayın kanıtının sınırı

Bu rapordaki kapsamlı tarayıcı sonuçları yerel değiştirilmiş uygulamaya aittir. Canlı üretimde ilk hata yeniden üretildi; değişikliğin main'e birleşmesi ve üretimde yayınlanması ayrı bir teslim adımıdır. PR/önizleme bilgisi sohbetin teslim mesajında ayrıca bildirilir. Kaynak kayıtlar, Blob verisi, localStorage ve W&D dosyaları silinmedi/değiştirilmedi.
