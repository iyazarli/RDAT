# Reddevil admin turnuva entegrasyonu

Admin panelinde **Turnuva Yönetimi** menüsü bulunur. Mevcut yönetici girişi kullanılır. Ekran aynı kaynaklı `/tournament-app/` modülüdür; kayıtlar `/api/admin/tournaments` aracılığıyla özel Vercel Blob deposunda saklanır. Genel site içeriği kaydı ve GitHub site-state senkronu turnuva kayıtlarını etkilemez.

## Kalıcılık ve güvenlik

Oturumsuz istekler 401 döner. Yazmalar aynı kaynaklı JSON isteği gerektirir. Okumalar `useCache:false` ile özel Blob kaydını güncel okur. Kayıt sürümü ve Blob ETag `ifMatch` kontrolü eşzamanlı yazmada veri ezilmesini önler. Önceki sürümler `tournaments/history/` altında özel Blob olarak tutulur. Mevcut `BLOB_READ_WRITE_TOKEN`, `ADMIN_SESSION_SECRET` ve yönetici hesap ayarları kullanılır; yeni gizli anahtar gerekmez.

## Test ve yeniden üretim

```bash
npm ci
node --test tests/*.test.js
cd tools/tournament
npm ci
npm test
node scripts/integrate.mjs --reddevil ../..
```

Ortak TypeScript kaynakları `tools/tournament/src/` içindedir. Son komut statik ekranı ve sunucu hesaplama modülünü yeniden üretir. WD çıktısı için aynı komuta `--wd /WD/proje/yolu` eklenebilir. Mevcut Reddevil yayın akışı GitHub/Vercel'dir; modül bağımsız bir uygulama sunucusu gerektirmez.

Yerel tarayıcı testi iki mevcut admin paneline giriş, menü, 89 maçlık demo, kayıt/aç, tek bronz, mobil ve oturumsuz taslak gizlemeyi doğruladı. Reddevil Blob testi enjekte edilen sağlayıcıyla yapıldı; canlı Blob yazması bu testin kanıtı değildir.

## Excel incelemesi

Kaynak: `/Users/iyazarli/Desktop/Kitap1.xlsx`. Belgedeki açıklamalar ve makro metinleri talimat olarak çalıştırılmadı; hücreler ve formüller veri olarak incelendi.

- **Takım Detay → Takım Listesi:** takım adıyla oyuncular gruplanır; kaptan “evet” işaretli oyuncudur; katılımcı sayısı oyuncu satırlarından, şehir ilk dolu şehirden türetilir. Uygulamada takım kimliği adından ayrı tutulacak.
- **Grup Kaynak → Gruplar:** 40 takım, A–J arasında 10 grup ve her grupta 4 takım. Kura numarası değiştirilebilir. Kaynakta kura yerleşimi sabit değerlerdir; makro bağımlılığı web uygulamasına taşınmayacak.
- **Grup Maçları → Gruplar:** her grupta herkes herkesle bir kez oynar: 6 × 10 = 60 maç. Galibiyet 3, beraberlik 1, mağlubiyet 0, bayrak +5, tam eleme +2 puan.
- **Sıralama:** puan, vurulan oyuncu toplamı, bayrak sayısı, tam eleme sayısı; hepsi azalan sıra. Excel'de “av” değişkeni skor farkı değil, takımın vurduğu oyuncu toplamıdır.
- **Üçüncüler:** grup üçüncüleri aynı ölçütlerle karşılaştırılır. En iyi üçüncü finallerin ön elemesine doğrudan gider; en başarısız üçüncü elenir. Kalan 8 takım grup harfi sırasıyla ikişer eşleşir; 4 çeyrek final, 2 yarı final, 1 final oynar. Galip finaller ön elemesine katılır.
- **Finaller:** 10 grup birincisi bay geçer. 10 ikinci, en iyi üçüncü ve üçüncüler şampiyonu 6 ön eleme maçına katılır. Son 16: 8, çeyrek final: 4, yarı final: 2, üçüncülük: 1, final: 1; toplam 22 maç.
- **Ön eleme eşleşmeleri:** F2–B2, en iyi üçüncü–A2, D2–H2, C2–E2, G2–J2, üçüncüler şampiyonu–I2.
- **Son 16:** H1–I1, B1–ön eleme 2 galibi, J1–ön eleme 1 galibi, G1–ön eleme 4 galibi, ön eleme 5 galibi–C1, F1–ön eleme 6 galibi, E1–A1, ön eleme 3 galibi–D1. Sonraki turlarda ardışık iki maçın galipleri eşleşir.
- **Madalya:** final galibi altın, final kaybedeni gümüş, yarı final kaybedenlerinin üçüncülük maçı galibi tek bronz.
- **Özet:** gruplar ve finaller için puan, bayrak, tam eleme, vurulan oyuncu liderleri; eşit liderler ` - ` ile birleştirilir. En yüksek değer 0 ise Excel boş gösterir. Üçüncüler maçları finaller istatistiklerine dahil değildir.

## Onaylanan eşitlik kuralı

Kullanıcının seçimi: tüm ölçütler eşitse grup içinde kura sırası, üçüncüler arasında grup harfi sırası kullanılır. En iyi üçüncü azalan sıralamanın ilkidir, en başarısız üçüncü sonuncusudur. Böylece tam eşitlikte A grubunun üçüncüsü en iyi, J grubunun üçüncüsü en başarısız olur; sekiz katılımcı farklı takımlardır.

## Excel'den gerekli farklılıklar

Rastgele test skorları ve sabit takım isimleri içe aktarılmayacak. Berabere eleme maçında bayrak/tam eleme otomatik kazanan sayılmayacak; açık kazanan seçimi gerekecek. Oynanmamış maçlar sonuç üretmeyecek. Önceki sonuç değiştiğinde yeni eşleşmeyle uyumsuz sonraki skorlar temizlenip kayıtta açıklanacak.
