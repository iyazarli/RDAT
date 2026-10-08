const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const payload = name => ({ ok: true, siteConfig: { brand: { name }, home: {}, nav: {}, categories: [] }, teamProfiles: [] });
const response = body => ({ ok: true, json: async () => body });

function clientFixture(fetch) {
  const classes = new Set(['page-pending']);
  const nodes = Object.fromEntries(['status', 'message', 'retry'].map(key => [key, {
    hidden: key === 'retry', attributes: {}, listeners: {},
    setAttribute(key, value) { this.attributes[key] = value; },
    addEventListener(key, callback) { this.listeners[key] = callback; },
  }]));
  const surfaces = [{ inert: true }, { inert: true }, { inert: true }];
  const listeners = {};
  const timers = new Map();
  let nextTimer = 0;
  const window = {
    document: {
      documentElement: { classList: { add: key => classes.add(key), remove: key => classes.delete(key) } },
      querySelector: selector => nodes[selector.replace('#public-state-', '')],
      querySelectorAll: () => surfaces,
      getElementById: () => null,
    },
    location: { hash: '', pathname: '/', search: '' }, navigator: { userAgent: 'test' },
    setTimeout(callback) { timers.set(++nextTimer, callback); return nextTimer; },
    clearTimeout(id) { timers.delete(id); },
    addEventListener(key, callback) { listeners[key] = callback; },
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../site-data-client.js'), 'utf8'), { window, fetch, AbortController });
  return { client: window.SiteDataClient, nodes, surfaces, classes, listeners, timers };
}

const settle = () => new Promise(resolve => setImmediate(resolve));

test('İlk çizim yalnızca güncel cevapla açılır ve ilk istek paylaşılır', async () => {
  let resolve;
  let calls = 0;
  const fixture = clientFixture((_url, options) => {
    assert.equal(options.cache, 'no-store');
    calls++;
    return new Promise(done => { resolve = done; });
  });
  const renders = [];
  const pending = fixture.client.mount(state => renders.push(state.siteConfig.brand.name));
  assert.equal(calls, 1);
  assert.equal(fixture.classes.has('page-pending'), true);
  assert.ok(fixture.surfaces.every(node => node.inert));
  assert.deepEqual(renders, []);
  resolve(response(payload('Güncel')));
  await pending;
  assert.deepEqual(renders, ['Güncel']);
  assert.equal(fixture.classes.has('page-pending'), false);
  assert.ok(fixture.surfaces.every(node => !node.inert));
  assert.equal(fixture.nodes.status.hidden, true);
});

test('HTTP hatası, bozuk JSON ve geçersiz cevap eski içeriğe dönmez; yeniden deneme çalışır', async () => {
  for (const broken of [{ ok: false, status: 500 }, { ok: true, json: async () => { throw new Error('JSON'); } }, response({ ok: true, siteConfig: {} })]) {
    let calls = 0;
    const fixture = clientFixture(async () => ++calls === 1 ? broken : response(payload('Yeni')));
    const renders = [];
    await fixture.client.mount(state => renders.push(state.siteConfig.brand.name));
    assert.deepEqual(renders, []);
    assert.equal(fixture.classes.has('page-pending'), true);
    assert.equal(fixture.nodes.retry.hidden, false);
    fixture.nodes.retry.listeners.click();
    await settle();
    assert.deepEqual(renders, ['Yeni']);
    assert.equal(fixture.nodes.status.hidden, true);
  }
});

test('Zaman aşımı boş ekranda asılı kalmaz ve eski veri çizmez', async () => {
  const fixture = clientFixture((_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('abort')))));
  let renders = 0;
  const pending = fixture.client.mount(() => { renders++; });
  [...fixture.timers.values()][0]();
  await pending;
  assert.equal(renders, 0);
  assert.equal(fixture.nodes.retry.hidden, false);
  assert.equal(fixture.classes.has('page-pending'), true);
});

test('Geçmiş dönüşü yeniden doğrular; önceki istek sonradan ekranı değiştiremez', async () => {
  const resolves = [];
  const fixture = clientFixture(() => new Promise(resolve => resolves.push(resolve)));
  const renders = [];
  const pending = fixture.client.mount(state => renders.push(state.siteConfig.brand.name));
  fixture.listeners.pagehide();
  fixture.listeners.pageshow({ persisted: true });
  resolves[0](response(payload('Eski')));
  await pending;
  assert.deepEqual(renders, []);
  resolves[1](response(payload('Güncel')));
  await settle();
  assert.deepEqual(renders, ['Güncel']);
  assert.equal(fixture.nodes.status.hidden, true);
});

test('Güncel kayıt boş kategorileri, boş görselleri ve kaldırılan kategorileri eski örneklerle doldurmaz', () => {
  const context = { window: { CategoryLinks: require('../category-links'), RdatLanguage: require('../rdat-language'), RdatBlog: require('../blog-content'), RdatAbout: require('../rdat-about'), EventBlocks: require('../event-blocks') } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../site-config.js'), 'utf8'), context);
  const config = { categories: [
    { id: 'events', slug: 'events', blocks: [] },
    { id: 'faq', slug: 'faq', blocks: [] },
    { id: 'sponsors', slug: 'sponsors', blocks: [{ id: 'custom', title: 'Özel', imageUrl: '', url: '', gallery: [] }] },
  ] };
  const normalized = context.window.SiteConfig.normalize(config, { authoritative: true });
  assert.equal(normalized.categories.length, 3);
  assert.equal(normalized.categories[0].blocks.length, 0);
  assert.equal(normalized.categories[1].blocks.length, 0);
  const block = normalized.categories[2].blocks[0];
  assert.equal(block.imageUrl, '');
  assert.equal(block.url, '');
  assert.equal(block.gallery.length, 0);
  assert.deepEqual(config.categories[0].blocks, []);
});

function categoryFixture() {
  const nodes = {};
  const node = selector => nodes[selector] ||= { hidden: true, innerHTML: '', classList: { add() {}, remove() {} }, querySelectorAll: () => [] };
  const context = {
    window: { CategoryLinks: require('../category-links'), RdatLanguage: require('../rdat-language'), location: { search: '' } },
    document: { querySelector: node, getElementById: id => node('#' + id) }, URLSearchParams,
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../category.js'), 'utf8').replace(/init\(\);\s*$/, ''), context);
  const metadata = [];
  context.updateCategoryMetadata = (...args) => metadata.push(args);
  return { context, nodes, metadata };
}

test('Boş sponsor URL’si ve boş kadro çizimde eski kayıtlara dönmez', () => {
  const { context, nodes, metadata } = categoryFixture();
  context.getSlugParam = () => 'sponsors';
  context.renderCategory({ brand: { name: 'RDAT' }, categories: [{ slug: 'sponsors', title: 'Sponsor', blocks: [{ title: 'Vector Optics', text: '', url: '', imageUrl: '' }] }] });
  assert.ok(!nodes['#category-block-grid'].innerHTML.includes('https://www.vectoroptics.com'));
  assert.ok(!nodes['#category-block-grid'].innerHTML.includes('Web Sitesi'));
  nodes['#category-block-grid'].innerHTML = 'ESKİ_OYUNCU';
  context.renderTeamCategory({ brand: { name: 'RDAT' }, categories: [{ slug: 'team', title: 'Güncel ekip' }] }, []);
  assert.equal(nodes['#category-block-grid'].innerHTML, '');
  assert.equal(nodes['#category-empty'].hidden, false);
  assert.equal(metadata.at(-1)[1].title, 'Güncel ekip');
});
