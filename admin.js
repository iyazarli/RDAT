const KEYS = {
  applications: 'reddevil_applications',
  teamProfiles: 'reddevil_team_profiles',
  passcode: 'reddevil_admin_passcode',
  session: 'reddevil_admin_session',
};

const DEFAULT_BRAND_LOGO_URL = 'assets/brand/reddevil-logo.svg';

const STATUS_LABELS = {
  new: 'Yeni',
  reviewing: 'Inceleniyor',
  approved: 'Onaylandi',
  rejected: 'Reddedildi',
};

const DEFAULT_TEAM_PROFILES = [
  {
    id: 'team_ghost',
    name: 'Kagan',
    callsign: 'Ghost',
    title: 'Takim lideri | Oyun kurgu',
    badge: 'Lider',
    bio: 'Senaryo tasarimi, saha koordinasyonu ve telsiz protokollerinden sorumlu.',
    expertise: 'Komuta & Entry',
    seasons: '5. sezon',
    setup: 'M4 + red dot',
    photo: 'https://images.unsplash.com/photo-1608064229007-dca149d32c4f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'team_mamba',
    name: 'Selin',
    callsign: 'Mamba',
    title: 'Safety Officer | Medic egitimi',
    badge: 'Safety',
    bio: 'Guvenlik brifingi, ilk yardim kiti ve saha ici risk kontrolunu yonetir.',
    expertise: 'Medic & Safety',
    seasons: '4. sezon',
    setup: 'SMG + sidearm',
    photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'team_forge',
    name: 'Emir',
    callsign: 'Forge',
    title: 'Ekipman mentoru',
    badge: 'Tech',
    bio: 'Kronograf, bakim, yedek ekipman ve butce dostu setup onerileri sunar.',
    expertise: 'Tech & DMR',
    seasons: '6. sezon',
    setup: 'DMR 1.64J',
    photo: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'team_spark',
    name: 'Deniz',
    callsign: 'Spark',
    title: 'Medya | After Action',
    badge: 'Media',
    bio: 'Oyun goruntuleri, highlight montajlari ve AAR notlarinin paylasimini yapar.',
    expertise: 'Recon & Media',
    seasons: '3. sezon',
    setup: 'Carbine + action cam',
    photo: 'https://images.unsplash.com/photo-1522556189639-b150c3a2e10f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'team_placeholder_5',
    name: 'Ad',
    callsign: 'Callsign',
    title: 'Rol — Guncelleniyor',
    badge: 'Member',
    bio: 'Oyuncu bilgileri yakin zamanda eklenecek.',
    expertise: '—',
    seasons: '—',
    setup: '—',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'team_placeholder_6',
    name: 'Ad',
    callsign: 'Callsign',
    title: 'Rol — Guncelleniyor',
    badge: 'Member',
    bio: 'Oyuncu bilgileri yakin zamanda eklenecek.',
    expertise: '—',
    seasons: '—',
    setup: '—',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'team_placeholder_7',
    name: 'Ad',
    callsign: 'Callsign',
    title: 'Rol — Guncelleniyor',
    badge: 'Member',
    bio: 'Oyuncu bilgileri yakin zamanda eklenecek.',
    expertise: '—',
    seasons: '—',
    setup: '—',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'team_placeholder_8',
    name: 'Ad',
    callsign: 'Callsign',
    title: 'Rol — Guncelleniyor',
    badge: 'Member',
    bio: 'Oyuncu bilgileri yakin zamanda eklenecek.',
    expertise: '—',
    seasons: '—',
    setup: '—',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',
  },
];

const state = {
  applications: [],
  teamProfiles: [],
  siteConfig: null,
  selectedApplicationId: null,
  selectedCategoryId: null,
  filters: {
    query: '',
    status: 'all',
    experience: 'all',
  },
};

const el = {
  lockScreen: document.querySelector('#lock-screen'),
  adminContent: document.querySelector('#admin-content'),
  loginForm: document.querySelector('#login-form'),
  adminPass: document.querySelector('#admin-pass'),
  loginStatus: document.querySelector('#login-status'),
  logoutBtn: document.querySelector('#logout-btn'),
  adminBrandMarks: document.querySelectorAll('[data-admin-brand-mark]'),
  panelNavButtons: document.querySelectorAll('[data-panel-target]'),
  panels: document.querySelectorAll('.panel'),

  metricTotal: document.querySelector('#metric-total'),
  metricNew: document.querySelector('#metric-new'),
  metricApproved: document.querySelector('#metric-approved'),
  metricRejected: document.querySelector('#metric-rejected'),
  roleChart: document.querySelector('#role-chart'),
  experienceChart: document.querySelector('#experience-chart'),
  recentActivity: document.querySelector('#recent-activity'),

  searchInput: document.querySelector('#search-input'),
  statusFilter: document.querySelector('#status-filter'),
  experienceFilter: document.querySelector('#experience-filter'),
  applicationsBody: document.querySelector('#applications-body'),
  exportCsvBtn: document.querySelector('#export-csv-btn'),
  exportJsonBtn: document.querySelector('#export-json-btn'),
  importAppsTrigger: document.querySelector('#import-apps-trigger'),
  importAppsInput: document.querySelector('#import-apps-input'),
  deleteAllBtn: document.querySelector('#delete-all-btn'),
  seedSamplesBtn: document.querySelector('#seed-samples-btn'),

  detailForm: document.querySelector('#application-detail-form'),
  detailName: document.querySelector('#detail-name'),
  detailEmail: document.querySelector('#detail-email'),
  detailPhone: document.querySelector('#detail-phone'),
  detailRegion: document.querySelector('#detail-region'),
  detailMessage: document.querySelector('#detail-message'),
  detailStatus: document.querySelector('#detail-status'),
  detailAdminNotes: document.querySelector('#detail-admin-notes'),
  detailStatusText: document.querySelector('#detail-status-text'),
  deleteSelectedBtn: document.querySelector('#delete-selected-btn'),

  teamForm: document.querySelector('#team-form'),
  teamId: document.querySelector('#team-id'),
  teamName: document.querySelector('#team-name'),
  teamCallsign: document.querySelector('#team-callsign'),
  teamTitle: document.querySelector('#team-title'),
  teamBadge: document.querySelector('#team-badge'),
  teamPhoto: document.querySelector('#team-photo'),
  teamBio: document.querySelector('#team-bio'),
  teamExpertise: document.querySelector('#team-expertise'),
  teamSeasons: document.querySelector('#team-seasons'),
  teamSetup: document.querySelector('#team-setup'),
  clearTeamForm: document.querySelector('#clear-team-form'),
  resetTeamDefaults: document.querySelector('#reset-team-defaults'),
  teamList: document.querySelector('#team-list'),
  teamStatus: document.querySelector('#team-status'),

  contentTextForm: document.querySelector('#content-text-form'),
  resetContentDefaults: document.querySelector('#reset-content-defaults'),
  contentHeroEyebrow: document.querySelector('#content-hero-eyebrow'),
  contentHeroTitleMain: document.querySelector('#content-hero-title-main'),
  contentHeroTitleAccent: document.querySelector('#content-hero-title-accent'),
  contentHeroLede: document.querySelector('#content-hero-lede'),
  contentHeroCtaPrimary: document.querySelector('#content-hero-cta-primary'),
  contentHeroCtaPrimaryHref: document.querySelector('#content-hero-cta-primary-href'),
  contentHeroCtaSecondary: document.querySelector('#content-hero-cta-secondary'),
  contentHeroCtaSecondaryHref: document.querySelector('#content-hero-cta-secondary-href'),
  contentHeroMetrics: document.querySelector('#content-hero-metrics'),
  contentOperationTitle: document.querySelector('#content-operation-title'),
  contentOperationItems: document.querySelector('#content-operation-items'),
  contentOperationTag: document.querySelector('#content-operation-tag'),
  contentAboutEyebrow: document.querySelector('#content-about-eyebrow'),
  contentAboutTitle: document.querySelector('#content-about-title'),
  contentAboutText: document.querySelector('#content-about-text'),
  contentAboutPills: document.querySelector('#content-about-pills'),
  contentAboutCriteriaTitle: document.querySelector('#content-about-criteria-title'),
  contentAboutCriteriaItems: document.querySelector('#content-about-criteria-items'),
  contentAboutCriteriaNote: document.querySelector('#content-about-criteria-note'),
  contentHighlightsEyebrow: document.querySelector('#content-highlights-eyebrow'),
  contentHighlightsTitle: document.querySelector('#content-highlights-title'),
  contentHighlightsSubtitle: document.querySelector('#content-highlights-subtitle'),
  contentFaqEyebrow: document.querySelector('#content-faq-eyebrow'),
  contentFaqTitle: document.querySelector('#content-faq-title'),
  contentTeamEyebrow: document.querySelector('#content-team-eyebrow'),
  contentTeamTitle: document.querySelector('#content-team-title'),
  contentTeamSubtitle: document.querySelector('#content-team-subtitle'),
  contentFieldEyebrow: document.querySelector('#content-field-eyebrow'),
  contentFieldTitle: document.querySelector('#content-field-title'),
  contentFieldSubtitle: document.querySelector('#content-field-subtitle'),
  contentFieldNote: document.querySelector('#content-field-note'),
  contentFieldSchedule: document.querySelector('#content-field-schedule'),
  contentFieldChecklistTitle: document.querySelector('#content-field-checklist-title'),
  contentFieldChecklistItems: document.querySelector('#content-field-checklist-items'),
  contentFieldChecklistNote: document.querySelector('#content-field-checklist-note'),
  contentApplyEyebrow: document.querySelector('#content-apply-eyebrow'),
  contentApplyTitle: document.querySelector('#content-apply-title'),
  contentApplySubtitle: document.querySelector('#content-apply-subtitle'),
  contentFooterBlurb: document.querySelector('#content-footer-blurb'),
  contentFooterInstagram: document.querySelector('#content-footer-instagram'),
  contentFooterEmail: document.querySelector('#content-footer-email'),
  contentFooterQuickTags: document.querySelector('#content-footer-quick-tags'),
  contentStatus: document.querySelector('#content-status'),

  highlightForm: document.querySelector('#highlight-form'),
  highlightId: document.querySelector('#highlight-id'),
  highlightTitle: document.querySelector('#highlight-title'),
  highlightDescription: document.querySelector('#highlight-description'),
  highlightChip: document.querySelector('#highlight-chip'),
  clearHighlightForm: document.querySelector('#clear-highlight-form'),
  highlightStatus: document.querySelector('#highlight-status'),
  highlightList: document.querySelector('#highlight-list'),

  faqFormAdmin: document.querySelector('#faq-form-admin'),
  faqId: document.querySelector('#faq-id'),
  faqQuestionInput: document.querySelector('#faq-question-input'),
  faqAnswerInput: document.querySelector('#faq-answer-input'),
  clearFaqForm: document.querySelector('#clear-faq-form'),
  faqStatus: document.querySelector('#faq-status'),
  faqAdminList: document.querySelector('#faq-admin-list'),

  brandForm: document.querySelector('#brand-form'),
  brandLogoMode: document.querySelector('#brand-logo-mode'),
  brandMarkText: document.querySelector('#brand-mark-text'),
  brandName: document.querySelector('#brand-name'),
  brandTagline: document.querySelector('#brand-tagline'),
  brandLogoUrl: document.querySelector('#brand-logo-url'),
  navApplyLabel: document.querySelector('#nav-apply-label'),
  navApplyHref: document.querySelector('#nav-apply-href'),
  brandStatus: document.querySelector('#brand-status'),

  categoryForm: document.querySelector('#category-form'),
  categoryId: document.querySelector('#category-id'),
  categoryLabel: document.querySelector('#category-label'),
  categorySlug: document.querySelector('#category-slug'),
  categoryEyebrow: document.querySelector('#category-eyebrow'),
  categoryTitle: document.querySelector('#category-title'),
  categoryIntro: document.querySelector('#category-intro'),
  categoryCtaLabel: document.querySelector('#category-cta-label'),
  categoryCtaHref: document.querySelector('#category-cta-href'),
  categoryShowMenu: document.querySelector('#category-show-menu'),
  clearCategoryForm: document.querySelector('#clear-category-form'),
  categoryStatus: document.querySelector('#category-status'),
  categoryList: document.querySelector('#category-list'),

  categoryBlockForm: document.querySelector('#category-block-form'),
  categoryBlockId: document.querySelector('#category-block-id'),
  categoryBlockCategory: document.querySelector('#category-block-category'),
  categoryBlockTitle: document.querySelector('#category-block-title'),
  categoryBlockText: document.querySelector('#category-block-text'),
  categoryBlockTag: document.querySelector('#category-block-tag'),
  categoryBlockImage: document.querySelector('#category-block-image'),
  categoryBlockUrl: document.querySelector('#category-block-url'),
  categoryBlockGallery: document.querySelector('#category-block-gallery'),
  categoryBlockImageFile: document.querySelector('#category-block-image-file'),
  clearCategoryBlockForm: document.querySelector('#clear-category-block-form'),
  categoryBlockStatus: document.querySelector('#category-block-status'),
  categoryBlockList: document.querySelector('#category-block-list'),

  siteConfigJsonForm: document.querySelector('#site-config-json-form'),
  siteConfigJson: document.querySelector('#site-config-json'),
  reloadSiteConfigJson: document.querySelector('#reload-site-config-json'),
  siteConfigJsonStatus: document.querySelector('#site-config-json-status'),

  passcodeForm: document.querySelector('#passcode-form'),
  newPasscode: document.querySelector('#new-passcode'),
  exportAllBtn: document.querySelector('#export-all-btn'),
  importAllTrigger: document.querySelector('#import-all-trigger'),
  importAllInput: document.querySelector('#import-all-input'),
  settingsStatus: document.querySelector('#settings-status'),
};

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

