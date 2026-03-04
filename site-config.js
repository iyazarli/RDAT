(function initSiteConfig(global) {
  const STORAGE_KEY = 'reddevil_site_config';
  const LEGACY_CONTENT_KEY = 'reddevil_site_content';

  const DEFAULT_SITE_CONFIG = {
    version: 2,
    brand: {
      logoMode: 'text',
      markText: 'RD',
      name: 'Reddevil',
      tagline: 'Airsoft Team',
      logoUrl: '',
    },
    nav: {
      applyLabel: 'Basvur',
      applyHref: '#apply',
    },
    home: {
      hero: {
        eyebrow: 'Taktik disiplin • Guvenli oyun • Gercek ekip ruhu',
        titleMain: 'Reddevil Airsoft',
        titleAccent: 'Sahada Goruselim',
        lede: 'Marmara bolgesinde aktif sahalarda oynayan, takim koordinasyonuna ve guvenlige onem veren bir airsoft topluluguyuz. Yeni oyunculara egitim, ekipman rehberi ve rol calismalari sunuyoruz.',
        ctaPrimaryText: 'Takima Katil',
        ctaPrimaryHref: '#apply',
        ctaSecondaryText: 'Takimi Tani',
        ctaSecondaryHref: 'category.html?slug=about',
      },
      metrics: [
        { id: 'metric_players', value: '30+', label: 'Aktif oyuncu' },
        { id: 'metric_days', value: '12', label: 'Aylik saha gunu' },
        { id: 'metric_roles', value: '4', label: 'Rol kilavuzu' },
      ],
      operation: {
        title: 'Operasyon Profili',
        items: [
          { id: 'op_type', label: 'Oyun tipi', value: 'MilSim / SpeedQB karma' },
          { id: 'op_field', label: 'Ana saha', value: 'Istanbul & Kocaeli woodland' },
          { id: 'op_radio', label: 'Takim frekansi', value: 'PMR CH 6' },
          { id: 'op_priority', label: 'Oncelik', value: 'Guvenlik, disiplin, senaryo' },
        ],
        tag: 'Yeni oyuncular icin orientasyon saglanir',
      },
      about: {
        eyebrow: 'Hakkimizda',
        title: 'Sahada koordinasyon ve guvenlige odakli, butik bir airsoft ekibiyiz.',
        text: "Reddevil; cesitli saha tiplerinde (CQB, woodland, endustriyel) duzenli olarak oynayan, fair-play kurallarina sadik, guvenligi onceleyen bir takimdi. Yeni katilimcilara temel guvenlik egitimi, ekipman checklist'i ve rol denemesi saglar.",
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
            chip: 'Oncelik #1',
          },
          {
            id: 'hl_roles',
            title: 'Rol Calismalari',
            description: "Rifleman, DMR, destek ve medic rollerinde mini drill'ler; telsiz iletisim protokolleri.",
            chip: 'Atolye',
          },
          {
            id: 'hl_gear',
            title: 'Ekipman Mentorluk',
            description: 'Butcene gore setup onerisi, saha testleri ve bakim ipuclari. Kiralik set opsiyonu.',
            chip: 'Setup',
          },
          {
            id: 'hl_media',
            title: 'Medya & Icerik',
            description: 'Oyun sonrasi secilmis foto/video paylasimi, highlight montajlari, takim arsivi.',
            chip: 'Produksiyon',
          },
        ],
      },
      team: {
        eyebrow: 'Ekip',
        title: 'Cekirdek kadro',
        subtitle: 'Her oyun oncesi oryantasyon ve saha guvenliginden sorumlu cekirdek ekip.',
      },
      field: {
        eyebrow: 'Saha & Takvim',
        title: 'Istanbul / Kocaeli woodland ve donemsel CQB organizasyonlari',
        subtitle: 'Aylik takvim: her ay 2 woodland, 1 CQB, 1 gece oyunu. Ozel etkinlikler icin haftaici atolye duyurulari.',
        schedule: [
          { id: 'sch_meet', label: 'Toplanma', value: '07:30 - 08:00' },
          { id: 'sch_start', label: 'Oyun baslangici', value: '09:00' },
          { id: 'sch_night', label: 'Gece oyunu', value: 'Cuma 21:00' },
        ],
        note: 'Adres ve haftalik konum bilgisi basvuru onayi sonrasi paylasilir.',
        checklistTitle: 'Hazirlik Kontrol Listesi',
        checklist: [
          'Chrono limiti: 1.14J (AEG) / 1.64J (DMR) / 2.3J (Bolt)',
          'Eye-pro yedek, kirilmaz lens',
          'Su + enerji atistirmaligi',
          'Kiyafet: woodland uyumlu, saglam ayakkabi',
        ],
        checklistNote: 'Kurallara uymayan oyuncular oyuna alinmaz.',
      },
      faq: {
        eyebrow: 'SSS',
        title: 'Sik sorulanlar',
        items: [
          {
            id: 'faq_gear',
            question: 'Kendi ekipmanim yok, katilabilir miyim?',
            answer: 'Evet, sinirli sayida yedek setimiz var. Temel gozluk/maske zorunlu. Kiralik set icin basvuru formunda belirt.',
          },
          {
            id: 'faq_training',
            question: 'Yeni baslayanlar icin egitim var mi?',
            answer: 'Ilk oyundan once guvenlik brifingi, temel silah tutusu, kronograf ve iletisim protokolu saglanir.',
          },
          {
            id: 'faq_age',
            question: 'Yas siniri nedir?',
            answer: '18 yas ve uzeri. 16-17 icin yazili veli onayi ve saha onayi gerekir.',
          },
          {
            id: 'faq_fee',
            question: 'Uyelik ucreti var mi?',
            answer: 'Aidat yok. Oyun/organizasyon ucretleri sahaya gore paylasiliyor; ozel etkinliklerde on odeme alinabilir.',
          },
        ],
      },
      apply: {
        eyebrow: 'Basvuru',
        title: 'Takima katilmak icin formu doldur',
        subtitle: 'Form verisi varsayilan olarak tarayiciya kaydedilir. Gercek teslim icin script.js icindeki FORM_ENDPOINT degerini kendi webhook/e-posta form hizmetinle guncelle.',
      },
      footer: {
        blurb: 'Guvenli, disiplinli ve eglenceli airsoft deneyimi. Basvurular inceleme sonrasi e-posta ile yanitlanir.',
        instagram: '@reddevil.airsoft',
        email: 'team@reddevil.local',
      },
    },
    categories: [
      {
        id: 'cat_about',
        slug: 'about',
        label: 'Hakkimizda',
        showInMenu: true,
        eyebrow: 'Kategori',
        title: 'Reddevil Hakkinda',
        intro: 'Takim kulturumuz disiplin, guvenlik ve surekli gelisim odaklidir.',
        ctaLabel: 'Basvuru Formuna Git',
        ctaHref: 'index.html#apply',
        blocks: [
          {
            id: 'cat_about_block_1',
            title: 'Takim Felsefesi',
            text: 'Fair-play, guvenlik ve iletisim protokolu oyunun merkezindedir.',
            tag: 'Kultur',
          },
          {
            id: 'cat_about_block_2',
            title: 'Ogrenme Ortami',
            text: 'Yeni oyuncular orientation ve mentor destegi ile sahaya adapte edilir.',
            tag: 'Egitim',
          },
        ],
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
          },
          {
            id: 'cat_highlights_block_2',
            title: 'Ekipman Mentorlugu',
            text: 'Bütceye uygun setup secimi, kronograf ve bakim destegi.',
            tag: 'Setup',
          },
        ],
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
          },
          {
            id: 'cat_team_block_2',
            title: 'Safety Officer',
            text: 'Her etkinlikte guvenlik protokollerini denetleyen sorumlu bulunur.',
            tag: 'Safety',
          },
        ],
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
          },
          {
            id: 'cat_field_block_2',
            title: 'CQB ve Gece Oyunu',
            text: 'Yakın mesafe refleks, iletişim ve takım hareketi odakli etkinlikler yapilir.',
            tag: 'CQB',
          },
        ],
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
          },
          {
            id: 'cat_faq_block_2',
            title: 'Yas ve Kurallar',
            text: '18+ onceliklidir; tum oyuncular guvenlik brifingine katilmak zorundadir.',
            tag: 'Kurallar',
          },
        ],
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
          },
          {
            id: 'cat_events_block_2',
            title: 'CQB Gece Operasyonu',
            text: 'Kapali alanda dusuk isikta role dayali mini-milsim gorevleri uygulandi.',
            tag: 'CQB',
            imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80',
          },
          {
            id: 'cat_events_block_3',
            title: 'Takim Drill Atolyesi',
            text: 'Telsiz disiplin, stack giris ve medic tahliye protokolleri tekrarlandi.',
            tag: 'Atolye',
            imageUrl: 'https://images.unsplash.com/photo-1529651737248-dad5e287768e?auto=format&fit=crop&w=1600&q=80',
          },
          {
            id: 'cat_events_block_4',
            title: 'Orman Senaryosu | Kocaeli',
            text: 'Uzun mesafe devriye ve lojistik gorevleri iceren 6 saatlik oyun oturumu.',
            tag: 'MilSim',
            imageUrl: 'https://images.unsplash.com/photo-1519669417670-68775a50919c?auto=format&fit=crop&w=1600&q=80',
          },
        ],
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
            url: 'https://izmiravmarket.com',
          },
          {
            id: 'cat_sponsors_block_2',
            title: 'Vector Optics',
            text: 'Optik sistemler ve saha gorus ekipmanlari.',
            tag: 'Sponsor',
            imageUrl: 'assets/sponsors/vector-optics.svg',
            url: 'https://www.vectoroptics.com',
          },
          {
            id: 'cat_sponsors_block_3',
            title: 'ISG Airsoft',
            text: 'Airsoft platformlari ve etkinlik katkisi.',
            tag: 'Sponsor',
            imageUrl: 'assets/sponsors/isgairsoft.png',
            url: 'https://isgairsoft.com',
          },
          {
            id: 'cat_sponsors_block_4',
            title: 'Armorion',
            text: 'Koruyucu ekipman ve taktik aksesuar destegi.',
            tag: 'Sponsor',
            imageUrl: 'assets/sponsors/armorion.png',
            url: 'https://www.armorion.com',
          },
          {
            id: 'cat_sponsors_block_5',
            title: 'Poligun Store',
            text: 'Yerel ekipman tedarik ve saha is birligi.',
            tag: 'Sponsor',
            imageUrl: 'assets/sponsors/poligunstore.png',
            url: 'https://poligunstore.com',
          },
        ],
      },
    ],
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function safeParse(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function uid(prefix) {
    if (global.crypto && global.crypto.randomUUID) {
      return `${prefix}_${global.crypto.randomUUID()}`;
    }
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  function text(value, fallback = '') {
    if (typeof value !== 'string') return fallback;
    const trimmed = value.trim();
    return trimmed || fallback;
  }

  function slugify(value, fallback = 'category') {
    const raw = text(value, fallback)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return raw || fallback;
  }

  function plainKey(value) {
    return text(value, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');
  }

  function normalizeMetric(item, index = 0) {
    return {
      id: text(item && item.id, `metric_${index + 1}`),
      value: text(item && item.value, String(index + 1)),
      label: text(item && item.label, 'Metric'),
    };
  }

  function normalizeOperationItem(item, index = 0) {
    return {
      id: text(item && item.id, `op_${index + 1}`),
      label: text(item && item.label, 'Baslik'),
      value: text(item && item.value, 'Deger'),
    };
  }

  function normalizeHighlightCard(item, index = 0) {
    return {
      id: text(item && item.id, `hl_${index + 1}`),
      title: text(item && item.title, `Kart ${index + 1}`),
      description: text(item && item.description, ''),
      chip: text(item && item.chip, 'Etiket'),
    };
  }

  function normalizeFaqItem(item, index = 0) {
    return {
      id: text(item && item.id, `faq_${index + 1}`),
      question: text(item && item.question, `Soru ${index + 1}`),
      answer: text(item && item.answer, ''),
    };
  }

  function normalizeCategoryBlock(item, index = 0) {
    return {
      id: text(item && item.id, `block_${index + 1}`),
      title: text(item && item.title, `Blok ${index + 1}`),
      text: text(item && item.text, ''),
      tag: text(item && item.tag, ''),
      imageUrl: text(item && item.imageUrl, ''),
      url: text(item && item.url, ''),
    };
  }

  function normalizeCategory(item, index = 0) {
    const blocks = Array.isArray(item && item.blocks) ? item.blocks : [];
    const fallbackLabel = `Kategori ${index + 1}`;
    const label = text(item && item.label, fallbackLabel);
    return {
      id: text(item && item.id, uid('cat')),
      slug: slugify(item && item.slug, slugify(label, `kategori-${index + 1}`)),
      label,
      showInMenu: item && typeof item.showInMenu === 'boolean' ? item.showInMenu : true,
      eyebrow: text(item && item.eyebrow, 'Kategori'),
      title: text(item && item.title, label),
      intro: text(item && item.intro, ''),
      ctaLabel: text(item && item.ctaLabel, 'Detaya Git'),
      ctaHref: text(item && item.ctaHref, 'index.html#apply'),
      blocks: blocks.map((block, blockIndex) => normalizeCategoryBlock(block, blockIndex)),
    };
  }

  function normalize(config) {
    const source = config && typeof config === 'object' ? config : {};
    const base = clone(DEFAULT_SITE_CONFIG);

    const brand = source.brand && typeof source.brand === 'object' ? source.brand : {};
    const nav = source.nav && typeof source.nav === 'object' ? source.nav : {};
    const home = source.home && typeof source.home === 'object' ? source.home : {};
    const hero = home.hero && typeof home.hero === 'object' ? home.hero : {};
    const operation = home.operation && typeof home.operation === 'object' ? home.operation : {};
    const about = home.about && typeof home.about === 'object' ? home.about : {};
    const highlights = home.highlights && typeof home.highlights === 'object' ? home.highlights : {};
    const team = home.team && typeof home.team === 'object' ? home.team : {};
    const field = home.field && typeof home.field === 'object' ? home.field : {};
    const faq = home.faq && typeof home.faq === 'object' ? home.faq : {};
    const apply = home.apply && typeof home.apply === 'object' ? home.apply : {};
    const footer = home.footer && typeof home.footer === 'object' ? home.footer : {};

    const metricsSource = Array.isArray(home.metrics) ? home.metrics : base.home.metrics;
    const operationItemsSource = Array.isArray(operation.items) ? operation.items : base.home.operation.items;
    const highlightCardsSource = Array.isArray(highlights.cards) ? highlights.cards : base.home.highlights.cards;
    const faqItemsSource = Array.isArray(faq.items) ? faq.items : base.home.faq.items;
    const fieldScheduleSource = Array.isArray(field.schedule) ? field.schedule : base.home.field.schedule;
    const fieldChecklistSource = Array.isArray(field.checklist) ? field.checklist : base.home.field.checklist;

    const categoriesSource = Array.isArray(source.categories) ? source.categories : base.categories;
    const normalizedCategories = categoriesSource.map((category, index) => normalizeCategory(category, index));

    ['events', 'sponsors'].forEach((slug) => {
      const defaultCategorySource = base.categories.find((item) => item.slug === slug);
      if (!defaultCategorySource) return;

      const defaultCategory = normalizeCategory(defaultCategorySource, normalizedCategories.length);
      const categoryIndex = normalizedCategories.findIndex((category) => category.slug === slug);

      if (categoryIndex === -1) {
        normalizedCategories.push(defaultCategory);
        return;
      }

      const category = normalizedCategories[categoryIndex];
      const currentBlocks = Array.isArray(category.blocks) ? category.blocks : [];
      const defaultBlocks = Array.isArray(defaultCategory.blocks) ? defaultCategory.blocks : [];
      const hasMeaningfulContent = currentBlocks.some(
        (block) => text(block.title, '') || text(block.text, '') || text(block.imageUrl, ''),
      );

      let mergedBlocks = currentBlocks;
      if (currentBlocks.length === 0 || !hasMeaningfulContent) {
        mergedBlocks = defaultBlocks.map((block, blockIndex) => normalizeCategoryBlock(block, blockIndex));
      } else if (defaultBlocks.length > 0) {
        mergedBlocks = currentBlocks.map((block, blockIndex) => {
          const blockTitleKey = plainKey(block && block.title);
          const matchedBlock = slug === 'sponsors' && blockTitleKey
            ? defaultBlocks.find((item) => {
              const itemKey = plainKey(item && item.title);
              return itemKey && (itemKey === blockTitleKey || itemKey.includes(blockTitleKey) || blockTitleKey.includes(itemKey));
            })
            : null;
          const fallbackBlock = matchedBlock || defaultBlocks[Math.min(blockIndex, defaultBlocks.length - 1)] || {};
          const fallbackImage = text(fallbackBlock.imageUrl, '');
          const fallbackUrl = text(fallbackBlock.url, '');
          return normalizeCategoryBlock(
            {
              ...block,
              imageUrl: text(block.imageUrl, '') || fallbackImage,
              url: text(block.url, '') || fallbackUrl,
            },
            blockIndex,
          );
        });
      }

      normalizedCategories[categoryIndex] = {
        ...category,
        blocks: mergedBlocks,
      };
    });

    return {
      version: 2,
      brand: {
        logoMode: text(brand.logoMode, base.brand.logoMode) === 'image' ? 'image' : 'text',
        markText: text(brand.markText, base.brand.markText),
        name: text(brand.name, base.brand.name),
        tagline: text(brand.tagline, base.brand.tagline),
        logoUrl: text(brand.logoUrl, base.brand.logoUrl),
      },
      nav: {
        applyLabel: text(nav.applyLabel, base.nav.applyLabel),
        applyHref: text(nav.applyHref, base.nav.applyHref),
      },
      home: {
        hero: {
          eyebrow: text(hero.eyebrow, base.home.hero.eyebrow),
          titleMain: text(hero.titleMain, base.home.hero.titleMain),
          titleAccent: text(hero.titleAccent, base.home.hero.titleAccent),
          lede: text(hero.lede, base.home.hero.lede),
          ctaPrimaryText: text(hero.ctaPrimaryText, base.home.hero.ctaPrimaryText),
          ctaPrimaryHref: text(hero.ctaPrimaryHref, base.home.hero.ctaPrimaryHref),
          ctaSecondaryText: text(hero.ctaSecondaryText, base.home.hero.ctaSecondaryText),
          ctaSecondaryHref: text(hero.ctaSecondaryHref, base.home.hero.ctaSecondaryHref),
        },
        metrics: metricsSource.map((metric, index) => normalizeMetric(metric, index)),
        operation: {
          title: text(operation.title, base.home.operation.title),
          items: operationItemsSource.map((item, index) => normalizeOperationItem(item, index)),
          tag: text(operation.tag, base.home.operation.tag),
        },
        about: {
          eyebrow: text(about.eyebrow, base.home.about.eyebrow),
          title: text(about.title, base.home.about.title),
          text: text(about.text, base.home.about.text),
        },
        highlights: {
          eyebrow: text(highlights.eyebrow, base.home.highlights.eyebrow),
          title: text(highlights.title, base.home.highlights.title),
          subtitle: text(highlights.subtitle, base.home.highlights.subtitle),
          cards: highlightCardsSource.map((card, index) => normalizeHighlightCard(card, index)),
        },
        team: {
          eyebrow: text(team.eyebrow, base.home.team.eyebrow),
          title: text(team.title, base.home.team.title),
          subtitle: text(team.subtitle, base.home.team.subtitle),
        },
        field: {
          eyebrow: text(field.eyebrow, base.home.field.eyebrow),
          title: text(field.title, base.home.field.title),
          subtitle: text(field.subtitle, base.home.field.subtitle),
          schedule: fieldScheduleSource.map((item, index) => normalizeOperationItem(item, index)),
          note: text(field.note, base.home.field.note),
          checklistTitle: text(field.checklistTitle, base.home.field.checklistTitle),
          checklist: fieldChecklistSource.map((item) => text(item, '')),
          checklistNote: text(field.checklistNote, base.home.field.checklistNote),
        },
        faq: {
          eyebrow: text(faq.eyebrow, base.home.faq.eyebrow),
          title: text(faq.title, base.home.faq.title),
          items: faqItemsSource.map((item, index) => normalizeFaqItem(item, index)),
        },
        apply: {
          eyebrow: text(apply.eyebrow, base.home.apply.eyebrow),
          title: text(apply.title, base.home.apply.title),
          subtitle: text(apply.subtitle, base.home.apply.subtitle),
        },
        footer: {
          blurb: text(footer.blurb, base.home.footer.blurb),
          instagram: text(footer.instagram, base.home.footer.instagram),
          email: text(footer.email, base.home.footer.email),
        },
      },
      categories: normalizedCategories,
    };
  }

  function migrateFromLegacy(legacyContent) {
    const base = clone(DEFAULT_SITE_CONFIG);
    const legacy = legacyContent && typeof legacyContent === 'object' ? legacyContent : {};

    if (legacy.hero && typeof legacy.hero === 'object') {
      base.home.hero.eyebrow = text(legacy.hero.eyebrow, base.home.hero.eyebrow);
      base.home.hero.titleMain = text(legacy.hero.titleMain, base.home.hero.titleMain);
      base.home.hero.titleAccent = text(legacy.hero.titleAccent, base.home.hero.titleAccent);
      base.home.hero.lede = text(legacy.hero.lede, base.home.hero.lede);
      base.home.hero.ctaPrimaryText = text(legacy.hero.ctaPrimary, base.home.hero.ctaPrimaryText);
      base.home.hero.ctaSecondaryText = text(legacy.hero.ctaSecondary, base.home.hero.ctaSecondaryText);
    }

    if (legacy.about && typeof legacy.about === 'object') {
      base.home.about.eyebrow = text(legacy.about.eyebrow, base.home.about.eyebrow);
      base.home.about.title = text(legacy.about.title, base.home.about.title);
      base.home.about.text = text(legacy.about.text, base.home.about.text);
    }

    if (legacy.highlights && typeof legacy.highlights === 'object') {
      base.home.highlights.eyebrow = text(legacy.highlights.eyebrow, base.home.highlights.eyebrow);
      base.home.highlights.title = text(legacy.highlights.title, base.home.highlights.title);
      base.home.highlights.subtitle = text(legacy.highlights.subtitle, base.home.highlights.subtitle);
      if (Array.isArray(legacy.highlights.cards) && legacy.highlights.cards.length > 0) {
        base.home.highlights.cards = legacy.highlights.cards.map((card, index) => normalizeHighlightCard(card, index));
      }
    }

    if (legacy.faq && typeof legacy.faq === 'object') {
      base.home.faq.eyebrow = text(legacy.faq.eyebrow, base.home.faq.eyebrow);
      base.home.faq.title = text(legacy.faq.title, base.home.faq.title);
      if (Array.isArray(legacy.faq.items) && legacy.faq.items.length > 0) {
        base.home.faq.items = legacy.faq.items.map((item, index) => normalizeFaqItem(item, index));
      }
    }

    if (legacy.footer && typeof legacy.footer === 'object') {
      base.home.footer.blurb = text(legacy.footer.blurb, base.home.footer.blurb);
      base.home.footer.instagram = text(legacy.footer.instagram, base.home.footer.instagram);
      base.home.footer.email = text(legacy.footer.email, base.home.footer.email);
    }

    return normalize(base);
  }

  function load() {
    const existing = safeParse(global.localStorage.getItem(STORAGE_KEY), null);
    if (existing && typeof existing === 'object') {
      const normalized = normalize(existing);
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    }

    const legacy = safeParse(global.localStorage.getItem(LEGACY_CONTENT_KEY), null);
    const migrated = legacy ? migrateFromLegacy(legacy) : normalize(DEFAULT_SITE_CONFIG);
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  }

  function save(config) {
    const normalized = normalize(config);
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  }

  global.SiteConfig = {
    STORAGE_KEY,
    LEGACY_CONTENT_KEY,
    DEFAULT_SITE_CONFIG,
    clone,
    uid,
    text,
    safeParse,
    slugify,
    normalize,
    load,
    save,
  };
}(window));
