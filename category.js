const TEAM_STORAGE_KEY = 'reddevil_team_profiles';

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

function loadTeamProfiles() {
  try {
    const raw = JSON.parse(localStorage.getItem(TEAM_STORAGE_KEY));
    if (Array.isArray(raw) && raw.length > 0) return raw;
  } catch {}
  return DEFAULT_TEAM_PROFILES;
}

function renderTeamCategory(config) {
  const category = config.categories.find((c) => c.slug === 'team') || {};
  setText('category-eyebrow', category.eyebrow || 'Ekip');
  setText('category-title', category.title || 'Takim Kadrosu');
  setText('category-intro', category.intro || '');

  const cta = document.querySelector('#category-cta');
  if (cta) {
    cta.textContent = category.ctaLabel || 'Basvuruya Git';
    const href = category.ctaHref || 'index.html#apply';
    cta.href = href.startsWith('#') ? `index.html${href}` : href;
  }

  const blockGrid = document.querySelector('#category-block-grid');
  const emptyNode = document.querySelector('#category-empty');
  if (!blockGrid) return;

  const profiles = loadTeamProfiles();

  if (!profiles.length) {
    if (emptyNode) emptyNode.hidden = false;
    return;
  }

  if (emptyNode) emptyNode.hidden = true;
  blockGrid.className = 'category-team-grid';
  blockGrid.innerHTML = profiles.map((p) => `
    <article class="category-person-card">
      <img class="category-person-photo" loading="lazy" src="${escapeHtml(p.photo || '')}" alt="${escapeHtml(p.name)} ${escapeHtml(p.callsign)} portresi">
      <div class="category-person-body">
        <header class="category-person-header">
          <div>
            <h3>${escapeHtml(p.name)} &ldquo;${escapeHtml(p.callsign)}&rdquo;</h3>
            <small>${escapeHtml(p.title)}</small>
          </div>
          <span class="category-role-badge">${escapeHtml(p.badge)}</span>
        </header>
        <p>${escapeHtml(p.bio)}</p>
        <ul class="category-person-meta">
          <li><span>Uzmanlik</span><strong>${escapeHtml(p.expertise)}</strong></li>
          <li><span>Takimda</span><strong>${escapeHtml(p.seasons)}</strong></li>
          <li><span>Favori setup</span><strong>${escapeHtml(p.setup)}</strong></li>
        </ul>
      </div>
    </article>
  `).join('');

  document.title = `${category.label || 'Ekip'} | ${config.brand.name}`;
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

function getSlugParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug') || '';
}

