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

function text(value, fallback = '') {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    slug: text(params.get('slug'), 'events'),
    eventId: text(params.get('event'), ''),
  };
}

function uniqueUrls(urls) {
  const seen = new Set();
  return urls.filter((url) => {
    const key = text(url, '');
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
  const nav = document.querySelector('#event-nav-links');
  const footerLinks = document.querySelector('#event-footer-links');
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

function resolveEvent(config) {
  const { slug, eventId } = getQueryParams();
  const requestedCategory = config.categories.find((item) => item.slug === slug);
  const eventsCategory = requestedCategory || config.categories.find((item) => item.slug === 'events');

  if (!eventsCategory || !Array.isArray(eventsCategory.blocks) || eventsCategory.blocks.length === 0) {
    return { category: null, eventBlock: null };
  }

  const selected = eventsCategory.blocks.find((item) => item.id === eventId) || eventsCategory.blocks[0];
  return { category: eventsCategory, eventBlock: selected };
}

function renderEvent(config) {
  const { category, eventBlock } = resolveEvent(config);
  const grid = document.querySelector('#event-gallery-grid');
  const emptyNode = document.querySelector('#event-gallery-empty');
  const tagNode = document.querySelector('#event-tag');
  const backLink = document.querySelector('#event-back-category');

  if (!category || !eventBlock) {
    setText('event-eyebrow', 'Etkinlik');
    setText('event-title', 'Etkinlik bulunamadi');
    setText('event-summary', 'Secili etkinlik kaydi bulunamadi.');
    if (grid) grid.innerHTML = '';
    if (emptyNode) emptyNode.hidden = false;
    if (tagNode) tagNode.hidden = true;
    if (backLink) backLink.href = 'category.html?slug=events';
    document.title = `Etkinlik | ${config.brand.name}`;
    return;
  }

  setText('event-eyebrow', category.eyebrow || 'Etkinlik');
  setText('event-title', eventBlock.title || 'Etkinlik');
  setText('event-summary', eventBlock.text || 'Etkinlik aciklamasi bulunmuyor.');

  if (tagNode) {
    const tag = text(eventBlock.tag, '');
    tagNode.textContent = tag;
    tagNode.hidden = !tag;
  }

  if (backLink) {
    backLink.href = `category.html?slug=${encodeURIComponent(category.slug)}`;
  }

  const gallery = [];
  if (eventBlock.imageUrl) gallery.push(eventBlock.imageUrl);
  if (Array.isArray(eventBlock.gallery)) {
    eventBlock.gallery.forEach((item) => {
      const entry = text(item, '');
      if (entry) gallery.push(entry);
    });
  }

  const sameTitlePhotos = category.blocks
    .filter((item) => item.id !== eventBlock.id && text(item.title, '') === text(eventBlock.title, '') && text(item.imageUrl, ''))
    .map((item) => item.imageUrl);

  const finalGallery = uniqueUrls([...gallery, ...sameTitlePhotos]);

  if (!grid) return;

  if (finalGallery.length === 0) {
    grid.innerHTML = '';
    if (emptyNode) emptyNode.hidden = false;
  } else {
    if (emptyNode) emptyNode.hidden = true;
    grid.innerHTML = finalGallery
      .map((url, index) => `
        <figure class="event-photo-card">
          <img src="${escapeHtml(url)}" alt="${escapeHtml(eventBlock.title)} fotograf ${index + 1}">
          <figcaption>${escapeHtml(eventBlock.title)} • Kare ${index + 1}</figcaption>
        </figure>
      `)
      .join('');
  }

  document.title = `${eventBlock.title} | ${config.brand.name}`;
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
  setText('event-footer-blurb', config.home.footer.blurb);
  setText('event-footer-instagram', config.home.footer.instagram);
  setText('event-footer-email', config.home.footer.email);

  const tagsContainer = document.querySelector('#event-footer-mini-tags');
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
  renderEvent(config);
  renderFooter(config);
  bindMobileNav();
}

init();
