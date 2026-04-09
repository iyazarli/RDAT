const STORAGE_KEYS = {
  applications: 'reddevil_applications',
  teamProfiles: 'reddevil_team_profiles',
};

const DEFAULT_SPONSORS = [
  {
    title: 'Izmir Av Market',
    text: 'Airsoft ve outdoor ekipman tedarik destegi.',
    imageUrl: 'assets/sponsors/izmiravmarket.png',
    url: 'https://izmiravmarket.com',
  },
  {
    title: 'Vector Optics',
    text: 'Optik sistemler ve saha gorus ekipmanlari.',
    imageUrl: 'assets/sponsors/vector-optics.svg',
    url: 'https://www.vectoroptics.com',
  },
  {
    title: 'ISG Airsoft',
    text: 'Airsoft platformlari ve etkinlik katkisi.',
    imageUrl: 'assets/sponsors/isgairsoft.png',
    url: 'https://isgairsoft.com',
  },
  {
    title: 'Armorion',
    text: 'Koruyucu ekipman ve taktik aksesuar destegi.',
    imageUrl: 'assets/sponsors/armorion.png',
    url: 'https://www.armorion.com',
  },
  {
    title: 'Poligun Store',
    text: 'Yerel ekipman tedarik ve saha is birligi.',
    imageUrl: 'assets/sponsors/poligunstore.png',
    url: 'https://poligunstore.com',
  },
];

const sponsorTickerState = {
  rafId: 0,
  cleanup: null,
  lastTs: 0,
  offset: 0,
  paused: false,
  groupWidth: 0,
};

function sponsorUrlFromName(name) {
  const key = text(name, '').toLowerCase();
  if (!key) return '';
  if (key.includes('vector')) return 'https://www.vectoroptics.com';
  if (key.includes('izmir') || key.includes('av market')) return 'https://izmiravmarket.com';
  if (key.includes('isg')) return 'https://isgairsoft.com';
  if (key.includes('armorion')) return 'https://www.armorion.com';
  if (key.includes('poligun')) return 'https://poligunstore.com';
  return '';
}

function safeParse(raw, fallback) {
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function uid(prefix) {
  if (window.crypto?.randomUUID) {
    return `${prefix}_${window.crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

function text(value, fallback = '') {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) {
    node.textContent = value;
  }
}

function renderBrand(config) {
  const brand = config.brand;
  document.querySelectorAll('[data-brand-name]').forEach((node) => {
    node.textContent = brand.name;
  });
  document.querySelectorAll('[data-brand-tagline]').forEach((node) => {
    node.textContent = brand.tagline;
  });

  document.querySelectorAll('[data-brand-mark]').forEach((node) => {
    if (brand.logoMode === 'image' && brand.logoUrl) {
      node.classList.add('logo-image');
      node.textContent = '';
      node.style.backgroundImage = `url(${brand.logoUrl})`;
      node.style.backgroundSize = 'contain';
      node.style.backgroundPosition = 'center';
      node.style.backgroundRepeat = 'no-repeat';
      return;
    }

    node.classList.remove('logo-image');
    node.style.backgroundImage = '';
    node.style.backgroundSize = '';
    node.style.backgroundPosition = '';
    node.style.backgroundRepeat = '';
    node.textContent = brand.markText;
  });
}

function renderNavigation(config) {
  const navLinks = document.querySelector('#main-nav-links');
  const footerLinks = document.querySelector('#footer-category-links');
  if (!navLinks) return;

  const categories = config.categories.filter((item) => item.showInMenu);

  navLinks.innerHTML = categories
    .map((category) => `<a href="category.html?slug=${encodeURIComponent(category.slug)}">${escapeHtml(category.label)}</a>`)
    .join('');

  const applyLink = document.createElement('a');
  applyLink.className = 'nav-cta';
  applyLink.href = config.nav.applyHref || '#apply';
  applyLink.id = 'nav-apply-link';
  applyLink.textContent = config.nav.applyLabel || 'Basvur';
  navLinks.appendChild(applyLink);

  if (footerLinks) {
    footerLinks.innerHTML = categories
      .map((category) => `<a class="footer-pill" href="category.html?slug=${encodeURIComponent(category.slug)}">${escapeHtml(category.label)}</a>`)
      .join('');
  }
}

function renderHeroMetrics(metrics) {
  const container = document.querySelector('#hero-metrics');
  if (!container || !Array.isArray(metrics)) return;

  container.innerHTML = metrics
    .map((metric) => `
      <div>
        <span class="metric">${escapeHtml(metric.value)}</span>
        <small>${escapeHtml(metric.label)}</small>
      </div>
    `)
    .join('');
}

function renderOperationCard(operation) {
  const titleNode = document.querySelector('#operation-card-title');
  const listNode = document.querySelector('#operation-list');
  const tagNode = document.querySelector('#operation-tag');

  if (titleNode) titleNode.textContent = operation.title;
  if (tagNode) tagNode.textContent = operation.tag;

  if (listNode) {
    listNode.innerHTML = operation.items
      .map((item) => `
        <li>
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value)}</strong>
        </li>
      `)
      .join('');
  }
}

function renderHighlightsCards(cards) {
  const container = document.querySelector('#highlights-grid');
  if (!container) return;

  container.innerHTML = cards
    .map((card) => `
      <article class="feature-card" data-card-id="${escapeHtml(card.id)}">
        <h3>${escapeHtml(card.title)}</h3>
        <p>${escapeHtml(card.description)}</p>
        <span class="chip">${escapeHtml(card.chip)}</span>
      </article>
    `)
    .join('');
}

function renderFaqItems(items) {
  const container = document.querySelector('#faq-list');
  if (!container) return;

  container.innerHTML = items
    .map((item) => `
      <article class="faq-item" data-faq-id="${escapeHtml(item.id)}">
        <button class="faq-question">${escapeHtml(item.question)}</button>
        <div class="faq-answer">${escapeHtml(item.answer)}</div>
      </article>
    `)
    .join('');
}

function renderFieldSchedule(schedule) {
  const container = document.querySelector('#field-schedule');
  if (!container) return;
  if (!Array.isArray(schedule)) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = schedule
    .map((item) => `
      <div>
        <span class="label">${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.value)}</strong>
      </div>
    `)
    .join('');
}

function renderChecklistById(containerId, list) {
  const container = document.querySelector(`#${containerId}`);
  if (!container) return;
  if (!Array.isArray(list)) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = list.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
}

