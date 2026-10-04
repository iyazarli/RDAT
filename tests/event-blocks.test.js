const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const events = require('../event-blocks');
const config = blocks => ({ categories: [{ id: 'events', slug: 'events', blocks }] });

test('Gerçek takvim tarihleri doğrulanır', () => {
  assert.equal(events.validDate('2024-02-29'), true);
  for (const value of ['', null, '2025-02-29', '2026-04-31', '03.10.2026']) {
    assert.equal(events.validDate(value), false);
  }
});
test('Etkinlik tarihi, oluşturulma zamanı ve tarihsiz kayıt sırası', () => {
  const blocks = [
    { id: 'old' },
    { id: 'first', event_date: '2026-09-01', created_at: '2026-10-02T00:00:00Z' },
    { id: 'second', event_date: '2026-09-01', created_at: '2026-10-03T00:00:00Z' },
    { id: 'new', event_date: '2026-10-01' },
    { id: 'legacy' },
  ];
  assert.deepEqual(events.sort(blocks).map(b => b.id), ['new', 'second', 'first', 'old', 'legacy']);
  assert.equal(blocks[0].id, 'old');
});
test('Eski veri korunur; yeni ve düzenlenen blokta tarih zorunludur', () => {
  const previous = config([{ id: 'old', title: 'Arşiv' }]);
  assert.equal(events.validate(config([{ id: 'old', title: 'Arşiv', gallery: [], event_date: '' }]), previous), '');
  assert.ok(events.validate(config([{ id: 'old', title: 'Yeni başlık' }]), previous));
  assert.ok(events.validate(config([{ id: 'new' }]), previous));
  assert.equal(events.validate(config([{ id: 'old', title: 'Yeni başlık', event_date: '2026-10-03' }]), previous), '');
  assert.ok(events.validate(config([{ id: 'old', event_date: '' }]), config([{ id: 'old', event_date: '2026-10-03' }])));
  assert.equal(events.validate({ categories: [{ slug: 'sponsors', blocks: [{ id: 's' }] }] }, previous), '');
  const next = config([{ id: 'old', title: 'Arşiv' }, { id: 'new', event_date: '2026-09-01', created_at: 'fake' }]);
  events.prepare(next, previous, '2026-10-03T12:00:00Z');
  assert.equal(next.categories[0].blocks[0].created_at, '2026-10-03T12:00:00Z');
  assert.equal(next.categories[0].blocks[1].created_at, '');
  assert.equal(next.categories[0].blocks[1].event_date, undefined);
});
test('SiteConfig tarihleri normalleştirme ve kaydetme sırasında korur', () => {
  const context = { window: { RdatLanguage: require('../rdat-language'), EventBlocks: events, RdatAbout: require('../rdat-about'), RdatBlog: require('../blog-content'), localStorage: { setItem() {}, getItem() { return null; } } } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../site-config.js'), 'utf8'), context);
  const source = config([{ id: 'a', event_date: '2026-09-01', created_at: '2026-10-03T12:00:00Z' }, { id: 'b', event_date: '2026-10-01' }]);
  const normalized = context.window.SiteConfig.save(source);
  const blocks = normalized.categories.find(c => c.slug === 'events').blocks;
  assert.equal(blocks[0].id, 'b');
  assert.equal(blocks[1].event_date, '2026-09-01');
  assert.equal(blocks[1].created_at, '2026-10-03T12:00:00Z');
});
test('Oluşturma/düzenleme formu tarihi yükler, temizler ve kategoriye göre zorunlu kılar', () => {
  const source = fs.readFileSync(path.join(__dirname, '../admin.js'), 'utf8');
  const fields = ['Id', 'Title', 'Text', 'Tag', 'Image', 'Url', 'Gallery', 'EventDate', 'EventDateLabel', 'Category', 'ImageFile'];
  const el = Object.fromEntries(fields.map(field => [`categoryBlock${field}`, { value: '', parentElement: { firstChild: { textContent: '' } } }]));
  const category = { id: 'events', slug: 'events', blocks: [] };
  el.categoryBlockCategory.value = 'events';
  const ctx = { el, state: {}, getCategoryById: () => category, renderCategorySelect() {}, text: (v, d) => v || d, formatLineList: a => (a || []).join('\n') };
  const section = source.slice(source.indexOf('function refreshEventDateField'), source.indexOf('function collectCategoryBlockForm'));
  vm.runInNewContext(section, ctx);
  ctx.fillCategoryBlockForm({ id: 'a', event_date: '2026-10-03', gallery: [] }, 'events');
  assert.equal(el.categoryBlockEventDate.value, '2026-10-03');
  assert.equal(el.categoryBlockEventDate.required, true);
  ctx.clearCategoryBlockForm();
  assert.equal(el.categoryBlockEventDate.value, '');
  category.slug = 'sponsors';
  ctx.refreshEventDateField();
  assert.equal(el.categoryBlockEventDate.required, false);
  assert.equal(el.categoryBlockEventDateLabel.hidden, true);
});

test('Admin API tarih eksikse 400 döner; geçerli kayıt damgalanır ve kaydedilir', async () => {
  const previous = { siteConfig: config([{ id: 'old', title: 'Arşiv' }]), applications: [] };
  let saved;
  let syncCount = 0;
  const context = {
    module: { exports: {} }, console, Date,
    require(name) {
      if (name.endsWith('admin-auth')) return { requireAdmin: () => true };
      if (name.endsWith('/http')) return { readJsonBody: async req => req.body, sendJson: (res, status, body) => ({ status, body }) };
      if (name.endsWith('/store')) return { loadState: async () => structuredClone(previous), saveState: async state => { saved = state; return state; } };
      if (name.endsWith('github-sync')) return { syncStateToGitHub: async () => { syncCount++; return {}; } };
      if (name.endsWith('event-blocks')) return events;
      throw new Error(name);
    },
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../api/admin/state.js'), 'utf8'), context);
  const handler = context.module.exports;
  const invalid = await handler({ method: 'PUT', body: { siteConfig: config([{ id: 'new' }]) } }, {});
  assert.equal(invalid.status, 400);
  assert.equal(saved, undefined);
  assert.equal(syncCount, 0);
  const valid = await handler({ method: 'PUT', body: { siteConfig: config([{ id: 'old', title: 'Arşiv' }, { id: 'new', event_date: '2026-10-03' }]) } }, {});
  assert.equal(valid.status, 200);
  assert.equal(saved.siteConfig.categories[0].blocks[0].id, 'new');
  assert.ok(Number.isFinite(Date.parse(saved.siteConfig.categories[0].blocks[0].created_at)));
  assert.equal(saved.siteConfig.categories[0].blocks[1].event_date, undefined);
  assert.equal(syncCount, 1);
});

test('Mevcut kayıtların normalleştirilmesi tarih doğrulamasından geçer ve dosya değişmez', () => {
  const stored = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/site-state.json'), 'utf8'));
  const before = JSON.stringify(stored);
  const context = { window: { RdatLanguage: require('../rdat-language'), EventBlocks: events, RdatAbout: require('../rdat-about'), RdatBlog: require('../blog-content'), localStorage: { setItem() {}, getItem() { return null; } } } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../site-config.js'), 'utf8'), context);
  assert.equal(events.validate(context.window.SiteConfig.normalize(stored.siteConfig), stored.siteConfig), '');
  assert.equal(JSON.stringify(stored), before);
});

test('Durum İstanbul tarihine göre belirlenir; tarih Türkçe gösterilir', () => {
  const now = new Date('2026-10-03T22:00:00Z');
  assert.equal(events.presentation({ event_date: '2026-10-03' }, now).label, 'Tamamlandı');
  assert.equal(events.presentation({ event_date: '2026-10-04' }, now).label, 'Yakında');
  assert.equal(events.presentation({ event_date: '2026-10-05' }, now).dateLabel, '5 Ekim 2026');
  assert.equal(events.presentation({ id: 'block_c2560cee-e667-449b-9875-6399c199d3aa' }, now).label, 'Tamamlandı');
  assert.equal(events.presentation({ id: 'block_c4f4f75d-063d-4d68-9713-20d41d921653' }, now).label, 'Yakında');
  assert.equal(events.presentation({}, now).dateLabel, 'Tarih belirtilmemiş');
});
