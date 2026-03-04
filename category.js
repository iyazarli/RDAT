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
      node.style.backgroundSize = 'cover';
      node.style.backgroundPosition = 'center';
      return;
    }

    node.classList.remove('logo-image');
    node.style.backgroundImage = '';
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
  const category = config.categories.find((item) => item.slug === slug) || config.categories[0];
  const isSponsorCategory = category.slug === 'sponsors';

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
        .map((block) => `
          <article class="category-block">
            ${block.imageUrl ? `<img class="category-block-media" src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.title)}">` : ''}
            <h3>${escapeHtml(block.title)}</h3>
            <p>${escapeHtml(block.text)}</p>
            ${block.tag ? `<span class="category-badge">${escapeHtml(block.tag)}</span>` : ''}
          </article>
        `)
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