function renderFieldChecklist(list) {
  renderChecklistById('field-checklist', list);
}

function renderPillRow(containerId, items, className = 'pill') {
  const container = document.querySelector(`#${containerId}`);
  if (!container) return;
  if (!Array.isArray(items)) {
    container.innerHTML = '';
    return;
  }
  const classAttr = className ? ` class="${escapeHtml(className)}"` : '';
  container.innerHTML = items
    .map((item) => `<span${classAttr}>${escapeHtml(item)}</span>`)
    .join('');
}

function renderFooterQuickTags(tags) {
  renderPillRow('footer-mini-tags', tags, '');
}

function stopSponsorTicker() {
  if (sponsorTickerState.rafId) {
    cancelAnimationFrame(sponsorTickerState.rafId);
    sponsorTickerState.rafId = 0;
  }
  if (typeof sponsorTickerState.cleanup === 'function') {
    sponsorTickerState.cleanup();
    sponsorTickerState.cleanup = null;
  }
  sponsorTickerState.lastTs = 0;
  sponsorTickerState.offset = 0;
  sponsorTickerState.paused = false;
  sponsorTickerState.groupWidth = 0;
}

function startSponsorTicker() {
  stopSponsorTicker();

  const strip = document.querySelector('.sponsor-strip');
  const track = document.querySelector('#sponsors-grid');
  const firstGroup = track?.querySelector('.sponsor-strip-group');
  if (!strip || !track || !firstGroup) return;

  const recalcWidth = () => {
    sponsorTickerState.groupWidth = firstGroup.getBoundingClientRect().width;
    if (!sponsorTickerState.groupWidth) {
      track.style.transform = 'translate3d(0, 0, 0)';
      return;
    }
    sponsorTickerState.offset = sponsorTickerState.offset % sponsorTickerState.groupWidth;
  };

  const onPointerEnter = () => {
    sponsorTickerState.paused = true;
  };
  const onPointerLeave = () => {
    sponsorTickerState.paused = false;
  };
  const onResize = () => {
    recalcWidth();
  };

  strip.addEventListener('mouseenter', onPointerEnter);
  strip.addEventListener('mouseleave', onPointerLeave);
  strip.addEventListener('touchstart', onPointerEnter, { passive: true });
  strip.addEventListener('touchend', onPointerLeave, { passive: true });
  window.addEventListener('resize', onResize);

  sponsorTickerState.cleanup = () => {
    strip.removeEventListener('mouseenter', onPointerEnter);
    strip.removeEventListener('mouseleave', onPointerLeave);
    strip.removeEventListener('touchstart', onPointerEnter);
    strip.removeEventListener('touchend', onPointerLeave);
    window.removeEventListener('resize', onResize);
  };

  recalcWidth();

  const tick = (ts) => {
    if (!sponsorTickerState.lastTs) sponsorTickerState.lastTs = ts;
    const dt = (ts - sponsorTickerState.lastTs) / 1000;
    sponsorTickerState.lastTs = ts;

    if (!sponsorTickerState.paused && sponsorTickerState.groupWidth > 0) {
      const speed = window.innerWidth <= 760 ? 34 : 46;
      sponsorTickerState.offset += speed * dt;
      if (sponsorTickerState.offset >= sponsorTickerState.groupWidth) {
        sponsorTickerState.offset -= sponsorTickerState.groupWidth;
      }
      track.style.transform = `translate3d(${-sponsorTickerState.offset}px, 0, 0)`;
    }

    sponsorTickerState.rafId = requestAnimationFrame(tick);
  };

  sponsorTickerState.rafId = requestAnimationFrame(tick);
}

