const DEFAULT_TEAM_PROFILES = require('../../rdat-language').apply(require('../../rdat-team').profiles);

let DEFAULT_SITE_CONFIG = {
  version: 2,
  brand: {
    logoMode: 'image',
    markText: 'RD',
    name: 'Red Devil',
    tagline: 'Airsoft Team',
    logoUrl: 'assets/brand/reddevil-logo.svg'
  },
  nav: {
    applyLabel: 'Basvur',
    applyHref: '#apply'
  },
  home: {
    hero: {
      eyebrow: 'Taktik disiplin • Guvenli oyun • Gercek ekip ruhu',
      titleMain: 'Red Devil Airsoft',
      titleAccent: 'Sahada Goruselim',
      lede: 'Marmara bolgesinde aktif sahalarda oynayan, takim koordinasyonuna ve guvenlige onem veren bir airsoft topluluguyuz. Yeni oyunculara egitim, ekipman rehberi ve rol calismalari sunuyoruz.',
      ctaPrimaryText: 'Takima Katil',
      ctaPrimaryHref: '#apply',
      ctaSecondaryText: 'Takimi Tani',
      ctaSecondaryHref: 'category.html?slug=about'
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
        { id: 'op_field', label: 'Ana saha', value: 'Istanbul & Kocaeli woodland' },
        { id: 'op_radio', label: 'Takim frekansi', value: 'PMR CH 6' },
        { id: 'op_priority', label: 'Oncelik', value: 'Guvenlik, disiplin, senaryo' }
      ],
      tag: 'Yeni oyuncular icin orientasyon saglanir'
    },
    about: {
      eyebrow: 'Hakkimizda',
      title: 'Sahada koordinasyon ve guvenlige odakli, butik bir airsoft ekibiyiz.',
      text: "Red Devil; cesitli saha tiplerinde (CQB, woodland, endustriyel) duzenli olarak oynayan, fair-play kurallarina sadik, guvenligi onceleyen bir takimdi. Yeni katilimcilara temel guvenlik egitimi, ekipman checklist'i ve rol denemesi saglar.",
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
      title: 'Istanbul / Kocaeli woodland ve donemsel CQB organizasyonlari',
      subtitle: 'Aylik takvim: her ay 2 woodland, 1 CQB, 1 gece oyunu. Ozel etkinlikler icin haftaici atolye duyurulari.',
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
      label: 'Hakkimizda',
      showInMenu: true,
      eyebrow: 'Kategori',
      title: 'Red Devil Hakkinda',
      intro: 'Takim kulturumuz disiplin, guvenlik ve surekli gelisim odaklidir.',
      ctaLabel: 'Basvuru Formuna Git',
      ctaHref: 'index.html#apply',
      blocks: [
        {
          id: 'cat_about_block_1',
          title: 'Takim Felsefesi',
          text: 'Fair-play, guvenlik ve iletisim protokolu oyunun merkezindedir.',
          tag: 'Kultur',
          imageUrl: 'https://images.unsplash.com/photo-1520975878803-a3b0f5f58f92?auto=format&fit=crop&w=1400&q=80'
        },
        {
          id: 'cat_about_block_2',
          title: 'Ogrenme Ortami',
          text: 'Yeni oyuncular orientation ve mentor destegi ile sahaya adapte edilir.',
          tag: 'Egitim',
          imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1400&q=80'
        }
      ]
    },
    {
      id: 'cat_highlights',
      slug: 'highlights',
      label: 'Ne Sunuyoruz',
      showInMenu: true,
      eyebrow: 'Kategori',
      title: 'Takimin Sunduğu Deneyim',
      intro: 'Hem yeni baslayanlar hem deneyimli oyuncular icin yapilandirilmis akislar.',
      ctaLabel: 'Ekibe Katil',
      ctaHref: 'index.html#apply',
      blocks: [
        {
          id: 'cat_highlights_block_1',
          title: 'Rol Drillleri',
          text: 'Rifleman, DMR, destek ve medic rollerinde mini senaryo calismalari.',
          tag: 'Taktik',
          imageUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=1400&q=80'
        },
        {
          id: 'cat_highlights_block_2',
          title: 'Ekipman Mentorlugu',
          text: 'Butceye uygun setup secimi, kronograf ve bakim destegi.',
          tag: 'Setup',
          imageUrl: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?auto=format&fit=crop&w=1400&q=80'
        }
      ]
    },
    {
      id: 'cat_team',
      slug: 'team',
      label: 'Ekip',
      showInMenu: true,
      eyebrow: 'Kategori',
      title: 'Cekirdek Kadro',
      intro: 'Oyun guvenligi, kurgu ve operasyon surecini yoneten cekirdek ekip.',
      ctaLabel: 'Takimi Incele',
      ctaHref: 'index.html#team',
      blocks: [
        {
          id: 'cat_team_block_1',
          title: 'Liderlik',
          text: 'Senaryo, saha planlamasi ve frekans koordinasyonu lider ekip tarafindan yonetilir.',
          tag: 'Komuta',
          imageUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1400&q=80'
        },
        {
          id: 'cat_team_block_2',
          title: 'Safety Officer',
          text: 'Her etkinlikte guvenlik protokollerini denetleyen sorumlu bulunur.',
          tag: 'Safety',
          imageUrl: 'https://images.unsplash.com/photo-1582719478170-5f6895d2f5f4?auto=format&fit=crop&w=1400&q=80'
        }
      ]
    },
    {
      id: 'cat_field',
      slug: 'field',
      label: 'Saha',
      showInMenu: true,
      eyebrow: 'Kategori',
      title: 'Saha ve Takvim',
      intro: 'Woodland, CQB ve gece oyunlari icin surekli guncellenen takvim.',
      ctaLabel: 'Takvimi Ogren',
      ctaHref: 'index.html#field',
      blocks: [
        {
          id: 'cat_field_block_1',
          title: 'Woodland Operasyonlari',
          text: 'Aylik duzende woodland agirlikli oyunlar ile uzun mesafe koordinasyon calisilir.',
          tag: 'Outdoor',
          imageUrl: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=80'
        },
        {
          id: 'cat_field_block_2',
          title: 'CQB ve Gece Oyunu',
          text: 'Yakin mesafe refleks, iletisim ve takim hareketi odakli etkinlikler yapilir.',
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
      eyebrow: 'Kategori',
      title: 'Sik Sorulan Sorular',
      intro: 'Katilim, ekipman ve oyun kurallariyla ilgili temel yanitlar.',
      ctaLabel: 'Basvuruya Gec',
      ctaHref: 'index.html#apply',
      blocks: [
        {
          id: 'cat_faq_block_1',
          title: 'Ekipman',
          text: 'Yedek ekipman sinirli sayida mevcuttur; temel goz koruma zorunludur.',
          tag: 'Hazirlik',
          imageUrl: 'https://images.unsplash.com/photo-1511882150382-421056c89033?auto=format&fit=crop&w=1400&q=80'
        },
        {
          id: 'cat_faq_block_2',
          title: 'Yas ve Kurallar',
          text: '18+ onceliklidir; tum oyuncular guvenlik brifingine katilmak zorundadir.',
          tag: 'Kurallar',
          imageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80'
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

DEFAULT_SITE_CONFIG = require('../../rdat-about').apply(DEFAULT_SITE_CONFIG, true);

DEFAULT_SITE_CONFIG = require('../../rdat-language').apply(require('../../blog-content').apply(DEFAULT_SITE_CONFIG));

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