function parseLineList(rawValue) {
  return String(rawValue || '')
    .split('\n')
    .map((line) => text(line, ''))
    .filter(Boolean);
}

function formatLineList(items) {
  if (!Array.isArray(items)) return '';
  return items.map((item) => text(item, '')).filter(Boolean).join('\n');
}

function parseMetricLines(rawValue, fallback = []) {
  const lines = parseLineList(rawValue);
  if (lines.length === 0) return [];
  const parsed = lines
    .map((line, index) => {
      const [valuePart, ...labelParts] = line.split('|');
      const value = text(valuePart, '');
      const label = text(labelParts.join('|'), '');
      if (!value || !label) return null;
      return {
        id: text(fallback[index] && fallback[index].id, uid('metric')),
        value,
        label,
      };
    })
    .filter(Boolean);

  return parsed.length > 0 ? parsed : fallback;
}

function formatMetricLines(metrics) {
  if (!Array.isArray(metrics)) return '';
  return metrics
    .map((item) => `${text(item && item.value, '')} | ${text(item && item.label, '')}`)
    .filter((line) => line.replace('|', '').trim().length > 0)
    .join('\n');
}

function parseLabelValueLines(rawValue, fallback = [], idPrefix = 'item') {
  const lines = parseLineList(rawValue);
  if (lines.length === 0) return [];
  const parsed = lines
    .map((line, index) => {
      const [labelPart, ...valueParts] = line.split('|');
      const label = text(labelPart, '');
      const value = text(valueParts.join('|'), '');
      if (!label || !value) return null;
      return {
        id: text(fallback[index] && fallback[index].id, uid(idPrefix)),
        label,
        value,
      };
    })
    .filter(Boolean);

  return parsed.length > 0 ? parsed : fallback;
}

function formatLabelValueLines(items) {
  if (!Array.isArray(items)) return '';
  return items
    .map((item) => `${text(item && item.label, '')} | ${text(item && item.value, '')}`)
    .filter((line) => line.replace('|', '').trim().length > 0)
    .join('\n');
}

function toDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(toDate(value));
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function setInlineStatus(target, message, tone = 'muted') {
  if (!target) return;
  target.textContent = message;
  if (tone === 'success') {
    target.style.color = '#9fffb6';
    return;
  }
  if (tone === 'error') {
    target.style.color = '#ffb0b0';
    return;
  }
  target.style.color = '#9fb2ba';
}

function getPasscode() {
  return localStorage.getItem(KEYS.passcode) || 'reddevil-admin';
}

function setSession(isActive) {
  if (isActive) {
    sessionStorage.setItem(KEYS.session, 'active');
    return;
  }
  sessionStorage.removeItem(KEYS.session);
}

function isSessionActive() {
  return sessionStorage.getItem(KEYS.session) === 'active';
}

function normalizeStatus(status) {
  return Object.prototype.hasOwnProperty.call(STATUS_LABELS, status) ? status : 'new';
}

function normalizeApplication(item) {
  const createdAt = toDate(item.createdAt || new Date()).toISOString();
  return {
    id: text(item.id, uid('app')),
    name: text(item.name, ''),
    email: text(item.email, ''),
    phone: text(item.phone, ''),
    experience: text(item.experience, ''),
    role: text(item.role, ''),
    region: text(item.region, ''),
    notes: text(item.notes, ''),
    consent: item.consent === 'on' ? true : Boolean(item.consent),
    createdAt,
    updatedAt: toDate(item.updatedAt || createdAt).toISOString(),
    status: normalizeStatus(item.status),
    adminNotes: text(item.adminNotes, ''),
  };
}

function normalizeProfile(item, index = 0) {
  return {
    id: text(item.id, uid('team')),
    name: text(item.name, `Oyuncu ${index + 1}`),
    callsign: text(item.callsign, 'Callsign'),
    title: text(item.title, 'Rol'),
    badge: text(item.badge, 'Member'),
    photo: text(item.photo, 'https://images.unsplash.com/photo-1522556189639-b150c3a2e10f?auto=format&fit=crop&w=900&q=80'),
    bio: text(item.bio, ''),
    expertise: text(item.expertise, '-'),
    seasons: text(item.seasons, '-'),
    setup: text(item.setup, '-'),
  };
}