function renderSponsorsSection(config) {
  const section = document.querySelector('#sponsors');
  const grid = document.querySelector('#sponsors-grid');
  if (!section || !grid) return;

  const sponsorsCategory = config.categories.find((category) => category.slug === 'sponsors');

  const categoryItems = Array.isArray(sponsorsCategory?.blocks)
    ? sponsorsCategory.blocks.map((item) => ({
      title: text(item?.title, ''),
      text: text(item?.text, ''),
      imageUrl: text(item?.imageUrl, ''),
      url: text(item?.url, ''),
    }))
    : [];

  const hasMeaningfulCategoryItems = categoryItems.some(
    (item) => item.title || item.text || item.imageUrl,
  );

  const sponsors = hasMeaningfulCategoryItems
    ? categoryItems.map((item, index) => ({
      title: item.title || DEFAULT_SPONSORS[Math.min(index, DEFAULT_SPONSORS.length - 1)].title,
      text: item.text || DEFAULT_SPONSORS[Math.min(index, DEFAULT_SPONSORS.length - 1)].text,
      imageUrl: item.imageUrl || DEFAULT_SPONSORS[Math.min(index, DEFAULT_SPONSORS.length - 1)].imageUrl,
      url: sponsorUrlFromName(item.title) || item.url || DEFAULT_SPONSORS[Math.min(index, DEFAULT_SPONSORS.length - 1)].url,
    }))
    : DEFAULT_SPONSORS;

  if (!sponsors.length) {
    stopSponsorTicker();
    section.hidden = true;
    return;
  }

  section.hidden = false;
  setText('sponsors-eyebrow', sponsorsCategory?.eyebrow || 'Sponsorlar');
  setText('sponsors-title', sponsorsCategory?.title || sponsorsCategory?.label || 'Sponsorlarimiz');
  setText('sponsors-intro', sponsorsCategory?.intro || 'Takimimizi destekleyen sponsor markalar.');

  const buildTiles = (hidden = false) => sponsors
    .map((sponsor) => {
      const isVectorOptics = /vector\s*optics/i.test(sponsor.title) || /vectoroptics/i.test(sponsor.url || '');
      const tileClass = `sponsor-tile${isVectorOptics ? ' sponsor-tile--vector' : ''}`;
      return `
      <a class="${tileClass}" href="${escapeHtml(sponsor.url || '#')}" ${sponsor.url ? 'target="_blank" rel="noopener noreferrer"' : ''} title="${escapeHtml(sponsor.title)}" ${hidden ? 'aria-hidden="true" tabindex="-1"' : ''}>
        ${sponsor.imageUrl
          ? `<img class="sponsor-logo" src="${escapeHtml(sponsor.imageUrl)}" alt="${escapeHtml(sponsor.title)} logo">`
          : `<span class="sponsor-fallback">${escapeHtml(sponsor.title)}</span>`}
      </a>
    `;
    })
    .join('');

  grid.innerHTML = `
    <div class="sponsor-strip-group">
      ${buildTiles(false)}
    </div>
    <div class="sponsor-strip-group" aria-hidden="true">
      ${buildTiles(true)}
    </div>
  `;

  startSponsorTicker();
}

