(function (root) {
  'use strict';
  function validDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }
  function timestamp(value) {
    const result = typeof value === 'string' ? Date.parse(value) : NaN;
    return Number.isFinite(result) ? result : 0;
  }
  function sort(blocks) {
    return [...blocks].sort((a, b) => {
      const first = validDate(a.event_date) ? a.event_date : '';
      const second = validDate(b.event_date) ? b.event_date : '';
      return second.localeCompare(first) || timestamp(b.created_at) - timestamp(a.created_at);
    });
  }
  function validate(next, previous) {
    const oldCategories = Array.isArray(previous?.categories) ? previous.categories : [];
    for (const category of next?.categories || []) {
      if (category.slug !== 'events') continue;
      for (const block of category.blocks || []) {
        const old = oldCategories.find(item => item.id === category.id && item.slug === 'events')
          ?.blocks?.find(item => item.id === block.id);
        // Tarihsiz eski bloklar yalnızca içerikleri değişmeden korunabilir.
        const fields = ['title', 'text', 'tag', 'imageUrl', 'url', 'gallery', 'event_date'];
        const unchanged = old && fields.every(key => JSON.stringify(block[key] ?? (key === 'gallery' ? [] : ''))
          === JSON.stringify(old[key] ?? (key === 'gallery' ? [] : '')));
        if (!validDate(block.event_date) && !(unchanged && !block.event_date && !old.event_date)) {
          return 'Etkinlik bloklarında geçerli bir etkinlik tarihi zorunludur (YYYY-MM-DD).';
        }
      }
    }
    return '';
  }
  function prepare(next, previous, now = new Date().toISOString()) {
    for (const category of next?.categories || []) {
      if (category.slug !== 'events') continue;
      const oldCategory = previous?.categories?.find(item => item.id === category.id && item.slug === 'events');
      for (const block of category.blocks || []) {
        const old = oldCategory?.blocks?.find(item => item.id === block.id);
        // Eski kayıtların oluşturulma zamanı tahmin edilmez; yeniler sunucuda damgalanır.
        if (old) block.created_at = old.created_at || '';
        else block.created_at = now;
      }
      category.blocks = sort(category.blocks || []);
    }
    return next;
  }
  const api = { validDate, sort, validate, prepare };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.EventBlocks = api;
}(typeof window === 'object' ? window : globalThis));