function loadApplications() {
  const raw = safeParse(localStorage.getItem(KEYS.applications), []);
  const list = Array.isArray(raw) ? raw : [];
  return list.map((item) => normalizeApplication(item)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function saveApplications() {
  localStorage.setItem(KEYS.applications, JSON.stringify(state.applications));
}

function loadTeamProfiles() {
  const raw = safeParse(localStorage.getItem(KEYS.teamProfiles), []);
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.map((item, index) => normalizeProfile(item, index));
  }
  return DEFAULT_TEAM_PROFILES.map((item, index) => normalizeProfile(item, index));
}

function saveTeamProfiles() {
  localStorage.setItem(KEYS.teamProfiles, JSON.stringify(state.teamProfiles));
}

function loadSiteConfig() {
  if (!window.SiteConfig) {
    return {
      brand: { logoMode: 'image', markText: 'RD', name: 'Reddevil', tagline: 'Airsoft Team', logoUrl: DEFAULT_BRAND_LOGO_URL },
      nav: { applyLabel: 'Basvur', applyHref: '#apply' },
      home: {
        hero: { eyebrow: '', titleMain: '', titleAccent: '', lede: '', ctaPrimaryText: '', ctaPrimaryHref: '', ctaSecondaryText: '', ctaSecondaryHref: '' },
        metrics: [],
        operation: { title: '', items: [], tag: '' },
        about: {
          eyebrow: '',
          title: '',
          text: '',
          pills: [],
          criteriaTitle: '',
          criteriaItems: [],
          criteriaNote: '',
        },
        highlights: { eyebrow: '', title: '', subtitle: '', cards: [] },
        team: { eyebrow: '', title: '', subtitle: '' },
        field: { eyebrow: '', title: '', subtitle: '', schedule: [], note: '', checklistTitle: '', checklist: [], checklistNote: '' },
        faq: { eyebrow: '', title: '', items: [] },
        apply: { eyebrow: '', title: '', subtitle: '' },
        footer: { blurb: '', instagram: '', email: '', quickTags: [] },
      },
      categories: [],
    };
  }

  return window.SiteConfig.load();
}

function saveSiteConfig() {
  if (!window.SiteConfig) return true;
  try {
    state.siteConfig = window.SiteConfig.save(state.siteConfig);
    return true;
  } catch (error) {
    console.error(error);
    const message = error && error.name === 'QuotaExceededError'
      ? 'Kayit yapilamadi: tarayici depolama limiti doldu. Daha kucuk gorsel yukleyin veya URL kullanin.'
      : 'Kayit yapilamadi: bilinmeyen depolama hatasi.';
    window.alert(message);
    return false;
  }
}

function activatePanel(panelName) {
  el.panelNavButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.panelTarget === panelName);
  });
  el.panels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.panel === panelName);
  });
}

function toggleAdminLock(isLocked) {
  if (isLocked) {
    el.lockScreen.hidden = false;
    el.adminContent.hidden = true;
    return;
  }
  el.lockScreen.hidden = true;
  el.adminContent.hidden = false;
}