function renderHomeContent(config) {
  const home = config.home;

  setText('hero-eyebrow', home.hero.eyebrow);
  setText('hero-title-main', home.hero.titleMain);
  setText('hero-title-accent', home.hero.titleAccent);
  setText('hero-lede', home.hero.lede);

  const ctaPrimary = document.querySelector('#hero-cta-primary');
  const ctaSecondary = document.querySelector('#hero-cta-secondary');
  if (ctaPrimary) {
    ctaPrimary.textContent = home.hero.ctaPrimaryText;
    ctaPrimary.href = home.hero.ctaPrimaryHref;
  }
  if (ctaSecondary) {
    ctaSecondary.textContent = home.hero.ctaSecondaryText;
    ctaSecondary.href = home.hero.ctaSecondaryHref;
  }

  renderHeroMetrics(home.metrics);
  renderOperationCard(home.operation);

  setText('about-eyebrow', home.about.eyebrow);
  setText('about-title', home.about.title);
  setText('about-text', home.about.text);
  renderPillRow('about-pills', home.about.pills || [], 'pill');
  setText('about-criteria-title', home.about.criteriaTitle);
  renderChecklistById('about-criteria-items', home.about.criteriaItems || []);
  setText('about-criteria-note', home.about.criteriaNote);

  setText('highlights-eyebrow', home.highlights.eyebrow);
  setText('highlights-title', home.highlights.title);
  setText('highlights-subtitle', home.highlights.subtitle);
  renderHighlightsCards(home.highlights.cards);

  setText('team-eyebrow', home.team.eyebrow);
  setText('team-title', home.team.title);
  setText('team-subtitle', home.team.subtitle);

  setText('field-eyebrow', home.field.eyebrow);
  setText('field-title', home.field.title);
  setText('field-subtitle', home.field.subtitle);
  renderFieldSchedule(home.field.schedule);
  setText('field-note', home.field.note);
  setText('field-checklist-title', home.field.checklistTitle);
  renderFieldChecklist(home.field.checklist);
  setText('field-checklist-note', home.field.checklistNote);

  setText('faq-eyebrow', home.faq.eyebrow);
  setText('faq-title', home.faq.title);
  renderFaqItems(home.faq.items);

  setText('apply-eyebrow', home.apply.eyebrow);
  setText('apply-title', home.apply.title);
  setText('apply-subtitle', home.apply.subtitle);

  setText('footer-blurb', home.footer.blurb);
  setText('footer-instagram', home.footer.instagram);
  setText('footer-email', home.footer.email);
  renderFooterQuickTags(home.footer.quickTags || []);

  renderSponsorsSection(config);
}

function getLocalTeamProfiles() {
  const raw = safeParse(localStorage.getItem(STORAGE_KEYS.teamProfiles), []);
  if (!Array.isArray(raw) || raw.length === 0) {
    return [];
  }

  return raw.map((item, index) => ({
    id: String(item.id || `team_${index}`),
    name: String(item.name || `Oyuncu ${index + 1}`),
    callsign: String(item.callsign || 'Callsign'),
    title: String(item.title || 'Rol'),
    badge: String(item.badge || 'Member'),
    photo: String(item.photo || 'https://images.unsplash.com/photo-1522556189639-b150c3a2e10f?auto=format&fit=crop&w=900&q=80'),
    bio: String(item.bio || ''),
    expertise: String(item.expertise || '-'),
    seasons: String(item.seasons || '-'),
    setup: String(item.setup || '-'),
  }));
}

