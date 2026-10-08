function updateCategoryMetadata(brandName, category, titleSuffix = '') {
  const label = category.label || 'Red Devil Airsoft';
  const title = `${label} | ${brandName} (R.D.A.T.)${titleSuffix}`;
  const intro = String(category.intro || 'Takım, airsoft etkinlikleri ve katılım bilgileri.').trim();
  const description = `${brandName} (R.D.A.T.), Eskişehir merkezli bir airsoft takımıdır. ${intro}`;
  const descriptionNode = document.querySelector('meta[name="description"]');
  if (descriptionNode) descriptionNode.content = description;
  document.title = title;
  const robots = document.querySelector('meta[name="robots"]');
  if (robots) robots.content = 'index, follow';

  const canonicalNode = document.querySelector('link[rel="canonical"]');
  const canonicalOrigin = canonicalNode ? new URL(canonicalNode.href).origin : window.location.origin;
  const canonicalUrl = new URL('/category', canonicalOrigin);
  canonicalUrl.searchParams.set('slug', category.slug || 'about');
  const post = new URLSearchParams(window.location.search).get('post');
  if (category.slug === 'blog' && post) canonicalUrl.searchParams.set('post', post);
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
}

const LEGACY_TEAM_PROFILE_COPY = {
  team_ghost: {
    titles: ['Takim lideri | Oyun kurgu', 'Takim Lideri'],
    title: 'Takım lideri • Oyun kurgusu',
    bio: 'Senaryo tasarimi, saha koordinasyonu ve telsiz protokollerinden sorumlu.',
    updatedBio: 'Senaryo akışını ve saha koordinasyonunu planlar; telsiz iletişim düzeninin oyun boyunca korunmasına destek olur.',
  },
  team_mamba: {
    titles: ['Safety Officer | Medic egitimi'],
    title: 'Güvenlik sorumlusu • Medic eğitimi',
    bio: 'Guvenlik brifingi, ilk yardim kiti ve saha ici risk kontrolunu yonetir.',
    updatedBio: 'Güvenlik brifingini, ilk yardım hazırlığını ve saha içi risk kontrollerini yürütür.',
  },
  team_forge: {
    titles: ['Ekipman mentoru'],
    title: 'Ekipman mentoru',
    bio: 'Kronograf, bakim, yedek ekipman ve butce dostu setup onerileri sunar.',
    updatedBio: 'Kronograf ve ekipman bakımı, yedek ekipman takibi ve bütçeye uygun kurulum önerilerinde destek verir.',
  },
  team_spark: {
    titles: ['Medya | After Action'],
    title: 'Medya • Oyun sonrası değerlendirme',
    bio: 'Oyun goruntuleri, highlight montajlari ve AAR notlarinin paylasimini yapar.',
    updatedBio: 'Oyun görüntülerini ve seçili anları düzenler; ekip arşivinin ve oyun sonrası değerlendirme notlarının paylaşımına katkı sağlar.',
  },
};

function migrateLegacyTeamProfileCopy(profile) {
  const legacy = LEGACY_TEAM_PROFILE_COPY[profile && profile.id];
  if (!legacy) return profile;
  return {
    ...profile,
    title: legacy.titles.includes(profile.title) ? legacy.title : profile.title,
    bio: profile.bio === legacy.bio ? legacy.updatedBio : profile.bio,
  };
}

