(function initCategoryLinks(root) {
  'use strict';
  const routes = {
    about: { label: 'Ekibi tanı', href: 'category.html?slug=team', legacy: ['R.D.A.T. ile tanış', 'İlk oyunu konuşalım', 'Başvuru Formuna Git'] },
    team: { label: 'Takıma başvur', href: 'index.html#apply', legacy: ['İlk oyunu konuşalım', 'Başvuruya Git', 'Takimi Incele', 'Takımı Incele', 'Takımı İncele'] },
    events: { label: 'Etkinlikleri incele', href: 'category.html?slug=events#category-block-grid', legacy: ['Başvuruya Geç', 'Başvuruya geç'] },
    sponsors: { label: 'Sponsorları incele', href: 'category.html?slug=sponsors#category-block-grid', legacy: ['Başvuruya Geç', 'Başvuruya geç'] },
    blog: { label: 'Ekibi tanı', href: 'category.html?slug=team', legacy: ['Takımla tanış'] },
  };
  function apply(config) {
    const result = JSON.parse(JSON.stringify(config || {}));
    for (const category of result.categories || []) {
      const route = routes[category.slug];
      if (!route) continue;
      // Yalnızca bilinen eski butonlar dönüştürülür; özel yönetici bağlantıları korunur.
      const oldTarget = ['#apply', 'index.html#apply', 'index.html#team', 'index.html#field'].includes(category.ctaHref);
      if (oldTarget && route.legacy.includes(category.ctaLabel)) {
        category.ctaLabel = route.label;
        category.ctaHref = route.href;
      }
    }
    return result;
  }
  function href(value) {
    const target = typeof value === 'string' ? value.trim() : '';
    // Kaldırılan etkinlik kaynağını aynı kuruluşun erişilebilir 5v5 arşivine yönlendir.
    if (target === 'https://www.speedqb.com/products/speedqb-regionals-season-1-tac-city') {
      return 'https://www.speedqb.com/pages/speedqb-2024-season-updates';
    }
    const homeSections = new Set(['#top', '#about', '#team', '#field', '#faq', '#apply', '#highlights', '#sponsors', '#first-game', '#events-preview']);
    return homeSections.has(target) ? `index.html${target}` : target;
  }
  const api = { apply, routes, href };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CategoryLinks = api;
})(typeof window === 'object' ? window : globalThis);
