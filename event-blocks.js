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
  function presentation(block, now = new Date()) {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
    const date = validDate(block?.event_date) ? block.event_date : '';
    // Tarihsiz arşivlerde yalnızca içeriği bilinen eski kayıtların durumu kullanılır.
    const completedArchive = new Set([
      'block_c2560cee-e667-449b-9875-6399c199d3aa', 'block_48977a44-57ef-4944-b479-c2e206025a22',
      'block_23609bf0-9092-4071-9999-da0cea1e3387', 'block_f60974db-fe29-4b35-8ebd-81b482d4ad4f',
      'block_72f03f70-f9a9-47aa-b915-64b70bd6521b', 'block_20e16223-f1ad-4eb9-bdc8-ec1a7a303d36',
      'cat_events_block_1', 'cat_events_block_2', 'cat_events_block_3', 'cat_events_block_4',
    ]);
    const completed = date ? date < today : completedArchive.has(block?.id);
    return {
      status: completed ? 'completed' : 'upcoming',
      label: completed ? 'Tamamlandı' : 'Yakında',
      date,
      dateLabel: date ? new Intl.DateTimeFormat('tr-TR', { timeZone: 'UTC', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T00:00:00Z`)) : 'Tarih belirtilmemiş',
    };
  }
  const api = { validDate, sort, validate, prepare, presentation };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.EventBlocks = api;
}(typeof window === 'object' ? window : globalThis));
