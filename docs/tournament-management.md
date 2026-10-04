# Turnuva yönetimi

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

## Kurulum ve çalıştırma

Node.js 24 gereklidir (doğrulanan sürüm: 24.14.0). SQLite için Node'un yerleşik `node:sqlite` modülü kullanılır; ek veritabanı kurulumu gerekmez.

```bash
npm ci
npm run build
npm start
```

Uygulama: http://127.0.0.1:4317. Geliştirme: `npm run dev` ardından http://127.0.0.1:5173. Sunucu yalnızca yerel bilgisayardan erişilir; internet yayını veya çok kullanıcılı kimlik doğrulama bu teslimin kapsamına dahil değildir.

## Testler

```bash
npm test
npx playwright install chromium
npm run test:e2e
```

Tarayıcı testi için önce `npm run build` ve ayrı terminalde `npm start` çalışmalıdır. Bilgisayarda Google Chrome varsa alternatif: `BROWSER_CHANNEL=chrome npm run test:e2e`. Test ayrı ve açıkça demo olarak işaretlenen 89 maçlık bir turnuva oluşturur ve kaydeder. Masaüstü/mobil kanıt görüntüleri `evidence/` dizinine yazılır.

23 otomatik test puanlama, her sıralama ölçütü, tam eşitlik, üçüncüler seçimi, her tur aktarımı, beraberlik seçimi, üçüncülük sırası, tek bronz, madalyalar, lider eşitlikleri, düzeltme zinciri, veri doğrulama, SQLite kayıt/açma, süreç yeniden başlatma ve kayıt çakışmasını kapsar. Tarayıcı testi takım/oyuncu/kaptan girişi, demo, 60/7/22 maç, kayıt/açma, beraberlik/düzeltme ve 390 px mobil görünümü denetler.

## Kayıt ve düzeltme

- **Kaydet:** tüm takımları, kurayı, maçları ve kayıt geçmişini SQLite'a kaydeder. Varsayılan veritabanı `data/turnuvalar.sqlite`.
- **Taslak:** değişiklikler ayrıca tarayıcıda tutulur; arayüz kaydedilmemiş değişikliği bildirir. Kalıcı kayıt için Kaydet düğmesini kullanın.
- **Tekrar aç:** üstteki kayıt listesinden turnuvayı seçin. Dışa aktar/Dosyadan aç ile JSON yedeği taşınabilir; içe aktarılan dosya ayrı bir turnuva olur.
- **Kayıt çakışması:** eski bir sekme güncel kaydı sessizce ezemez; sunucu sürüm kontrolüyle reddeder. Taslağı dışa aktarıp güncel kaydı açın.
- **Düzeltme:** önceki sonuç değişince yeni katılımcılar hesaplanır. Eşleşmesi değişen maçların tüm sonuç alanları temizlenir; etkilenmeyen sonuçlar korunur. Arayüz temizlenecek maç sayısıyla onay ister ve geçmişe kaydeder. Önceki kayıt sürümleri ayrıca SQLite `history` tablosunda tutulur.
- **Kura:** takım kimlikleri sıralanır ve seed ile deterministik Fisher–Yates karıştırması uygulanır. Aynı takım kimlikleri ve seed aynı grupları üretir. Aynı kura yeniden istendiğinde sonuçlar korunur; değişen kura sonuç varsa onay ister.
- **Boş maçlar:** iki skor olmadan bonus/istatistik hesaplanmaz. Elemede beraberlik, açık kazanan seçilene kadar bekler. Grup katılımcıları 60 maçın tamamından sonra kesinleşir.
- **Takım silme:** kura ve sonuçları sıfırlayacağı açıkça bildirilip onay istenir. Takım adının veya oyuncuların düzenlenmesi kimlikleri ve maç sonuçlarını değiştirmez.
- **Demo:** ayrı kayıt olarak açılır; Excel test skorları kullanılmaz. Sayfadaki DEMO işareti kaydedilir ve yeniden açılınca korunur.

## Mimari ve dosyalar

`src/engine.ts` saf turnuva hesapları ve doğrulama; `src/main.tsx` Türkçe yönetim arayüzü; `src/style.css` mobil/masaüstü düzen; `server/index.ts` SQLite API ve üretim dosyaları; `tests/engine.test.ts` turnuva testleri; `tests/server.test.ts` kalıcılık testleri; `tests/browser.mjs` uçtan uca tarayıcı testi. `package.json`, kilit dosyası, `tsconfig.json`, `vite.config.ts`, `index.html` kurulum ve derlemeyi tanımlar.
