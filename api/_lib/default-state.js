const DEFAULT_TEAM_PROFILES = [
  {
    id: 'team_ghost',
    name: 'Kagan',
    callsign: 'Ghost',
    title: 'Takım lideri • Oyun kurgusu',
    badge: 'Lider',
    bio: 'Senaryo akışını ve saha koordinasyonunu planlar; telsiz iletişim düzeninin oyun boyunca korunmasına destek olur.',
    expertise: 'Komuta & Entry',
    seasons: '5. sezon',
    setup: 'M4 + red dot',
    photo: 'https://images.unsplash.com/photo-1608064229007-dca149d32c4f?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'team_mamba',
    name: 'Selin',
    callsign: 'Mamba',
    title: 'Güvenlik sorumlusu • Medic eğitimi',
    badge: 'Safety',
    bio: 'Güvenlik brifingini, ilk yardım hazırlığını ve saha içi risk kontrollerini yürütür.',
    expertise: 'Medic & Safety',
    seasons: '4. sezon',
    setup: 'SMG + sidearm',
    photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'team_forge',
    name: 'Emir',
    callsign: 'Forge',
    title: 'Ekipman mentoru',
    badge: 'Tech',
    bio: 'Kronograf ve ekipman bakımı, yedek ekipman takibi ve bütçeye uygun kurulum önerilerinde destek verir.',
    expertise: 'Tech & DMR',
    seasons: '6. sezon',
    setup: 'DMR 1.64J',
    photo: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'team_spark',
    name: 'Deniz',
    callsign: 'Spark',
    title: 'Medya • Oyun sonrası değerlendirme',
    badge: 'Media',
    bio: 'Oyun görüntülerini ve seçili anları düzenler; ekip arşivinin ve oyun sonrası değerlendirme notlarının paylaşımına katkı sağlar.',
    expertise: 'Recon & Media',
    seasons: '3. sezon',
    setup: 'Carbine + action cam',
    photo: 'https://images.unsplash.com/photo-1522556189639-b150c3a2e10f?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'team_placeholder_5',
    name: 'Ad',
    callsign: 'Callsign',
    title: 'Rol - Guncelleniyor',
    badge: 'Member',
    bio: 'Oyuncu bilgileri yakin zamanda eklenecek.',
    expertise: '-',
    seasons: '-',
    setup: '-',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'team_placeholder_6',
    name: 'Ad',
    callsign: 'Callsign',
    title: 'Rol - Guncelleniyor',
    badge: 'Member',
    bio: 'Oyuncu bilgileri yakin zamanda eklenecek.',
    expertise: '-',
    seasons: '-',
    setup: '-',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'team_placeholder_7',
    name: 'Ad',
    callsign: 'Callsign',
    title: 'Rol - Guncelleniyor',
    badge: 'Member',
    bio: 'Oyuncu bilgileri yakin zamanda eklenecek.',
    expertise: '-',
    seasons: '-',
    setup: '-',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'team_placeholder_8',
    name: 'Ad',
    callsign: 'Callsign',
    title: 'Rol - Guncelleniyor',
    badge: 'Member',
    bio: 'Oyuncu bilgileri yakin zamanda eklenecek.',
    expertise: '-',
    seasons: '-',
    setup: '-',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80'
  }
];

