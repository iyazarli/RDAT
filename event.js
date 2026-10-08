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

function updateEventMetadata(title, description, slug, eventId, indexable = true) {
  document.title = title;
  const descriptionNode = document.querySelector('meta[name="description"]');
  if (descriptionNode) descriptionNode.content = description;

  const canonicalNode = document.querySelector('link[rel="canonical"]');
  const canonicalOrigin = canonicalNode ? new URL(canonicalNode.href).origin : window.location.origin;
  const canonicalUrl = new URL('/event', canonicalOrigin);
  canonicalUrl.searchParams.set('slug', slug || 'events');
  if (eventId) canonicalUrl.searchParams.set('event', eventId);
  if (canonicalNode) canonicalNode.href = canonicalUrl.href;

  const metadata = [
    ['meta[property="og:title"]', title],
    ['meta[property="og:description"]', description],
    ['meta[property="og:url"]', canonicalUrl.href],
    ['meta[name="twitter:title"]', title],
    ['meta[name="twitter:description"]', description],
  ];
  metadata.forEach(([selector, content]) => {
    const node = document.querySelector(selector);
    if (node) node.content = content;
  });

  const eventRobotsNode = document.querySelector('meta[data-event-noindex="true"]');
  if (!indexable) {
    if (!eventRobotsNode) {
      const directive = document.head.appendChild(document.createElement('meta'));
      directive.name = 'robots';
      directive.content = 'noindex, follow';
      directive.dataset.eventNoindex = 'true';
    }
  } else if (eventRobotsNode) {
    eventRobotsNode.remove();
  }
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

function isPlaceholderEventPhoto(url) {
  try {
    return new URL(url, window.location.href).hostname.toLowerCase() === 'images.unsplash.com';
  } catch {
    return false;
  }
}

function bindEventGalleryImageFallbacks(grid, emptyNode) {
  grid.querySelectorAll('.event-photo-card img').forEach((image) => {
    const removeUnavailablePhoto = () => {
      image.closest('.event-photo-card')?.remove();
      if (!grid.querySelector('.event-photo-card img') && emptyNode) emptyNode.hidden = false;
    };
    image.addEventListener('error', removeUnavailablePhoto, { once: true });
    if (image.complete && image.naturalWidth === 0) removeUnavailablePhoto();
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
  const nav = document.querySelector('#event-nav-links');
  const footerLinks = document.querySelector('#event-footer-links');
  if (!nav) return;

  const visibleCategories = config.categories.filter((item) => item.showInMenu && item.slug !== 'faq');
  nav.innerHTML = visibleCategories
    .map((category) => `<a ${category.slug === 'events' ? 'aria-current="page"' : ''} href="category.html?slug=${encodeURIComponent(category.slug)}">${escapeHtml(category.label)}</a>`)
    .join('');

  const rawApplyHref = config.nav.applyHref || 'index.html#apply';
  const navApplyHref = rawApplyHref.startsWith('#') ? `index.html${rawApplyHref}` : rawApplyHref;
  const applyLink = document.createElement('a');
  applyLink.className = 'nav-cta';
  applyLink.href = navApplyHref;
  applyLink.textContent = config.nav.applyLabel || 'Başvur';
  nav.appendChild(applyLink);

  if (footerLinks) {
    footerLinks.innerHTML = visibleCategories
      .map((category) => `<a class="footer-pill" href="category.html?slug=${encodeURIComponent(category.slug)}">${escapeHtml(category.label)}</a>`)
      .join('');
  }
}

function resolveEvent(config) {
  const { slug, eventId } = getQueryParams();
  const eventsCategory = slug === 'events' ? config.categories.find((item) => item.slug === 'events') : null;

  if (!eventsCategory || !Array.isArray(eventsCategory.blocks) || eventsCategory.blocks.length === 0) {
    return { category: null, eventBlock: null };
  }

  const selected = eventId ? eventsCategory.blocks.find((item) => item.id === eventId) : null;
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
    setText('event-title', 'Etkinlik bulunamadı');
    setText('event-summary', 'Seçili etkinlik kaydı bulunamadı.');
    if (grid) grid.innerHTML = '';
    if (emptyNode) emptyNode.hidden = false;
    if (tagNode) tagNode.hidden = true;
    document.querySelector('#event-status-date').innerHTML = '';
    if (backLink) backLink.href = 'category.html?slug=events';
    updateEventMetadata(
      `Etkinlik bulunamadı | ${config.brand.name} (R.D.A.T.)`,
      'Etkinlik kaydı bulunamadı. Güncel Red Devil Airsoft etkinlikleri için etkinlik arşivini ziyaret edin.',
      category?.slug || getQueryParams().slug,
      '',
      false,
    );
    return;
  }

  const eventInfo = window.EventBlocks.presentation(eventBlock);
  document.querySelector('#event-status-date').innerHTML = `<span class="event-stamp event-stamp--${eventInfo.status}">${eventInfo.label}</span><time ${eventInfo.date ? `datetime="${eventInfo.date}"` : ''}>${escapeHtml(eventInfo.dateLabel)}</time>`;
  setText('event-eyebrow', category.eyebrow || 'Etkinlik');
  setText('event-title', eventBlock.title || 'Etkinlik');
  setText('event-summary', eventBlock.text || 'Etkinlik açıklaması bulunmuyor.');

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

  const finalGallery = uniqueUrls(gallery.filter((url) => !isPlaceholderEventPhoto(url)));

  if (!grid) return;

  if (finalGallery.length === 0) {
    grid.innerHTML = '';
    if (emptyNode) emptyNode.hidden = false;
  } else {
    if (emptyNode) emptyNode.hidden = true;
    grid.innerHTML = finalGallery
      .map((url, index) => `
        <figure class="event-photo-card">
          <img src="${escapeHtml(url)}" alt="${escapeHtml(eventBlock.title)} fotoğraf ${index + 1}">
          <figcaption>${escapeHtml(eventBlock.title)} • Kare ${index + 1}</figcaption>
        </figure>
      `)
      .join('');
    bindEventGalleryImageFallbacks(grid, emptyNode);
  }

  updateEventMetadata(
    `${eventBlock.title} | ${config.brand.name} (R.D.A.T.)`,
    `${eventBlock.text || 'Etkinlik özeti'} Red Devil Airsoft (R.D.A.T.), Eskişehir merkezli bir airsoft takımıdır.`,
    category.slug,
    eventBlock.id,
  );
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

  navLinks?.addEventListener('click', (event) => {
    if (!event.target.closest('a')) return;
    navLinks.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
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

async function init() {
  bindMobileNav();
  return window.SiteDataClient.mount((publicState) => {
    const config = window.SiteConfig.normalize(publicState.siteConfig, { authoritative: true });
    renderBrand(config);
    renderNavigation(config);
    renderEvent(config);
    renderFooter(config);
  });
}

init();