function text(value, fallback = '') {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function sponsorUrlFallback(block) {
  const byTitle = text(block?.title, '').toLowerCase();
  const byTag = text(block?.tag, '').toLowerCase();
  const source = `${byTitle} ${byTag}`;

  if (source.includes('vector')) return 'https://www.vectoroptics.com';
  if (source.includes('izmir') || source.includes('av market')) return 'https://izmiravmarket.com';
  if (source.includes('isg')) return 'https://isgairsoft.com';
  if (source.includes('armorion')) return 'https://www.armorion.com';
  if (source.includes('poligun')) return 'https://poligunstore.com';
  return '';
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
  const nav = document.querySelector('#category-nav-links');
  const footerLinks = document.querySelector('#category-footer-links');
  if (!nav) return;

  const visibleCategories = config.categories.filter((item) => item.showInMenu);
  nav.innerHTML = visibleCategories
    .map((category) => `<a href="category.html?slug=${encodeURIComponent(category.slug)}">${escapeHtml(category.label)}</a>`)
    .join('');

  const rawApplyHref = config.nav.applyHref || 'index.html#apply';
  const navApplyHref = rawApplyHref.startsWith('#') ? `index.html${rawApplyHref}` : rawApplyHref;
  const applyLink = document.createElement('a');
  applyLink.className = 'nav-cta';
  applyLink.href = navApplyHref;
  applyLink.textContent = config.nav.applyLabel || 'Basvur';
  nav.appendChild(applyLink);

  if (footerLinks) {
    footerLinks.innerHTML = visibleCategories
      .map((category) => `<a class="footer-pill" href="category.html?slug=${encodeURIComponent(category.slug)}">${escapeHtml(category.label)}</a>`)
      .join('');
  }
}

function renderCategory(config) {
  const slug = getSlugParam();

  if (slug === 'team') {
    renderTeamCategory(config);
    return;
  }

  const category = config.categories.find((item) => item.slug === slug) || config.categories[0];
  const isSponsorCategory = category.slug === 'sponsors';
  const isEventsCategory = category.slug === 'events';

  setText('category-eyebrow', category.eyebrow);
  setText('category-title', category.title);
  setText('category-intro', category.intro);

  const cta = document.querySelector('#category-cta');
  if (cta) {
    cta.textContent = category.ctaLabel;
    cta.href = category.ctaHref.startsWith('#') ? `index.html${category.ctaHref}` : category.ctaHref;
  }

  const blockGrid = document.querySelector('#category-block-grid');
  const emptyNode = document.querySelector('#category-empty');
  if (!blockGrid) return;

  if (!Array.isArray(category.blocks) || category.blocks.length === 0) {
    blockGrid.classList.remove('category-block-grid--sponsors');
    blockGrid.innerHTML = '';
    if (emptyNode) emptyNode.hidden = false;
  } else {
    if (emptyNode) emptyNode.hidden = true;
    if (isSponsorCategory) {
      blockGrid.classList.add('category-block-grid--sponsors');
      blockGrid.innerHTML = category.blocks
        .map((block) => {
          const sponsorUrl = sponsorUrlFallback(block) || text(block?.url, '');
          const isVector = /vector\s*optics/i.test(block?.title || '') || /vectoroptics/i.test(sponsorUrl);
          return `
            <article class="category-block category-sponsor-block">
              <a class="category-sponsor-logo-wrap${isVector ? ' category-sponsor-logo-wrap--vector' : ''}" href="${escapeHtml(sponsorUrl || '#')}" ${sponsorUrl ? 'target="_blank" rel="noopener noreferrer"' : ''} title="${escapeHtml(block.title)}">
                ${block.imageUrl
                  ? `<img class="category-sponsor-logo" src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.title)} logo">`
                  : `<span class="category-sponsor-fallback">${escapeHtml(block.title)}</span>`}
              </a>
              <h3>${escapeHtml(block.title)}</h3>
              <p>${escapeHtml(block.text)}</p>
              <div class="category-sponsor-meta">
                ${block.tag ? `<span class="category-badge">${escapeHtml(block.tag)}</span>` : ''}
                ${sponsorUrl ? `<a class="category-sponsor-link" href="${escapeHtml(sponsorUrl)}" target="_blank" rel="noopener noreferrer">Web Sitesi</a>` : ''}
              </div>
            </article>
          `;
        })
        .join('');
    } else {
      blockGrid.classList.remove('category-block-grid--sponsors');
      blockGrid.innerHTML = category.blocks
        .map((block) => {
          const card = `
            <article class="category-block${isEventsCategory ? ' category-block--event' : ''}">
              ${block.imageUrl ? `<img class="category-block-media" src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.title)}">` : ''}
              <h3>${escapeHtml(block.title)}</h3>
              <p>${escapeHtml(block.text)}</p>
              ${block.tag ? `<span class="category-badge">${escapeHtml(block.tag)}</span>` : ''}
            </article>
          `;

          if (isEventsCategory) {
            return `<a class="category-event-link" href="event.html?slug=${encodeURIComponent(category.slug)}&event=${encodeURIComponent(block.id)}" aria-label="${escapeHtml(block.title)} etkinlik detayina git">${card}</a>`;
          }

          const blockUrl = text(block?.url, '');
          if (blockUrl) {
            const isExternal = /^https?:\/\//i.test(blockUrl);
            return `<a class="category-event-link" href="${escapeHtml(blockUrl)}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} aria-label="${escapeHtml(block.title)} baglantisina git">${card}</a>`;
          }

          return card;
        })
        .join('');
    }
  }

  document.title = `${category.label} | ${config.brand.name}`;
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

function renderFooter(config) {
  setText('category-footer-blurb', config.home.footer.blurb);
  setText('category-footer-instagram', config.home.footer.instagram);
  setText('category-footer-email', config.home.footer.email);

  const tagsContainer = document.querySelector('#category-footer-mini-tags');
  if (tagsContainer) {
    const tags = Array.isArray(config.home.footer.quickTags) ? config.home.footer.quickTags : [];
    tagsContainer.innerHTML = tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
  }
}

function init() {
  if (!window.SiteConfig) return;
  const config = window.SiteConfig.load();
  renderBrand(config);
  renderNavigation(config);
  renderCategory(config);
  renderFooter(config);
  bindMobileNav();
}

init();