const DEFAULT_SITE_CONFIG = {
  version: 2,
  brand: {
    logoMode: 'image',
    markText: 'RD',
    name: 'Reddevil',
    tagline: 'Airsoft Team',
    logoUrl: 'assets/brand/reddevil-logo.svg'
  },
  nav: {
    applyLabel: 'İlk oyunu sor',
    applyHref: '#apply'
  },
  home: {
    hero: {
      eyebrow: 'Eskişehir • Türkiye • Airsoft',
      titleMain: 'Reddevil Airsoft',
      titleAccent: 'Eskişehir’de Airsoft',
      lede: 'Reddevil Airsoft (RDAT), Eskişehir merkezli bir airsoft takımıdır. MilSim, fair-play ve güvenli oyun odağıyla Anadolu’daki oyuncuların katılımına açığız.',
      ctaPrimaryText: 'İlk oyunu sor',
      ctaPrimaryHref: '#apply',
      ctaSecondaryText: 'Takımı tanı',
      ctaSecondaryHref: '#about'
    },
    metrics: [
      { id: 'metric_players', value: '30+', label: 'Aktif oyuncu' },
      { id: 'metric_days', value: '12', label: 'Aylik saha gunu' },
      { id: 'metric_roles', value: '4', label: 'Rol kilavuzu' }
    ],
    operation: {
      title: 'Operasyon Profili',
      items: [
        { id: 'op_type', label: 'Oyun tipi', value: 'MilSim / SpeedQB karma' },
        { id: 'op_field', label: 'Merkez ve katılım', value: 'Eskişehir • Anadolu’ya açık' },
        { id: 'op_radio', label: 'Takim frekansi', value: 'PMR CH 6' },
        { id: 'op_priority', label: 'Oncelik', value: 'Guvenlik, disiplin, senaryo' }
      ],
      tag: 'Yeni oyuncular icin orientasyon saglanir'
    },
    about: {
      eyebrow: 'Hakkimizda',
      title: 'Sahada koordinasyon ve guvenlige odakli, butik bir airsoft ekibiyiz.',
      text: "Reddevil Airsoft (RDAT), Eskişehir merkezli bir airsoft takımıdır. MilSim ve senaryo temelli oyunlarda fair-play, güvenlik ve takım koordinasyonuna önem verir. Anadolu'daki oyuncular ilk oyun ve katılım bilgisi için ekiple iletişime geçebilir.",
      pills: [
        'Ekipman rehberi',
        'Senaryo brifing',
        'Video/Fotograf arsivi',
        'After-action review'
      ],
      criteriaTitle: 'Katilim Kriterleri',
      criteriaItems: [
        '18+ yas (18 alti icin veli onayi sart)',
        'ANSI Z87.1+ gozluk veya tam yuz maskesi',
        'Alan hakem ve kural brifinglerine uyum',
        'Kendi ulasimini saglayabilmek'
      ],
      criteriaNote: 'Kendi ekipmani olmayanlar icin sinirli yedek set mevcut.'
    },
    highlights: {
      eyebrow: 'Ne Sunuyoruz',
      title: 'Takima katildiginda seni neler bekliyor?',
      subtitle: 'Yeni baslayanlar icin hizlandirilmis adaptasyon, deneyimli oyuncular icin senaryo ve rol derinligi.',
      cards: [
        {
          id: 'hl_safety',
          title: 'Guvenlik & Disiplin',
          description: 'Oyun oncesi guvenlik brifingi, kronograf kontrolu, carpisma sonrasi ilk yardim noktasi.',
          chip: 'Oncelik #1'
        },
        {
          id: 'hl_roles',
          title: 'Rol Calismalari',
          description: "Rifleman, DMR, destek ve medic rollerinde mini drill'ler; telsiz iletisim protokolleri.",
          chip: 'Atolye'
        },
        {
          id: 'hl_gear',
          title: 'Ekipman Mentorluk',
          description: 'Butcene gore setup onerisi, saha testleri ve bakim ipuclari. Kiralik set opsiyonu.',
          chip: 'Setup'
        },
        {
          id: 'hl_media',
          title: 'Medya & Icerik',
          description: 'Oyun sonrasi secilmis foto/video paylasimi, highlight montajlari, takim arsivi.',
          chip: 'Produksiyon'
        }
      ]
    },
    team: {
      eyebrow: 'Ekip',
      title: 'Cekirdek kadro',
      subtitle: 'Her oyun oncesi oryantasyon ve saha guvenliginden sorumlu cekirdek ekip.'
    },
    field: {
      eyebrow: 'Saha & Takvim',
      title: 'Eskişehir’de MilSim ve senaryo temelli airsoft oyunları',
      subtitle: 'Reddevil Airsoft Eskişehir merkezlidir ve Anadolu’daki oyuncuların katılımına açıktır. Güncel oyun tarihi ve saha bilgisi etkinlik duyurularında paylaşılır.',
      schedule: [
        { id: 'sch_meet', label: 'Toplanma', value: '07:30 - 08:00' },
        { id: 'sch_start', label: 'Oyun baslangici', value: '09:00' },
        { id: 'sch_night', label: 'Gece oyunu', value: 'Cuma 21:00' }
      ],
      note: 'Adres ve haftalik konum bilgisi basvuru onayi sonrasi paylasilir.',
      checklistTitle: 'Hazirlik Kontrol Listesi',
      checklist: [
        'Chrono limiti: 1.14J (AEG) / 1.64J (DMR) / 2.3J (Bolt)',
        'Eye-pro yedek, kirilmaz lens',
        'Su + enerji atistirmaligi',
        'Kiyafet: woodland uyumlu, saglam ayakkabi'
      ],
      checklistNote: 'Kurallara uymayan oyuncular oyuna alinmaz.'
    },
    faq: {
      eyebrow: 'SSS',
      title: 'Sik sorulanlar',
      items: [
        {
          id: 'faq_gear',
          question: 'Kendi ekipmanim yok, katilabilir miyim?',
          answer: 'Evet, sinirli sayida yedek setimiz var. Temel gozluk/maske zorunlu. Kiralik set icin basvuru formunda belirt.'
        },
        {
          id: 'faq_training',
          question: 'Yeni baslayanlar icin egitim var mi?',
          answer: 'Ilk oyundan once guvenlik brifingi, temel silah tutusu, kronograf ve iletisim protokolu saglanir.'
        },
        {
          id: 'faq_age',
          question: 'Yas siniri nedir?',
          answer: '18 yas ve uzeri. 16-17 icin yazili veli onayi ve saha onayi gerekir.'
        },
        {
          id: 'faq_fee',
          question: 'Uyelik ucreti var mi?',
          answer: 'Aidat yok. Oyun/organizasyon ucretleri sahaya gore paylasiliyor; ozel etkinliklerde on odeme alinabilir.'
        }
      ]
    },
    apply: {
      eyebrow: 'Basvuru',
      title: 'Takima katilmak icin formu doldur',
      subtitle: 'Basvurunuz incelendikten sonra e-posta veya Instagram uzerinden sizinle iletisime gecilecektir.'
    },
    footer: {
      blurb: 'Guvenli, disiplinli ve eglenceli airsoft deneyimi. Basvurular inceleme sonrasi e-posta ile yanitlanir.',
      instagram: '@reddevil.airsoft',
      email: 'team@reddevilairsoft.com',
      quickTags: [
        'Guvenlik odakli',
        'Duzenli etkinlik',
        'Acik basvuru'
      ]
    }
  },
  categories: [
    {
      id: 'cat_about',
      slug: 'about',
      label: 'Hakkımızda',
      showInMenu: true,
      eyebrow: 'TAKIM KÜLTÜRÜ',
      title: 'Güvenli oyun, birlikte gelişim.',
      intro: 'Reddevil; fair-play’i, açık iletişimi ve saha güvenliğini önceleyen bir airsoft ekibi. Yeni oyuncularla ilk oyun hazırlığını, ekipman listesini ve rol seçeneklerini birlikte gözden geçiririz.',
      ctaLabel: 'İlk oyunu konuşalım',
      ctaHref: 'index.html#apply',
      blocks: [
        {
          id: 'cat_about_block_1',
          title: 'Güvenlik ve fair-play',
          text: 'Her oyun güvenlik brifingi ve saha kurallarıyla başlar. Oyunculardan kararları açıkça paylaşmaları, saha yönlendirmelerine uymaları ve karşılıklı saygıyı korumaları beklenir.',
          tag: 'Güvenlik',
          imageUrl: 'https://images.unsplash.com/photo-1520975878803-a3b0f5f58f92?auto=format&fit=crop&w=1400&q=80'
        },
        {
          id: 'cat_about_block_2',
          title: 'İlk oyuna birlikte hazırlan',
          text: 'Ekipman listesi, oyun akışı ve rol seçenekleri ilk buluşmadan önce konuşulur. Sınırlı yedek ekipman olanağı ve uygunluk başvuru sırasında netleştirilir.',
          tag: 'Yeni oyuncular',
          imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1400&q=80'
        }
      ]
    },
    {
      id: 'cat_team',
      slug: 'team',
      label: 'Ekip',
      showInMenu: true,
      eyebrow: 'ÇEKİRDEK KADRO',
      title: 'Her rol, ortak bir oyuna katkı sağlar.',
      intro: 'Oyun kurgusu, güvenlik, ekipman ve medya sorumlulukları çekirdek kadro içinde paylaşılır. Profil kartlarında ekip üyelerinin görev alanlarını ve uzmanlıklarını tanıyabilirsin.',
      ctaLabel: 'İlk oyunu konuşalım',
      ctaHref: 'index.html#apply',
      blocks: [
        {
          id: 'cat_team_block_1',
          title: 'Oyun kurgusu ve koordinasyon',
          text: 'Senaryo akışı, saha planı ve telsiz iletişimi ekip içindeki liderlik görevlerinin parçasıdır.',
          tag: 'Koordinasyon',
          imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1400&q=80'
        },
        {
          id: 'cat_team_block_2',
          title: 'Güvenlik ve saha hazırlığı',
          text: 'Güvenlik brifingi, saha içi risk kontrolü ve ilk yardım hazırlığı oyun öncesi planın parçasıdır.',
          tag: 'Güvenlik',
          imageUrl: 'https://images.unsplash.com/photo-1582719478170-5f6895d2f5f4?auto=format&fit=crop&w=1400&q=80'
        }
      ]
    },
    {
      id: 'cat_field',
      slug: 'field',
      label: 'Saha',
      showInMenu: true,
      eyebrow: 'SAHA VE OYUN AKIŞI',
      title: 'Her saha için doğru hazırlık.',
      intro: 'Woodland, CQB ve gece oyunlarında hazırlık ve oyun akışı değişebilir. Takvim ve katılım bilgileri duyuruda paylaşılır; kesin konum, katılım onayından sonra iletilir.',
      ctaLabel: 'Saha ve takvimi gör',
      ctaHref: 'index.html#field',
      blocks: [
        {
          id: 'cat_field_block_1',
          title: 'Woodland • Açık arazi',
          text: 'Görüş mesafesi, arazi ve senaryo akışı woodland oyunlarının hazırlığını belirler. Brifingde saha sınırları ve güvenlik kuralları netleştirilir.',
          tag: 'Woodland',
          imageUrl: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=80'
        },
        {
          id: 'cat_field_block_2',
          title: 'CQB ve gece oyunları',
          text: 'Yakın mesafe veya düşük ışık düzeninde hareket disiplini ve net iletişim öne çıkar. Etkinliğe özel hazırlık bilgileri duyuruda paylaşılır.',
          tag: 'CQB',
          imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80'
        }
      ]
    },
    {
      id: 'cat_faq',
      slug: 'faq',
      label: 'SSS',
      showInMenu: true,
      eyebrow: 'KATILIM ÖNCESİ',
      title: 'İlk oyunla ilgili merak edilenler',
      intro: 'Katılım, ekipman ve güvenlik hakkında kısa yanıtlar. Tarih, saha ve organizasyon ücreti gibi etkinlik ayrıntıları duyuruda ayrıca paylaşılır.',
      ctaLabel: 'Başvuruya geç',
      ctaHref: 'index.html#apply',
      blocks: [
        {
          id: 'cat_faq_block_1',
          title: 'İlk kez katılabilir miyim?',
          text: 'Evet. İlk oyun öncesinde güvenlik brifingi, temel ekipman ve oyun akışı hakkında bilgilendirme yapılır.',
          tag: 'Katılım',
          imageUrl: ''
        },
        {
          id: 'cat_faq_block_2',
          title: 'Kendi ekipmanım yoksa?',
          text: 'Sınırlı sayıda yedek set bulunur. Temel gözlük veya maske zorunludur; ekipman ihtiyacını başvuruda belirt.',
          tag: 'Ekipman',
          imageUrl: ''
        },
        {
          id: 'cat_faq_block_3',
          title: 'Yaş sınırı nedir?',
          text: 'Genel katılım yaşı 18+’dır. 16–17 yaş aralığında yazılı veli izni ve saha onayı gerekir.',
          tag: 'Yaş',
          imageUrl: ''
        },
        {
          id: 'cat_faq_block_4',
          title: 'Düzenli aidat alınıyor mu?',
          text: 'Aidat yok. Oyun ve organizasyon ücretleri sahaya göre değişir; özel etkinliklerde ön ödeme istenebilir.',
          tag: 'Ücret',
          imageUrl: ''
        },
        {
          id: 'cat_faq_block_5',
          title: 'Güvenlik brifingi zorunlu mu?',
          text: 'Evet. Oyuna çıkmadan önce saha kuralları ve güvenlik brifingine uyulması gerekir.',
          tag: 'Güvenlik',
          imageUrl: ''
        },
        {
          id: 'cat_faq_block_6',
          title: 'Adres ve konum ne zaman paylaşılır?',
          text: 'Adres ve haftalık konum bilgisi başvuru onayından sonra paylaşılır.',
          tag: 'Konum',
          imageUrl: ''
        }
      ]
    },
    {
      id: 'cat_events',
      slug: 'events',
      label: 'Etkinlik Fotolari',
      showInMenu: true,
      eyebrow: 'Kategori',
      title: 'Etkinlik Fotograflari',
      intro: 'Katilinan oyunlardan ve organizasyonlardan secilmis anlar.',
      ctaLabel: 'Basvuruya Gec',
      ctaHref: 'index.html#apply',
      blocks: [
        {
          id: 'cat_events_block_1',
          title: 'Woodland Gunu | Ocak 2026',
          text: 'Sabah sisli sahada 4 takimli bayrak senaryosu oynandi. 32 oyuncu katildi.',
          tag: 'Woodland',
          imageUrl: 'https://images.unsplash.com/photo-1504039268625-5f3f6f7f2f53?auto=format&fit=crop&w=1600&q=80',
          gallery: [
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80'
          ]
        },
        {
          id: 'cat_events_block_2',
          title: 'CQB Gece Operasyonu',
          text: 'Kapali alanda dusuk isikta role dayali mini-milsim gorevleri uygulandi.',
          tag: 'CQB',
          imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80',
          gallery: [
            'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1509824227185-9c5a01ceba0d?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80'
          ]
        },
        {
          id: 'cat_events_block_3',
          title: 'Takim Drill Atolyesi',
          text: 'Telsiz disiplin, stack giris ve medic tahliye protokolleri tekrarlandi.',
          tag: 'Atolye',
          imageUrl: 'https://images.unsplash.com/photo-1529651737248-dad5e287768e?auto=format&fit=crop&w=1600&q=80',
          gallery: [
            'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?auto=format&fit=crop&w=1600&q=80'
          ]
        },
        {
          id: 'cat_events_block_4',
          title: 'Orman Senaryosu | Kocaeli',
          text: 'Uzun mesafe devriye ve lojistik gorevleri iceren 6 saatlik oyun oturumu.',
          tag: 'MilSim',
          imageUrl: 'https://images.unsplash.com/photo-1519669417670-68775a50919c?auto=format&fit=crop&w=1600&q=80',
          gallery: [
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1600&q=80',
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80'
          ]
        }
      ]
    },
    {
      id: 'cat_sponsors',
      slug: 'sponsors',
      label: 'Sponsorlarimiz',
      showInMenu: true,
      eyebrow: 'Partnerler',
      title: 'Sahadaki Guclu Partnerlerimiz',
      intro: 'Takimimizi ekipman, organizasyon ve topluluk is birlikleriyle destekleyen sponsor markalar.',
      ctaLabel: 'Basvuruya Gec',
      ctaHref: 'index.html#apply',
      blocks: [
        {
          id: 'cat_sponsors_block_1',
          title: 'Izmir Av Market',
          text: 'Airsoft ve outdoor ekipman tedarik destegi.',
          tag: 'Sponsor',
          imageUrl: 'assets/sponsors/izmiravmarket.png',
          url: 'https://izmiravmarket.com'
        },
        {
          id: 'cat_sponsors_block_2',
          title: 'Vector Optics',
          text: 'Optik sistemler ve saha gorus ekipmanlari.',
          tag: 'Sponsor',
          imageUrl: 'assets/sponsors/vector-optics.svg',
          url: 'https://www.vectoroptics.com'
        },
        {
          id: 'cat_sponsors_block_3',
          title: 'ISG Airsoft',
          text: 'Airsoft platformlari ve etkinlik katkisi.',
          tag: 'Sponsor',
          imageUrl: 'assets/sponsors/isgairsoft.png',
          url: 'https://isgairsoft.com'
        },
        {
          id: 'cat_sponsors_block_4',
          title: 'Armorion',
          text: 'Koruyucu ekipman ve taktik aksesuar destegi.',
          tag: 'Sponsor',
          imageUrl: 'assets/sponsors/armorion.png',
          url: 'https://www.armorion.com'
        },
        {
          id: 'cat_sponsors_block_5',
          title: 'Poligun Store',
          text: 'Yerel ekipman tedarik ve saha is birligi.',
          tag: 'Sponsor',
          imageUrl: 'assets/sponsors/poligunstore.png',
          url: 'https://poligunstore.com'
        }
      ]
    }
  ]
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createDefaultState() {
  const now = new Date().toISOString();
  return {
    applications: [],
    teamProfiles: clone(DEFAULT_TEAM_PROFILES),
    siteConfig: clone(DEFAULT_SITE_CONFIG),
    telemetry: {
      errors: [],
      lastSubmissionAt: '',
      totalSubmissions: 0
    },
    meta: {
      createdAt: now,
      updatedAt: now
    }
  };
}

module.exports = {
  DEFAULT_TEAM_PROFILES,
  DEFAULT_SITE_CONFIG,
  createDefaultState,
  clone
};