function renderAdminBrand() {
  const brand = state.siteConfig && state.siteConfig.brand ? state.siteConfig.brand : null;
  if (!brand) return;

  el.adminBrandMarks.forEach((node) => {
    const logoUrl = brand.logoUrl || DEFAULT_BRAND_LOGO_URL;
    if (brand.logoMode === 'image' && logoUrl) {
      node.classList.add('logo-image');
      node.textContent = '';
      node.style.backgroundImage = `url(${logoUrl})`;
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
    node.textContent = brand.markText || 'RD';
  });
}

function countBy(list, field) {
  return list.reduce((acc, item) => {
    const key = text(item[field], 'Belirtilmedi');
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function renderChart(container, entries) {
  if (!container) return;
  const pairs = Object.entries(entries).sort((a, b) => b[1] - a[1]);
  if (pairs.length === 0) {
    container.innerHTML = '<p class="helper-note">Veri bulunmuyor.</p>';
    return;
  }

  const max = Math.max(...pairs.map((item) => item[1]));
  container.innerHTML = pairs
    .map(([label, value]) => {
      const width = max === 0 ? 0 : Math.round((value / max) * 100);
      return `
        <div class="chart-item">
          <div class="chart-meta"><span>${escapeHtml(label)}</span><strong>${value}</strong></div>
          <div class="chart-bar"><span style="width:${width}%"></span></div>
        </div>
      `;
    })
    .join('');
}

function renderRecentActivity() {
  const sorted = [...state.applications].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 8);
  if (sorted.length === 0) {
    el.recentActivity.innerHTML = '<li>Henuz aktivite yok.</li>';
    return;
  }

  el.recentActivity.innerHTML = sorted
    .map((app) => `
      <li>
        <strong>${escapeHtml(app.name || 'Isimsiz basvuru')}</strong> - ${STATUS_LABELS[app.status]}<br>
        <small>${formatDate(app.updatedAt)} | ${escapeHtml(app.role || '-')}</small>
      </li>
    `)
    .join('');
}

function renderDashboard() {
  el.metricTotal.textContent = String(state.applications.length);
  el.metricNew.textContent = String(state.applications.filter((item) => item.status === 'new').length);
  el.metricApproved.textContent = String(state.applications.filter((item) => item.status === 'approved').length);
  el.metricRejected.textContent = String(state.applications.filter((item) => item.status === 'rejected').length);

  renderChart(el.roleChart, countBy(state.applications, 'role'));
  renderChart(el.experienceChart, countBy(state.applications, 'experience'));
  renderRecentActivity();
}

function getFilteredApplications() {
  const query = state.filters.query.trim().toLowerCase();

  return state.applications.filter((app) => {
    const matchesQuery =
      query === ''
      || app.name.toLowerCase().includes(query)
      || app.email.toLowerCase().includes(query)
      || app.phone.toLowerCase().includes(query)
      || app.role.toLowerCase().includes(query);

    const matchesStatus = state.filters.status === 'all' || app.status === state.filters.status;
    const matchesExperience = state.filters.experience === 'all' || app.experience === state.filters.experience;

    return matchesQuery && matchesStatus && matchesExperience;
  });
}

function statusPill(status) {
  return `<span class="status-pill status-${status}">${STATUS_LABELS[status]}</span>`;
}

function renderApplications() {
  const filtered = getFilteredApplications();

  if (filtered.length === 0) {
    el.applicationsBody.innerHTML = '<tr><td colspan="7">Filtreye uygun basvuru bulunamadi.</td></tr>';
    return;
  }

  el.applicationsBody.innerHTML = filtered
    .map((app) => `
      <tr>
        <td><strong>${escapeHtml(app.name || '-')}</strong></td>
        <td>${escapeHtml(app.email || '-')}<br>${escapeHtml(app.phone || '-')}</td>
        <td>${escapeHtml(app.role || '-')}</td>
        <td>${escapeHtml(app.experience || '-')}</td>
        <td>${statusPill(app.status)}</td>
        <td>${formatDate(app.createdAt)}</td>
        <td>
          <div class="row-actions">
            <button class="ghost-btn" data-action="view" data-id="${escapeHtml(app.id)}">Incele</button>
            <button class="ghost-btn" data-action="approve" data-id="${escapeHtml(app.id)}">Onayla</button>
            <button class="danger-btn" data-action="delete" data-id="${escapeHtml(app.id)}">Sil</button>
          </div>
        </td>
      </tr>
    `)
    .join('');
}

function clearApplicationDetail() {
  state.selectedApplicationId = null;
  el.detailName.value = '';
  el.detailEmail.value = '';
  el.detailPhone.value = '';
  el.detailRegion.value = '';
  el.detailMessage.value = '';
  el.detailStatus.value = 'new';
  el.detailAdminNotes.value = '';
}

function findApplicationById(id) {
  return state.applications.find((item) => item.id === id) || null;
}

function selectApplication(id) {
  const app = findApplicationById(id);
  if (!app) {
    clearApplicationDetail();
    setInlineStatus(el.detailStatusText, 'Basvuru bulunamadi.', 'error');
    return;
  }

  state.selectedApplicationId = id;
  el.detailName.value = app.name;
  el.detailEmail.value = app.email;
  el.detailPhone.value = app.phone;
  el.detailRegion.value = app.region;
  el.detailMessage.value = app.notes;
  el.detailStatus.value = app.status;
  el.detailAdminNotes.value = app.adminNotes || '';
  setInlineStatus(el.detailStatusText, `${app.name} secildi.`, 'muted');
}

function updateApplication(id, patch) {
  state.applications = state.applications.map((app) => {
    if (app.id !== id) return app;
    return {
      ...app,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
  });
  saveApplications();
  renderApplications();
  renderDashboard();
}

function deleteApplication(id) {
  state.applications = state.applications.filter((app) => app.id !== id);
  saveApplications();
  renderApplications();
  renderDashboard();
  if (state.selectedApplicationId === id) {
    clearApplicationDetail();
  }
}

function buildCsv(rows) {
  const columns = ['id', 'name', 'email', 'phone', 'role', 'experience', 'status', 'region', 'notes', 'adminNotes', 'createdAt', 'updatedAt'];
  const header = columns.join(',');
  const body = rows.map((row) => columns.map((key) => `"${String(row[key] ?? '').replace(/"/g, '""')}"`).join(','));
  return [header, ...body].join('\n');
}

function downloadText(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importApplicationPayload(raw) {
  let incoming = [];
  if (Array.isArray(raw)) {
    incoming = raw;
  } else if (raw && Array.isArray(raw.applications)) {
    incoming = raw.applications;
  }

  if (incoming.length === 0) {
    throw new Error('Yuklenen dosyada basvuru listesi bulunamadi.');
  }

  const map = new Map(state.applications.map((item) => [item.id, item]));
  incoming.map((item) => normalizeApplication(item)).forEach((item) => map.set(item.id, item));
  state.applications = [...map.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  saveApplications();
  renderApplications();
  renderDashboard();
}

function seedSampleApplications() {
  const now = Date.now();
  const sample = [
    {
      id: uid('app'),
      name: 'Mert Y.',
      email: 'mert@example.com',
      phone: '5551112233',
      role: 'Rifleman',
      experience: 'Orta',
      region: 'Istanbul',
      notes: 'Woodland agirlikli oynamak istiyorum.',
      consent: true,
      status: 'new',
      createdAt: new Date(now - 1000 * 60 * 60 * 8).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 8).toISOString(),
      adminNotes: '',
    },
    {
      id: uid('app'),
      name: 'Ayse K.',
      email: 'ayse@example.com',
      phone: '5559871122',
      role: 'Medic',
      experience: 'Deneyimli',
      region: 'Kocaeli',
      notes: 'Eski takimi dagildi, aktif ekibe katilmak istiyorum.',
      consent: true,
      status: 'reviewing',
      createdAt: new Date(now - 1000 * 60 * 60 * 36).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 30).toISOString(),
      adminNotes: 'Cumartesi orientation daveti gonderildi.',
    },
    {
      id: uid('app'),
      name: 'Berk A.',
      email: 'berk@example.com',
      phone: '5554447788',
      role: 'DMR',
      experience: 'Yeni Baslayan',
      region: 'Istanbul',
      notes: 'Kiralik ekipman talep ediyor.',
      consent: true,
      status: 'approved',
      createdAt: new Date(now - 1000 * 60 * 60 * 72).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
      adminNotes: 'Ilk oyuna ekipman listesi ile dahil olacak.',
    },
  ];

  const map = new Map(state.applications.map((item) => [item.id, item]));
  sample.map((item) => normalizeApplication(item)).forEach((item) => map.set(item.id, item));
  state.applications = [...map.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  saveApplications();
  renderApplications();
  renderDashboard();
}

function renderTeamList() {
  if (!state.teamProfiles.length) {
    el.teamList.innerHTML = '<p class="helper-note">Henuz kart yok.</p>';
    return;
  }

  el.teamList.innerHTML = state.teamProfiles
    .map((profile) => `
      <article class="team-mini-card">
        <img src="${escapeHtml(profile.photo)}" alt="${escapeHtml(profile.name)} ${escapeHtml(profile.callsign)}">
        <div class="team-mini-body">
          <h4>${escapeHtml(profile.name)} "${escapeHtml(profile.callsign)}"</h4>
          <small>${escapeHtml(profile.title)}</small>
          <p>${escapeHtml(profile.bio)}</p>
          <small><strong>Uzmanlik:</strong> ${escapeHtml(profile.expertise)}</small>
          <small><strong>Takimda:</strong> ${escapeHtml(profile.seasons)}</small>
          <small><strong>Setup:</strong> ${escapeHtml(profile.setup)}</small>
          <div class="team-mini-actions">
            <button class="ghost-btn" data-team-action="edit" data-id="${escapeHtml(profile.id)}">Duzenle</button>
            <button class="danger-btn" data-team-action="delete" data-id="${escapeHtml(profile.id)}">Sil</button>
          </div>
        </div>
      </article>
    `)
    .join('');
}

function clearTeamForm() {
  el.teamId.value = '';
  el.teamName.value = '';
  el.teamCallsign.value = '';
  el.teamTitle.value = '';
  el.teamBadge.value = '';
  el.teamPhoto.value = '';
  el.teamBio.value = '';
  el.teamExpertise.value = '';
  el.teamSeasons.value = '';
  el.teamSetup.value = '';
}

function fillTeamForm(profile) {
  el.teamId.value = profile.id;
  el.teamName.value = profile.name;
  el.teamCallsign.value = profile.callsign;
  el.teamTitle.value = profile.title;
  el.teamBadge.value = profile.badge;
  el.teamPhoto.value = profile.photo;
  el.teamBio.value = profile.bio;
  el.teamExpertise.value = profile.expertise;
  el.teamSeasons.value = profile.seasons;
  el.teamSetup.value = profile.setup;
}

function collectTeamForm() {
  return normalizeProfile({
    id: text(el.teamId.value, uid('team')),
    name: el.teamName.value,
    callsign: el.teamCallsign.value,
    title: el.teamTitle.value,
    badge: el.teamBadge.value,
    photo: el.teamPhoto.value,
    bio: el.teamBio.value,
    expertise: el.teamExpertise.value,
    seasons: el.teamSeasons.value,
    setup: el.teamSetup.value,
  });
}

function upsertTeamProfile(profile) {
  const exists = state.teamProfiles.some((item) => item.id === profile.id);
  state.teamProfiles = exists
    ? state.teamProfiles.map((item) => (item.id === profile.id ? profile : item))
    : [profile, ...state.teamProfiles];

  saveTeamProfiles();
  renderTeamList();
}

function deleteTeamProfile(id) {
  state.teamProfiles = state.teamProfiles.filter((item) => item.id !== id);
  saveTeamProfiles();
  renderTeamList();
}

function fillContentTextForm() {
  const home = state.siteConfig.home;
  el.contentHeroEyebrow.value = home.hero.eyebrow;
  el.contentHeroTitleMain.value = home.hero.titleMain;
  el.contentHeroTitleAccent.value = home.hero.titleAccent;
  el.contentHeroLede.value = home.hero.lede;
  el.contentHeroCtaPrimary.value = home.hero.ctaPrimaryText;
  el.contentHeroCtaPrimaryHref.value = home.hero.ctaPrimaryHref;
  el.contentHeroCtaSecondary.value = home.hero.ctaSecondaryText;
  el.contentHeroCtaSecondaryHref.value = home.hero.ctaSecondaryHref;
  el.contentHeroMetrics.value = formatMetricLines(home.metrics);
  el.contentOperationTitle.value = home.operation.title;
  el.contentOperationItems.value = formatLabelValueLines(home.operation.items);
  el.contentOperationTag.value = home.operation.tag;

  el.contentAboutEyebrow.value = home.about.eyebrow;
  el.contentAboutTitle.value = home.about.title;
  el.contentAboutText.value = home.about.text;
  el.contentAboutPills.value = formatLineList(home.about.pills);
  el.contentAboutCriteriaTitle.value = home.about.criteriaTitle;
  el.contentAboutCriteriaItems.value = formatLineList(home.about.criteriaItems);
  el.contentAboutCriteriaNote.value = home.about.criteriaNote;

  el.contentHighlightsEyebrow.value = home.highlights.eyebrow;
  el.contentHighlightsTitle.value = home.highlights.title;
  el.contentHighlightsSubtitle.value = home.highlights.subtitle;

  el.contentFaqEyebrow.value = home.faq.eyebrow;
  el.contentFaqTitle.value = home.faq.title;

  el.contentTeamEyebrow.value = home.team.eyebrow;
  el.contentTeamTitle.value = home.team.title;
  el.contentTeamSubtitle.value = home.team.subtitle;

  el.contentFieldEyebrow.value = home.field.eyebrow;
  el.contentFieldTitle.value = home.field.title;
  el.contentFieldSubtitle.value = home.field.subtitle;
  el.contentFieldNote.value = home.field.note;
  el.contentFieldSchedule.value = formatLabelValueLines(home.field.schedule);
  el.contentFieldChecklistTitle.value = home.field.checklistTitle;
  el.contentFieldChecklistItems.value = formatLineList(home.field.checklist);
  el.contentFieldChecklistNote.value = home.field.checklistNote;

  el.contentApplyEyebrow.value = home.apply.eyebrow;
  el.contentApplyTitle.value = home.apply.title;
  el.contentApplySubtitle.value = home.apply.subtitle;

  el.contentFooterBlurb.value = home.footer.blurb;
  el.contentFooterInstagram.value = home.footer.instagram;
  el.contentFooterEmail.value = home.footer.email;
  el.contentFooterQuickTags.value = formatLineList(home.footer.quickTags);
}

function collectContentTextForm() {
  const parsedMetrics = parseMetricLines(el.contentHeroMetrics.value, state.siteConfig.home.metrics);
  const parsedOperationItems = parseLabelValueLines(
    el.contentOperationItems.value,
    state.siteConfig.home.operation.items,
    'op',
  );
  const parsedSchedule = parseLabelValueLines(
    el.contentFieldSchedule.value,
    state.siteConfig.home.field.schedule,
    'sch',
  );
  const aboutPills = parseLineList(el.contentAboutPills.value);
  const aboutCriteriaItems = parseLineList(el.contentAboutCriteriaItems.value);
  const fieldChecklistItems = parseLineList(el.contentFieldChecklistItems.value);
  const footerQuickTags = parseLineList(el.contentFooterQuickTags.value);

  const next = {
    ...state.siteConfig,
    home: {
      ...state.siteConfig.home,
      hero: {
        ...state.siteConfig.home.hero,
        eyebrow: el.contentHeroEyebrow.value,
        titleMain: el.contentHeroTitleMain.value,
        titleAccent: el.contentHeroTitleAccent.value,
        lede: el.contentHeroLede.value,
        ctaPrimaryText: el.contentHeroCtaPrimary.value,
        ctaPrimaryHref: el.contentHeroCtaPrimaryHref.value,
        ctaSecondaryText: el.contentHeroCtaSecondary.value,
        ctaSecondaryHref: el.contentHeroCtaSecondaryHref.value,
      },
      metrics: parsedMetrics,
      operation: {
        ...state.siteConfig.home.operation,
        title: el.contentOperationTitle.value,
        items: parsedOperationItems,
        tag: el.contentOperationTag.value,
      },
      about: {
        ...state.siteConfig.home.about,
        eyebrow: el.contentAboutEyebrow.value,
        title: el.contentAboutTitle.value,
        text: el.contentAboutText.value,
        pills: aboutPills,
        criteriaTitle: el.contentAboutCriteriaTitle.value,
        criteriaItems: aboutCriteriaItems,
        criteriaNote: el.contentAboutCriteriaNote.value,
      },
      highlights: {
        ...state.siteConfig.home.highlights,
        eyebrow: el.contentHighlightsEyebrow.value,
        title: el.contentHighlightsTitle.value,
        subtitle: el.contentHighlightsSubtitle.value,
      },
      faq: {
        ...state.siteConfig.home.faq,
        eyebrow: el.contentFaqEyebrow.value,
        title: el.contentFaqTitle.value,
      },
      team: {
        ...state.siteConfig.home.team,
        eyebrow: el.contentTeamEyebrow.value,
        title: el.contentTeamTitle.value,
        subtitle: el.contentTeamSubtitle.value,
      },
      field: {
        ...state.siteConfig.home.field,
        eyebrow: el.contentFieldEyebrow.value,
        title: el.contentFieldTitle.value,
        subtitle: el.contentFieldSubtitle.value,
        note: el.contentFieldNote.value,
        schedule: parsedSchedule,
        checklistTitle: el.contentFieldChecklistTitle.value,
        checklist: fieldChecklistItems,
        checklistNote: el.contentFieldChecklistNote.value,
      },
      apply: {
        ...state.siteConfig.home.apply,
        eyebrow: el.contentApplyEyebrow.value,
        title: el.contentApplyTitle.value,
        subtitle: el.contentApplySubtitle.value,
      },
      footer: {
        ...state.siteConfig.home.footer,
        blurb: el.contentFooterBlurb.value,
        instagram: el.contentFooterInstagram.value,
        email: el.contentFooterEmail.value,
        quickTags: footerQuickTags,
      },
    },
  };

  state.siteConfig = next;
  saveSiteConfig();
}

function clearHighlightForm() {
  el.highlightId.value = '';
  el.highlightTitle.value = '';
  el.highlightDescription.value = '';
  el.highlightChip.value = '';
}

function fillHighlightForm(card) {
  el.highlightId.value = card.id;
  el.highlightTitle.value = card.title;
  el.highlightDescription.value = card.description;
  el.highlightChip.value = card.chip;
}

function collectHighlightForm() {
  const source = {
    id: text(el.highlightId.value, uid('hl')),
    title: el.highlightTitle.value,
    description: el.highlightDescription.value,
    chip: el.highlightChip.value,
  };

  return window.SiteConfig ? window.SiteConfig.normalize({ home: { highlights: { cards: [source] } } }).home.highlights.cards[0] : source;
}

function renderHighlightList() {
  const cards = state.siteConfig.home.highlights.cards;
  if (!cards.length) {
    el.highlightList.innerHTML = '<p class="helper-note">Highlight karti yok.</p>';
    return;
  }

  el.highlightList.innerHTML = cards
    .map((card) => `
      <article class="mini-item">
        <div class="mini-item-header">
          <h4>${escapeHtml(card.title)}</h4>
          <div class="row-actions">
            <button class="ghost-btn" data-highlight-action="edit" data-id="${escapeHtml(card.id)}">Duzenle</button>
            <button class="danger-btn" data-highlight-action="delete" data-id="${escapeHtml(card.id)}">Sil</button>
          </div>
        </div>
        <p>${escapeHtml(card.description)}</p>
        <small class="helper-note">Chip: ${escapeHtml(card.chip)}</small>
      </article>
    `)
    .join('');
}

function upsertHighlight(card) {
  const cards = state.siteConfig.home.highlights.cards;
  const exists = cards.some((item) => item.id === card.id);
  state.siteConfig.home.highlights.cards = exists
    ? cards.map((item) => (item.id === card.id ? card : item))
    : [...cards, card];

  saveSiteConfig();
  renderHighlightList();
}

function deleteHighlight(id) {
  state.siteConfig.home.highlights.cards = state.siteConfig.home.highlights.cards.filter((item) => item.id !== id);
  saveSiteConfig();
  renderHighlightList();
}

function clearFaqForm() {
  el.faqId.value = '';
  el.faqQuestionInput.value = '';
  el.faqAnswerInput.value = '';
}

function fillFaqForm(item) {
  el.faqId.value = item.id;
  el.faqQuestionInput.value = item.question;
  el.faqAnswerInput.value = item.answer;
}

function collectFaqForm() {
  return {
    id: text(el.faqId.value, uid('faq')),
    question: el.faqQuestionInput.value,
    answer: el.faqAnswerInput.value,
  };
}

function renderFaqList() {
  const items = state.siteConfig.home.faq.items;
  if (!items.length) {
    el.faqAdminList.innerHTML = '<p class="helper-note">SSS maddesi yok.</p>';
    return;
  }

  el.faqAdminList.innerHTML = items
    .map((item) => `
      <article class="mini-item">
        <div class="mini-item-header">
          <h4>${escapeHtml(item.question)}</h4>
          <div class="row-actions">
            <button class="ghost-btn" data-faq-action="edit" data-id="${escapeHtml(item.id)}">Duzenle</button>
            <button class="danger-btn" data-faq-action="delete" data-id="${escapeHtml(item.id)}">Sil</button>
          </div>
        </div>
        <p>${escapeHtml(item.answer)}</p>
      </article>
    `)
    .join('');
}

function upsertFaqItem(item) {
  const items = state.siteConfig.home.faq.items;
  const exists = items.some((faq) => faq.id === item.id);
  state.siteConfig.home.faq.items = exists
    ? items.map((faq) => (faq.id === item.id ? item : faq))
    : [...items, item];

  saveSiteConfig();
  renderFaqList();
}

function deleteFaqItem(id) {
  state.siteConfig.home.faq.items = state.siteConfig.home.faq.items.filter((item) => item.id !== id);
  saveSiteConfig();
  renderFaqList();
}

function fillBrandForm() {
  el.brandLogoMode.value = state.siteConfig.brand.logoMode;
  el.brandMarkText.value = state.siteConfig.brand.markText;
  el.brandName.value = state.siteConfig.brand.name;
  el.brandTagline.value = state.siteConfig.brand.tagline;
  el.brandLogoUrl.value = state.siteConfig.brand.logoUrl;
  el.navApplyLabel.value = state.siteConfig.nav.applyLabel;
  el.navApplyHref.value = state.siteConfig.nav.applyHref;
}

function collectBrandForm() {
  state.siteConfig.brand = {
    ...state.siteConfig.brand,
    logoMode: el.brandLogoMode.value === 'image' ? 'image' : 'text',
    markText: el.brandMarkText.value,
    name: el.brandName.value,
    tagline: el.brandTagline.value,
    logoUrl: el.brandLogoUrl.value,
  };

  state.siteConfig.nav = {
    ...state.siteConfig.nav,
    applyLabel: el.navApplyLabel.value,
    applyHref: el.navApplyHref.value,
  };

  saveSiteConfig();
}

function clearCategoryForm() {
  el.categoryId.value = '';
  el.categoryLabel.value = '';
  el.categorySlug.value = '';
  el.categoryEyebrow.value = 'Kategori';
  el.categoryTitle.value = '';
  el.categoryIntro.value = '';
  el.categoryCtaLabel.value = 'Detaya Git';
  el.categoryCtaHref.value = 'index.html#apply';
  el.categoryShowMenu.checked = true;
}

function fillCategoryForm(category) {
  el.categoryId.value = category.id;
  el.categoryLabel.value = category.label;
  el.categorySlug.value = category.slug;
  el.categoryEyebrow.value = category.eyebrow;
  el.categoryTitle.value = category.title;
  el.categoryIntro.value = category.intro;
  el.categoryCtaLabel.value = category.ctaLabel;
  el.categoryCtaHref.value = category.ctaHref;
  el.categoryShowMenu.checked = category.showInMenu;
}

function getSlug(value, fallback) {
  if (window.SiteConfig && typeof window.SiteConfig.slugify === 'function') {
    return window.SiteConfig.slugify(value, fallback);
  }
  return text(value, fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || fallback;
}

function collectCategoryForm() {
  const label = text(el.categoryLabel.value, 'Kategori');
  return {
    id: text(el.categoryId.value, uid('cat')),
    slug: getSlug(el.categorySlug.value || label, 'category'),
    label,
    showInMenu: Boolean(el.categoryShowMenu.checked),
    eyebrow: text(el.categoryEyebrow.value, 'Kategori'),
    title: text(el.categoryTitle.value, label),
    intro: text(el.categoryIntro.value, ''),
    ctaLabel: text(el.categoryCtaLabel.value, 'Detaya Git'),
    ctaHref: text(el.categoryCtaHref.value, 'index.html#apply'),
    blocks: [],
  };
}

function getCategoryById(id) {
  return state.siteConfig.categories.find((item) => item.id === id) || null;
}

function renderCategoryList() {
  const categories = state.siteConfig.categories;
  if (!categories.length) {
    el.categoryList.innerHTML = '<p class="helper-note">Kategori yok.</p>';
    return;
  }

  el.categoryList.innerHTML = categories
    .map((category) => `
      <article class="mini-item">
        <div class="mini-item-header">
          <h4>${escapeHtml(category.label)} <small>(${escapeHtml(category.slug)})</small></h4>
          <div class="row-actions">
            <button class="ghost-btn" data-category-action="edit" data-id="${escapeHtml(category.id)}">Duzenle</button>
            <button class="ghost-btn" data-category-action="blocks" data-id="${escapeHtml(category.id)}">Bloklar</button>
            <button class="danger-btn" data-category-action="delete" data-id="${escapeHtml(category.id)}">Sil</button>
          </div>
        </div>
        <p>${escapeHtml(category.intro)}</p>
        <small class="helper-note">Menu: ${category.showInMenu ? 'Acik' : 'Kapali'} | CTA: ${escapeHtml(category.ctaLabel)}</small>
      </article>
    `)
    .join('');
}

function upsertCategory(categoryInput) {
  const categories = state.siteConfig.categories;
  const exists = categories.some((item) => item.id === categoryInput.id);

  const category = {
    ...categoryInput,
    blocks: exists ? (getCategoryById(categoryInput.id)?.blocks || []) : [],
  };

  state.siteConfig.categories = exists
    ? categories.map((item) => (item.id === category.id ? { ...item, ...category } : item))
    : [...categories, category];

  saveSiteConfig();
  renderCategoryManager();
}

function deleteCategory(id) {
  state.siteConfig.categories = state.siteConfig.categories.filter((item) => item.id !== id);
  if (state.selectedCategoryId === id) {
    state.selectedCategoryId = null;
  }
  saveSiteConfig();
  renderCategoryManager();
}

function renderCategorySelect() {
  const categories = state.siteConfig.categories;
  if (!categories.length) {
    el.categoryBlockCategory.innerHTML = '<option value="">Kategori Yok</option>';
    return;
  }

  if (!state.selectedCategoryId || !getCategoryById(state.selectedCategoryId)) {
    state.selectedCategoryId = categories[0].id;
  }

  el.categoryBlockCategory.innerHTML = categories
    .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.label)} (${escapeHtml(item.slug)})</option>`)
    .join('');

  el.categoryBlockCategory.value = state.selectedCategoryId;
}

function clearCategoryBlockForm() {
  el.categoryBlockId.value = '';
  el.categoryBlockTitle.value = '';
  el.categoryBlockText.value = '';
  el.categoryBlockTag.value = '';
  el.categoryBlockImage.value = '';
  el.categoryBlockUrl.value = '';
  el.categoryBlockGallery.value = '';
  if (el.categoryBlockImageFile) {
    el.categoryBlockImageFile.value = '';
  }
}

function fillCategoryBlockForm(block, categoryId) {
  state.selectedCategoryId = categoryId;
  renderCategorySelect();
  el.categoryBlockId.value = block.id;
  el.categoryBlockTitle.value = block.title;
  el.categoryBlockText.value = block.text;
  el.categoryBlockTag.value = block.tag;
  el.categoryBlockImage.value = text(block.imageUrl, '');
  el.categoryBlockUrl.value = text(block.url, '');
  el.categoryBlockGallery.value = formatLineList(block.gallery);
  if (el.categoryBlockImageFile) {
    el.categoryBlockImageFile.value = '';
  }
}

function collectCategoryBlockForm() {
  return {
    id: text(el.categoryBlockId.value, uid('block')),
    title: text(el.categoryBlockTitle.value, 'Blok'),
    text: text(el.categoryBlockText.value, ''),
    tag: text(el.categoryBlockTag.value, ''),
    imageUrl: text(el.categoryBlockImage.value, ''),
    url: text(el.categoryBlockUrl.value, ''),
    gallery: parseLineList(el.categoryBlockGallery.value),
  };
}

function renderCategoryBlockList() {
  const categoryId = el.categoryBlockCategory.value || state.selectedCategoryId;
  const category = getCategoryById(categoryId);
  if (!category) {
    el.categoryBlockList.innerHTML = '<p class="helper-note">Kategori sec.</p>';
    return;
  }

  if (!category.blocks.length) {
    el.categoryBlockList.innerHTML = '<p class="helper-note">Bu kategori icin blok yok.</p>';
    return;
  }

  el.categoryBlockList.innerHTML = category.blocks
    .map((block) => `
      <article class="mini-item">
        ${block.imageUrl ? `<img src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.title)}" style="width:100%;height:140px;object-fit:cover;border-radius:8px;margin-bottom:8px;border:1px solid rgba(255,255,255,0.12);">` : ''}
        <div class="mini-item-header">
          <h4>${escapeHtml(block.title)}</h4>
          <div class="row-actions">
            <button class="ghost-btn" data-category-block-action="edit" data-category-id="${escapeHtml(category.id)}" data-id="${escapeHtml(block.id)}">Duzenle</button>
            <button class="danger-btn" data-category-block-action="delete" data-category-id="${escapeHtml(category.id)}" data-id="${escapeHtml(block.id)}">Sil</button>
          </div>
        </div>
        <p>${escapeHtml(block.text)}</p>
        <small class="helper-note">Etiket: ${escapeHtml(block.tag || '-')} | Link: ${escapeHtml(block.url || '-')} | Galeri: ${Array.isArray(block.gallery) ? block.gallery.length : 0}</small>
      </article>
    `)
    .join('');
}

function fileToOptimizedDataUrl(file, maxSize = 1600, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const ratio = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * ratio));
        const height = Math.max(1, Math.round(image.height * ratio));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context olusturulamadi.'));
          return;
        }

        ctx.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      image.onerror = () => reject(new Error('Gorsel dosyasi okunamadi.'));
      image.src = String(reader.result || '');
    };
    reader.onerror = () => reject(new Error('Dosya okunamadi.'));
    reader.readAsDataURL(file);
  });
}

function upsertCategoryBlock(categoryId, block) {
  const previous = JSON.parse(JSON.stringify(state.siteConfig.categories));
  state.siteConfig.categories = state.siteConfig.categories.map((category) => {
    if (category.id !== categoryId) return category;
    const exists = category.blocks.some((item) => item.id === block.id);
    return {
      ...category,
      blocks: exists
        ? category.blocks.map((item) => (item.id === block.id ? block : item))
        : [...category.blocks, block],
    };
  });

  if (!saveSiteConfig()) {
    state.siteConfig.categories = previous;
    return false;
  }
  renderCategoryManager();
  return true;
}

function deleteCategoryBlock(categoryId, blockId) {
  const previous = JSON.parse(JSON.stringify(state.siteConfig.categories));
  state.siteConfig.categories = state.siteConfig.categories.map((category) => {
    if (category.id !== categoryId) return category;
    return {
      ...category,
      blocks: category.blocks.filter((item) => item.id !== blockId),
    };
  });

  if (!saveSiteConfig()) {
    state.siteConfig.categories = previous;
    return false;
  }
  renderCategoryManager();
  return true;
}

function fillSiteConfigJson() {
  el.siteConfigJson.value = JSON.stringify(state.siteConfig, null, 2);
}

function renderCategoryManager() {
  renderCategoryList();
  renderCategorySelect();
  renderCategoryBlockList();
  fillSiteConfigJson();
}

function renderContentManager() {
  fillContentTextForm();
  renderHighlightList();
  renderFaqList();
  fillBrandForm();
  renderAdminBrand();
  renderCategoryManager();
}

function exportAllData() {
  const payload = {
    exportedAt: new Date().toISOString(),
    applications: state.applications,
    teamProfiles: state.teamProfiles,
    siteConfig: state.siteConfig,
  };
  downloadText(`reddevil-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(payload, null, 2), 'application/json');
}

function importAllData(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Yedek formati gecersiz.');
  }

  if (Array.isArray(raw.applications)) {
    state.applications = raw.applications.map((item) => normalizeApplication(item)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    saveApplications();
  }

  if (Array.isArray(raw.teamProfiles) && raw.teamProfiles.length > 0) {
    state.teamProfiles = raw.teamProfiles.map((item, index) => normalizeProfile(item, index));
    saveTeamProfiles();
  }

  if (raw.siteConfig && typeof raw.siteConfig === 'object') {
    if (window.SiteConfig) {
      state.siteConfig = window.SiteConfig.save(raw.siteConfig);
    } else {
      state.siteConfig = raw.siteConfig;
    }
  }

  clearApplicationDetail();
  clearTeamForm();
  clearHighlightForm();
  clearFaqForm();
  clearCategoryForm();
  clearCategoryBlockForm();
  renderApplications();
  renderDashboard();
  renderTeamList();
  renderContentManager();
}

function bindEvents() {
  el.panelNavButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (el.adminContent.hidden) return;
      activatePanel(btn.dataset.panelTarget);
    });
  });

  el.loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (el.adminPass.value === getPasscode()) {
      setSession(true);
      toggleAdminLock(false);
      setInlineStatus(el.loginStatus, 'Giris basarili.', 'success');
      el.adminPass.value = '';
      return;
    }
    setInlineStatus(el.loginStatus, 'Sifre yanlis.', 'error');
  });

  el.logoutBtn?.addEventListener('click', () => {
    setSession(false);
    toggleAdminLock(true);
    setInlineStatus(el.loginStatus, 'Oturum kapatildi.', 'muted');
  });

  el.searchInput?.addEventListener('input', () => {
    state.filters.query = el.searchInput.value;
    renderApplications();
  });

  el.statusFilter?.addEventListener('change', () => {
    state.filters.status = el.statusFilter.value;
    renderApplications();
  });

  el.experienceFilter?.addEventListener('change', () => {
    state.filters.experience = el.experienceFilter.value;
    renderApplications();
  });

  el.applicationsBody?.addEventListener('click', (event) => {
    const target = event.target.closest('button[data-action]');
    if (!target) return;

    const id = target.dataset.id;
    if (!id) return;

    if (target.dataset.action === 'view') {
      selectApplication(id);
      return;
    }

    if (target.dataset.action === 'approve') {
      updateApplication(id, { status: 'approved' });
      selectApplication(id);
      setInlineStatus(el.detailStatusText, 'Durum: Onaylandi', 'success');
      return;
    }

    if (target.dataset.action === 'delete') {
      if (!window.confirm('Bu basvuru silinsin mi?')) return;
      deleteApplication(id);
      setInlineStatus(el.detailStatusText, 'Basvuru silindi.', 'muted');
    }
  });

  el.detailForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!state.selectedApplicationId) {
      setInlineStatus(el.detailStatusText, 'Once bir basvuru secin.', 'error');
      return;
    }

    updateApplication(state.selectedApplicationId, {
      status: el.detailStatus.value,
      adminNotes: el.detailAdminNotes.value.trim(),
    });
    selectApplication(state.selectedApplicationId);
    setInlineStatus(el.detailStatusText, 'Basvuru guncellendi.', 'success');
  });

  el.deleteSelectedBtn?.addEventListener('click', () => {
    if (!state.selectedApplicationId) {
      setInlineStatus(el.detailStatusText, 'Silmek icin basvuru secin.', 'error');
      return;
    }
    if (!window.confirm('Secili basvuru silinsin mi?')) return;
    deleteApplication(state.selectedApplicationId);
    setInlineStatus(el.detailStatusText, 'Secili basvuru silindi.', 'muted');
  });

  el.exportCsvBtn?.addEventListener('click', () => {
    const csv = buildCsv(state.applications);
    downloadText(`reddevil-basvurular-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv;charset=utf-8');
  });

  el.exportJsonBtn?.addEventListener('click', () => {
    downloadText(`reddevil-basvurular-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(state.applications, null, 2), 'application/json');
  });

  el.importAppsTrigger?.addEventListener('click', () => {
    el.importAppsInput?.click();
  });

  el.importAppsInput?.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsed = safeParse(await file.text(), null);
      importApplicationPayload(parsed);
      setInlineStatus(el.detailStatusText, 'Basvurular ice aktarildi.', 'success');
    } catch (error) {
      setInlineStatus(el.detailStatusText, error.message || 'Ice aktarma hatasi.', 'error');
    } finally {
      el.importAppsInput.value = '';
    }
  });

  el.seedSamplesBtn?.addEventListener('click', () => {
    seedSampleApplications();
    setInlineStatus(el.detailStatusText, 'Ornek veriler eklendi.', 'success');
  });

  el.deleteAllBtn?.addEventListener('click', () => {
    if (!window.confirm('Tum basvurular kalici olarak silinsin mi?')) return;
    state.applications = [];
    saveApplications();
    clearApplicationDetail();
    renderApplications();
    renderDashboard();
    setInlineStatus(el.detailStatusText, 'Tum basvurular silindi.', 'muted');
  });

  el.teamForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    upsertTeamProfile(collectTeamForm());
    clearTeamForm();
    setInlineStatus(el.teamStatus, 'Takim karti kaydedildi.', 'success');
  });

  el.clearTeamForm?.addEventListener('click', () => {
    clearTeamForm();
    setInlineStatus(el.teamStatus, 'Form temizlendi.', 'muted');
  });

  el.resetTeamDefaults?.addEventListener('click', () => {
    if (!window.confirm('Takim kartlari varsayilanlara donsun mu?')) return;
    state.teamProfiles = DEFAULT_TEAM_PROFILES.map((item, index) => normalizeProfile(item, index));
    saveTeamProfiles();
    renderTeamList();
    clearTeamForm();
    setInlineStatus(el.teamStatus, 'Varsayilan kartlar yuklendi.', 'success');
  });

  el.teamList?.addEventListener('click', (event) => {
    const target = event.target.closest('button[data-team-action]');
    if (!target) return;

    const id = target.dataset.id;
    if (!id) return;

    if (target.dataset.teamAction === 'edit') {
      const profile = state.teamProfiles.find((item) => item.id === id);
      if (!profile) return;
      fillTeamForm(profile);
      setInlineStatus(el.teamStatus, `${profile.name} duzenleme moduna alindi.`, 'muted');
      return;
    }

    if (target.dataset.teamAction === 'delete') {
      if (!window.confirm('Bu takim karti silinsin mi?')) return;
      deleteTeamProfile(id);
      setInlineStatus(el.teamStatus, 'Takim karti silindi.', 'muted');
    }
  });

  el.contentTextForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    collectContentTextForm();
    fillSiteConfigJson();
    setInlineStatus(el.contentStatus, 'Ana metinler kaydedildi.', 'success');
  });

  el.resetContentDefaults?.addEventListener('click', () => {
    if (!window.confirm('Tum site icerikleri varsayilanlara donsun mu?')) return;
    if (window.SiteConfig) {
      state.siteConfig = window.SiteConfig.save(window.SiteConfig.clone(window.SiteConfig.DEFAULT_SITE_CONFIG));
    }
    clearHighlightForm();
    clearFaqForm();
    clearCategoryForm();
    clearCategoryBlockForm();
    renderContentManager();
    setInlineStatus(el.contentStatus, 'Tum site icerikleri varsayilana dondu.', 'success');
  });

  el.highlightForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    upsertHighlight(collectHighlightForm());
    clearHighlightForm();
    fillSiteConfigJson();
    setInlineStatus(el.highlightStatus, 'Highlight karti kaydedildi.', 'success');
  });

  el.clearHighlightForm?.addEventListener('click', () => {
    clearHighlightForm();
    setInlineStatus(el.highlightStatus, 'Form temizlendi.', 'muted');
  });

  el.highlightList?.addEventListener('click', (event) => {
    const target = event.target.closest('button[data-highlight-action]');
    if (!target) return;

    const id = target.dataset.id;
    if (!id) return;

    if (target.dataset.highlightAction === 'edit') {
      const card = state.siteConfig.home.highlights.cards.find((item) => item.id === id);
      if (!card) return;
      fillHighlightForm(card);
      setInlineStatus(el.highlightStatus, 'Kart duzenleme modunda.', 'muted');
      return;
    }

    if (target.dataset.highlightAction === 'delete') {
      if (!window.confirm('Bu highlight karti silinsin mi?')) return;
      deleteHighlight(id);
      if (el.highlightId.value === id) clearHighlightForm();
      fillSiteConfigJson();
      setInlineStatus(el.highlightStatus, 'Kart silindi.', 'muted');
    }
  });

  el.faqFormAdmin?.addEventListener('submit', (event) => {
    event.preventDefault();
    upsertFaqItem(collectFaqForm());
    clearFaqForm();
    fillSiteConfigJson();
    setInlineStatus(el.faqStatus, 'SSS kaydedildi.', 'success');
  });

  el.clearFaqForm?.addEventListener('click', () => {
    clearFaqForm();
    setInlineStatus(el.faqStatus, 'Form temizlendi.', 'muted');
  });

  el.faqAdminList?.addEventListener('click', (event) => {
    const target = event.target.closest('button[data-faq-action]');
    if (!target) return;

    const id = target.dataset.id;
    if (!id) return;

    if (target.dataset.faqAction === 'edit') {
      const item = state.siteConfig.home.faq.items.find((faqItem) => faqItem.id === id);
      if (!item) return;
      fillFaqForm(item);
      setInlineStatus(el.faqStatus, 'SSS duzenleme modunda.', 'muted');
      return;
    }

    if (target.dataset.faqAction === 'delete') {
      if (!window.confirm('Bu SSS maddesi silinsin mi?')) return;
      deleteFaqItem(id);
      if (el.faqId.value === id) clearFaqForm();
      fillSiteConfigJson();
      setInlineStatus(el.faqStatus, 'SSS maddesi silindi.', 'muted');
    }
  });

  el.brandForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    collectBrandForm();
    renderAdminBrand();
    fillSiteConfigJson();
    setInlineStatus(el.brandStatus, 'Logo ve navigasyon ayarlari kaydedildi.', 'success');
  });

  el.categoryForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const draft = collectCategoryForm();
    const duplicateSlug = state.siteConfig.categories.find((item) => item.slug === draft.slug && item.id !== draft.id);
    if (duplicateSlug) {
      setInlineStatus(el.categoryStatus, `Bu slug zaten kullaniliyor: ${draft.slug}`, 'error');
      return;
    }

    upsertCategory(draft);
    clearCategoryForm();
    fillSiteConfigJson();
    setInlineStatus(el.categoryStatus, 'Kategori kaydedildi.', 'success');
  });

  el.clearCategoryForm?.addEventListener('click', () => {
    clearCategoryForm();
    setInlineStatus(el.categoryStatus, 'Form temizlendi.', 'muted');
  });

  el.categoryList?.addEventListener('click', (event) => {
    const target = event.target.closest('button[data-category-action]');
    if (!target) return;

    const id = target.dataset.id;
    if (!id) return;

    if (target.dataset.categoryAction === 'edit') {
      const category = getCategoryById(id);
      if (!category) return;
      fillCategoryForm(category);
      setInlineStatus(el.categoryStatus, `${category.label} duzenleme modunda.`, 'muted');
      return;
    }

    if (target.dataset.categoryAction === 'blocks') {
      state.selectedCategoryId = id;
      renderCategoryManager();
      setInlineStatus(el.categoryBlockStatus, 'Blok yonetimi secilen kategoriye gecti.', 'muted');
      return;
    }

    if (target.dataset.categoryAction === 'delete') {
      if (!window.confirm('Bu kategori silinsin mi?')) return;
      deleteCategory(id);
      clearCategoryForm();
      clearCategoryBlockForm();
      fillSiteConfigJson();
      setInlineStatus(el.categoryStatus, 'Kategori silindi.', 'muted');
    }
  });

  el.categoryBlockCategory?.addEventListener('change', () => {
    state.selectedCategoryId = el.categoryBlockCategory.value;
    renderCategoryBlockList();
  });

  el.categoryBlockImageFile?.addEventListener('change', async () => {
    const file = el.categoryBlockImageFile.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setInlineStatus(el.categoryBlockStatus, 'Yuklenen dosya bir gorsel degil.', 'error');
      el.categoryBlockImageFile.value = '';
      return;
    }
    try {
      const optimizedDataUrl = await fileToOptimizedDataUrl(file);
      el.categoryBlockImage.value = optimizedDataUrl;
      setInlineStatus(el.categoryBlockStatus, 'Gorsel optimize edildi ve eklendi.', 'success');
    } catch (error) {
      console.error(error);
      setInlineStatus(el.categoryBlockStatus, 'Gorsel okunamadi.', 'error');
    }
  });

  el.categoryBlockForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const categoryId = el.categoryBlockCategory.value;
    if (!categoryId) {
      setInlineStatus(el.categoryBlockStatus, 'Once kategori secin.', 'error');
      return;
    }

    const saved = upsertCategoryBlock(categoryId, collectCategoryBlockForm());
    if (!saved) {
      setInlineStatus(el.categoryBlockStatus, 'Kategori blogu kaydedilemedi.', 'error');
      return;
    }
    clearCategoryBlockForm();
    state.selectedCategoryId = categoryId;
    fillSiteConfigJson();
    setInlineStatus(el.categoryBlockStatus, 'Kategori blogu kaydedildi.', 'success');
  });

  el.clearCategoryBlockForm?.addEventListener('click', () => {
    clearCategoryBlockForm();
    setInlineStatus(el.categoryBlockStatus, 'Form temizlendi.', 'muted');
  });

  el.categoryBlockList?.addEventListener('click', (event) => {
    const target = event.target.closest('button[data-category-block-action]');
    if (!target) return;

    const categoryId = target.dataset.categoryId;
    const blockId = target.dataset.id;
    if (!categoryId || !blockId) return;

    const category = getCategoryById(categoryId);
    if (!category) return;

    if (target.dataset.categoryBlockAction === 'edit') {
      const block = category.blocks.find((item) => item.id === blockId);
      if (!block) return;
      fillCategoryBlockForm(block, categoryId);
      setInlineStatus(el.categoryBlockStatus, 'Blok duzenleme modunda.', 'muted');
      return;
    }

    if (target.dataset.categoryBlockAction === 'delete') {
      if (!window.confirm('Bu blok silinsin mi?')) return;
      const deleted = deleteCategoryBlock(categoryId, blockId);
      if (!deleted) {
        setInlineStatus(el.categoryBlockStatus, 'Kategori blogu silinemedi.', 'error');
        return;
      }
      clearCategoryBlockForm();
      state.selectedCategoryId = categoryId;
      fillSiteConfigJson();
      setInlineStatus(el.categoryBlockStatus, 'Kategori blogu silindi.', 'muted');
    }
  });

  el.siteConfigJsonForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const parsed = safeParse(el.siteConfigJson.value, null);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('JSON formati gecersiz.');
      }
      state.siteConfig = window.SiteConfig ? window.SiteConfig.save(parsed) : parsed;
      renderContentManager();
      clearCategoryForm();
      clearCategoryBlockForm();
      setInlineStatus(el.siteConfigJsonStatus, 'JSON uygulanip kaydedildi.', 'success');
    } catch (error) {
      setInlineStatus(el.siteConfigJsonStatus, error.message || 'JSON uygulanamadi.', 'error');
    }
  });

  el.reloadSiteConfigJson?.addEventListener('click', () => {
    fillSiteConfigJson();
    setInlineStatus(el.siteConfigJsonStatus, 'JSON editor yenilendi.', 'muted');
  });

  el.passcodeForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const newPass = text(el.newPasscode.value);
    if (newPass.length < 6) {
      setInlineStatus(el.settingsStatus, 'Sifre en az 6 karakter olmali.', 'error');
      return;
    }

    localStorage.setItem(KEYS.passcode, newPass);
    el.newPasscode.value = '';
    setInlineStatus(el.settingsStatus, 'Panel sifresi guncellendi.', 'success');
  });

  el.exportAllBtn?.addEventListener('click', () => {
    exportAllData();
    setInlineStatus(el.settingsStatus, 'Yedek dosyasi indirildi.', 'success');
  });

  el.importAllTrigger?.addEventListener('click', () => {
    el.importAllInput?.click();
  });

  el.importAllInput?.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsed = safeParse(await file.text(), null);
      importAllData(parsed);
      setInlineStatus(el.settingsStatus, 'Yedekten geri yukleme tamamlandi.', 'success');
    } catch (error) {
      setInlineStatus(el.settingsStatus, error.message || 'Yedek yuklenemedi.', 'error');
    } finally {
      el.importAllInput.value = '';
    }
  });
}

function bootstrap() {
  state.applications = loadApplications();
  saveApplications();

  state.teamProfiles = loadTeamProfiles();
  saveTeamProfiles();

  state.siteConfig = loadSiteConfig();
  saveSiteConfig();

  bindEvents();
  activatePanel('dashboard');
  renderApplications();
  renderDashboard();
  renderTeamList();
  renderContentManager();
  clearApplicationDetail();
  clearHighlightForm();
  clearFaqForm();
  clearCategoryForm();
  clearCategoryBlockForm();

  toggleAdminLock(!isSessionActive());
}

bootstrap();