function renderTeamCategory(config, teamProfiles) {
  const category = config.categories.find((c) => c.slug === 'team') || {};
  updateCategoryMetadata(config.brand.name, category, ' | Eskişehir Airsoft Takımı');
  setText('category-eyebrow', category.eyebrow || 'Ekip');
  setText('category-title', category.title || 'Takım Kadrosu');
  setText('category-intro', category.intro || '');

  const cta = document.querySelector('#category-cta');
  if (cta) {
    cta.textContent = category.ctaLabel || 'Başvuruya Git';
    const href = category.ctaHref || 'index.html#apply';
    cta.href = window.CategoryLinks.href(href);
  }

  const blockGrid = document.querySelector('#category-block-grid');
  const emptyNode = document.querySelector('#category-empty');
  if (!blockGrid) return;

  const profileSource = Array.isArray(teamProfiles) ? teamProfiles : [];
  const profiles = window.RdatLanguage.apply(profileSource.map(migrateLegacyTeamProfileCopy)).filter((profile) => {
    if (!profile || typeof profile !== 'object') return false;
    const name = String(profile?.name ?? '').trim();
    const callsign = String(profile?.callsign ?? '').trim();
    const title = String(profile?.title ?? '').trim();
    return !/^ad$/i.test(name)
      && !/^callsign$/i.test(callsign)
      && !/guncelleniyor|güncelleniyor/i.test(title);
  });

  if (!profiles.length) {
    blockGrid.innerHTML = '';
    if (emptyNode) emptyNode.hidden = false;
    return;
  }

  if (emptyNode) emptyNode.hidden = true;
  blockGrid.className = 'category-team-grid';
  blockGrid.innerHTML = profiles.map((p) => `
    <article class="category-person-card">
      ${renderTeamPortrait(p)}
      <div class="category-person-body">
        <header class="category-person-header">
          <div>
            <h3>${escapeHtml(p.name)}${p.callsign ? ` &ldquo;${escapeHtml(p.callsign)}&rdquo;` : ''}</h3>
            <small>${escapeHtml(p.title)}</small>
          </div>
          <span class="category-role-badge">${escapeHtml(p.badge)}</span>
        </header>
        <p>${escapeHtml(p.bio)}</p>
        <ul class="category-person-meta">
          <li><span>Uzmanlık alanı</span><strong>${escapeHtml(p.expertise)}</strong></li>
          <li><span>Ekip deneyimi</span><strong>${escapeHtml(p.seasons)}</strong></li>
          <li><span>Ekipman tercihi</span><strong>${escapeHtml(p.setup)}</strong></li>
        </ul>
      </div>
    </article>
  `).join('');

  blockGrid.querySelectorAll('.category-person-photo').forEach((photo) => {
    photo.addEventListener('error', () => {
      photo.replaceWith(createTeamMonogram(photo.dataset.monogram));
    }, { once: true });
  });

}

function renderTeamPortrait(profile) {
  const name = String(profile?.name ?? '').trim();
  const callsign = String(profile?.callsign ?? '').trim();
  const photo = String(profile?.photo ?? '').trim();
  const initials = `${name.charAt(0)}${callsign.charAt(0)}`.toLocaleUpperCase('tr-TR') || 'RD';

  if (!photo || /images\.unsplash\.com/i.test(photo)) {
    return `<div class="category-person-monogram" aria-hidden="true"><span>${escapeHtml(initials)}</span></div>`;
  }

  return `<img class="category-person-photo" loading="lazy" src="${escapeHtml(photo)}" alt="${escapeHtml(`${name} ${callsign} portresi`)}" data-monogram="${escapeHtml(initials)}">`;
}