function renderTeamProfiles(profilesInput) {
  const teamGrid = document.querySelector('#team-grid');
  if (!teamGrid) return;

  const normalized = Array.isArray(profilesInput) && profilesInput.length
    ? profilesInput.map((item, index) => ({
      id: String(item.id || `team_${index}`),
      name: String(item.name || `Oyuncu ${index + 1}`),
      callsign: String(item.callsign || 'Callsign'),
      title: String(item.title || 'Rol'),
      badge: String(item.badge || 'Member'),
      photo: String(item.photo || 'https://images.unsplash.com/photo-1522556189639-b150c3a2e10f?auto=format&fit=crop&w=900&q=80'),
      bio: String(item.bio || ''),
      expertise: String(item.expertise || '-'),
      seasons: String(item.seasons || '-'),
      setup: String(item.setup || '-'),
    }))
    : getLocalTeamProfiles();

  if (!normalized.length) {
    return;
  }

  teamGrid.innerHTML = normalized
    .map((profile) => `
      <article class="person-card" data-profile-id="${escapeHtml(profile.id)}">
        <img class="person-photo" src="${escapeHtml(profile.photo)}" alt="${escapeHtml(profile.name)} ${escapeHtml(profile.callsign)} portresi">
        <div class="person-body">
          <header class="person-header">
            <div>
              <h3>${escapeHtml(profile.name)} "${escapeHtml(profile.callsign)}"</h3>
              <small>${escapeHtml(profile.title)}</small>
            </div>
            <span class="role-badge">${escapeHtml(profile.badge)}</span>
          </header>
          <p>${escapeHtml(profile.bio)}</p>
          <ul class="person-meta">
            <li><span>Uzmanlik</span><strong>${escapeHtml(profile.expertise)}</strong></li>
            <li><span>Takimda</span><strong>${escapeHtml(profile.seasons)}</strong></li>
            <li><span>Favori setup</span><strong>${escapeHtml(profile.setup)}</strong></li>
          </ul>
        </div>
      </article>
    `)
    .join('');
}

function bindMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('open');
    });
  }

  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

function bindFaqAccordion() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const button = item.querySelector('.faq-question');
    button?.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
}

function getFallbackPublicState() {
  if (!window.SiteConfig) {
    return null;
  }

  return {
    ok: false,
    siteConfig: window.SiteConfig.load(),
    teamProfiles: getLocalTeamProfiles(),
  };
}

async function initContent() {
  window.SiteDataClient?.bindGlobalErrorTracking();

  const fallback = getFallbackPublicState();
  const publicState = window.SiteDataClient?.loadPublicState
    ? await window.SiteDataClient.loadPublicState(() => fallback)
    : fallback;
  const configSource = publicState?.siteConfig || fallback?.siteConfig;
  const config = window.SiteConfig && configSource
    ? window.SiteConfig.normalize(configSource)
    : configSource;

  if (!config) {
    startSponsorTicker();
    bindFaqAccordion();
    bindMobileNav();
    return;
  }

  renderBrand(config);
  renderNavigation(config);
  renderHomeContent(config);
  renderTeamProfiles(publicState?.teamProfiles);
  bindFaqAccordion();
  bindMobileNav();
}

initContent();

const FORM_ENDPOINT = '/api/applications';
const form = document.querySelector('#apply-form');
const statusEl = document.querySelector('.form-status');

const serializeForm = (formEl) => {
  const data = new FormData(formEl);
  return Object.fromEntries(data.entries());
};

const postToEndpoint = async (payload) => {
  const res = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      consent: Boolean(form?.consent?.checked),
    }),
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, body };
};

const setStatus = (msg, tone = 'muted') => {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.style.color = tone === 'success' ? '#a2ff43' : tone === 'error' ? '#ff9a7a' : '#9eb4a8';
};

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = serializeForm(form);

  if (!payload.name || !payload.email || !payload.phone || !payload.experience || !payload.role || !form.consent.checked) {
    setStatus('Zorunlu alanlari doldurun ve kurallari onaylayin.', 'error');
    return;
  }

  setStatus('Gonderiliyor...');

  try {
    const result = await postToEndpoint(payload);
    if (!result.ok) {
      throw new Error(result.body?.error || 'Gonderim hatasi');
    }

    setStatus('Basvurun iletildi ve admin paneline dustu.', 'success');
    form.reset();
  } catch (error) {
    console.error(error);
    window.SiteDataClient?.reportError({
      type: 'form_submit_error',
      message: error.message || 'Basvuru gonderimi basarisiz',
      stack: error.stack || '',
    });
    setStatus(error.message || 'Gonderilemedi. Lutfen tekrar dene.', 'error');
  }
});