function createTeamMonogram(initials) {
  const monogram = document.createElement('div');
  monogram.className = 'category-person-monogram';
  monogram.setAttribute('aria-hidden', 'true');

  const letters = document.createElement('span');
  letters.textContent = String(initials || 'RD');
  monogram.append(letters);
  return monogram;
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

function isPlaceholderEventPhoto(url) {
  try {
    return new URL(url, window.location.href).hostname.toLowerCase() === 'images.unsplash.com';
  } catch {
    return false;
  }
}

function createEventPhotoPlaceholder(label) {
  const placeholder = document.createElement('div');
  placeholder.className = 'category-block-media event-photo-placeholder';
  placeholder.setAttribute('role', 'img');
  placeholder.setAttribute('aria-label', 'Etkinlik fotoğrafı henüz eklenmedi');

  const brand = document.createElement('span');
  brand.textContent = 'R.D.A.T.';
  const tag = document.createElement('strong');
  tag.textContent = String(label || 'Etkinlik').trim().toLocaleUpperCase('tr-TR');
  placeholder.append(brand, tag);
  return placeholder;
}

function bindEventPhotoFallbacks(container) {
  container.querySelectorAll('.category-block--event img.category-block-media').forEach((image) => {
    image.addEventListener('error', () => {
      image.replaceWith(createEventPhotoPlaceholder(image.dataset.placeholderLabel));
    }, { once: true });
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
  const nav = document.querySelector('#category-nav-links');
  const footerLinks = document.querySelector('#category-footer-links');
  if (!nav) return;

  const visibleCategories = config.categories.filter((item) => item.showInMenu && item.slug !== 'faq');
  nav.innerHTML = visibleCategories
    .map((category) => `<a ${category.slug === getSlugParam() ? 'aria-current="page"' : ''} href="category.html?slug=${encodeURIComponent(category.slug)}">${escapeHtml(category.label)}</a>`)
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

function renderBlogText(value) {
  const result = [];
  let paragraph = [];
  function flush() {
    if (!paragraph.length) return;
    const safe = escapeHtml(paragraph.join('\n')).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      (_match, label, href) => `<a href="${window.CategoryLinks.href(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`);
    result.push(`<p>${safe.replace(/\n/g, '<br>')}</p>`);
    paragraph = [];
  }
  for (const line of String(value || '').split('\n')) {
    if (line.startsWith('## ')) { flush(); result.push(`<h2>${escapeHtml(line.slice(3))}</h2>`); }
    else if (!line.trim()) flush();
    else paragraph.push(line);
  }
  flush();
  return result.join('');
}

function renderBlogArticle(config, category, postId) {
  const post = category.blocks.find(item => item.id === postId);
  setText('category-eyebrow', 'RED DEVIL BLOG');
  setText('category-title', post?.title || 'Yazı bulunamadı');
  setText('category-intro', post ? post.tag : 'Bu yazı kaldırılmış veya bağlantısı değişmiş olabilir.');
  const cta = document.querySelector('#category-cta');
  cta.textContent = 'Tüm blog yazıları';
  cta.href = 'category.html?slug=blog';
  const grid = document.querySelector('#category-block-grid');
  grid.className = 'blog-article';
  grid.innerHTML = post ? `<article><img class="blog-cover" src="${escapeHtml(post.imageUrl)}" alt="${escapeHtml(post.title)}"><div class="blog-article-body">${renderBlogText(post.text)}</div><a class="btn ghost" href="category.html?slug=blog">Diğer yazılara dön</a></article>` : '';
  document.querySelector('#category-empty').hidden = true;
  updateCategoryMetadata(config.brand.name, { ...category, label: post?.title || 'Blog', intro: post?.text.split('\n')[0] || category.intro });
  if (!post) document.querySelector('meta[name="robots"]').content = 'noindex, follow';
}

function renderCategory(config) {
  const slug = getSlugParam();

  const category = config.categories.find((item) => item.slug === (slug || 'about'));
  if (!category) {
    setText('category-eyebrow', 'Kategori');
    setText('category-title', 'Kategori bulunamadı');
    setText('category-intro', 'Bu bağlantıya ait bir kategori yok. Menüden bir kategori seçebilirsin.');
    const cta = document.querySelector('#category-cta');
    cta.textContent = 'Ana sayfaya dön';
    cta.href = 'index.html';
    document.querySelector('#category-block-grid').innerHTML = '';
    document.querySelector('#category-empty').hidden = true;
    document.querySelector('meta[name="robots"]').content = 'noindex, follow';
    document.title = `Kategori bulunamadı | ${config.brand.name}`;
    return;
  }
  const postId = new URLSearchParams(window.location.search).get('post');
  if (category.slug === 'blog' && postId) { renderBlogArticle(config, category, postId); return; }
  const isSponsorCategory = category.slug === 'sponsors';
  const isEventsCategory = category.slug === 'events';
  if (isEventsCategory) category.blocks = window.EventBlocks.sort(category.blocks || []);

  setText('category-eyebrow', category.eyebrow);
  setText('category-title', category.title);
  setText('category-intro', category.intro);

  const cta = document.querySelector('#category-cta');
  if (cta) {
    cta.textContent = category.ctaLabel;
    cta.href = window.CategoryLinks.href(category.ctaHref);
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
          const sponsorUrl = window.CategoryLinks.href(text(block?.url, ''));
          const isVector = /vector\s*optics/i.test(block?.title || '') || /vectoroptics/i.test(sponsorUrl);
          return `
            <article class="category-block category-sponsor-block">
              <a class="category-sponsor-logo-wrap${isVector ? ' category-sponsor-logo-wrap--vector' : ''}" href="${escapeHtml(sponsorUrl || '#')}" ${sponsorUrl ? 'target="_blank" rel="noopener noreferrer"' : ''} title="${escapeHtml(block.title)}">
                ${block.imageUrl
                  ? `<img class="category-sponsor-logo" src="${escapeHtml(block.imageUrl)}" alt="${escapeHtml(block.title)} logo">`
                  : `<span class="category-sponsor-fallback">${escapeHtml(block.title)}</span>`}
              </a>
              <h3>${escapeHtml(block.title)}</h3>
              <p>${escapeHtml(category.slug === 'blog' ? block.text.split('\n')[0].slice(0, 220) : block.text)}</p>
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
          const eventInfo = isEventsCategory ? window.EventBlocks.presentation(block) : null;
          const photoUrl = text(block.imageUrl, '');
          const eventPhoto = isEventsCategory && photoUrl && !isPlaceholderEventPhoto(photoUrl)
            ? `<img class="category-block-media" src="${escapeHtml(photoUrl)}" alt="${escapeHtml(block.title)}" data-placeholder-label="${escapeHtml(block.tag || 'Etkinlik')}">`
            : isEventsCategory
              ? `<div class="category-block-media event-photo-placeholder" role="img" aria-label="Etkinlik fotoğrafı henüz eklenmedi"><span>R.D.A.T.</span><strong>${escapeHtml((block.tag || 'Etkinlik').toLocaleUpperCase('tr-TR'))}</strong></div>`
              : photoUrl ? `<img class="category-block-media" src="${escapeHtml(photoUrl)}" alt="${escapeHtml(block.title)}">` : '';
          const card = `
            <article class="category-block${isEventsCategory ? ' category-block--event' : category.slug === 'about' ? ' category-block--about' : category.slug === 'blog' ? ' category-block--blog' : ''}">
              ${eventPhoto}
              ${eventInfo ? `<div class="event-card-meta"><span class="event-stamp event-stamp--${eventInfo.status}">${eventInfo.label}</span><time ${eventInfo.date ? `datetime="${eventInfo.date}"` : ''}>${escapeHtml(eventInfo.dateLabel)}</time></div>` : ''}
              <h3>${escapeHtml(block.title)}</h3>
              <p>${escapeHtml(category.slug === 'blog' ? block.text.split('\n')[0].slice(0, 220) : block.text)}</p>
              ${block.tag ? `<span class="category-badge">${escapeHtml(block.tag)}</span>` : ''}
              ${category.slug === 'blog' ? '<span class="blog-read-more">Yazıyı oku →</span>' : ''}
            </article>
          `;

          if (category.slug === 'blog') {
            return `<a class="category-event-link blog-preview-link" href="category.html?slug=blog&post=${encodeURIComponent(block.id)}" aria-label="${escapeHtml(block.title)} yazısını oku">${card}</a>`;
          }
          if (isEventsCategory) {
            return `<a class="category-event-link" href="event.html?slug=${encodeURIComponent(category.slug)}&event=${encodeURIComponent(block.id)}" aria-label="${escapeHtml(block.title)} etkinlik detayına git">${card}</a>`;
          }

          const blockUrl = window.CategoryLinks.href(text(block?.url, ''));
          if (blockUrl) {
            const isExternal = /^https?:\/\//i.test(blockUrl);
            return `<a class="category-event-link" href="${escapeHtml(blockUrl)}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''} aria-label="${escapeHtml(block.title)} bağlantısına git">${card}</a>`;
          }

          return card;
        })
        .join('');
      if (isEventsCategory) bindEventPhotoFallbacks(blockGrid);
    }
  }

  updateCategoryMetadata(config.brand.name, category, ' | Eskişehir ve Anadolu');
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
  setText('category-footer-blurb', config.home.footer.blurb);
  setText('category-footer-instagram', config.home.footer.instagram);
  setText('category-footer-email', config.home.footer.email);

  const tagsContainer = document.querySelector('#category-footer-mini-tags');
  if (tagsContainer) {
    const tags = Array.isArray(config.home.footer.quickTags) ? config.home.footer.quickTags : [];
    tagsContainer.innerHTML = tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join('');
  }
}

async function init() {
  if (getSlugParam() === 'highlights') {
    window.location.replace('index.html#highlights');
    return;
  }
  bindMobileNav();
  return window.SiteDataClient.mount((publicState) => {
    const config = window.SiteConfig.normalize(publicState.siteConfig, { authoritative: true });
    renderBrand(config);
    renderNavigation(config);
    if (getSlugParam() === 'team' && config.categories.some(category => category.slug === 'team')) renderTeamCategory(config, publicState.teamProfiles);
    else renderCategory(config);
    renderFooter(config);
  });
}

init();
