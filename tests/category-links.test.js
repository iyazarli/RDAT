const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const Links = require('../category-links');
test('Bilinen eski butonlar amaçlarına yönlenir; özel linkler ve içerik korunur', () => {
  const config = { categories: [
    { slug: 'blog', ctaLabel: 'Takımla tanış', ctaHref: 'index.html#apply', blocks: [{ id: 'post', text: 'İçerik' }] },
    { slug: 'sponsors', ctaLabel: 'Başvuruya Geç', ctaHref: 'index.html#apply' },
    { slug: 'team', ctaLabel: 'Özel buluşma', ctaHref: 'https://example.com/meet' },
  ] };
  const fixed = Links.apply(config);
  assert.equal(fixed.categories[0].ctaHref, 'category.html?slug=team');
  assert.equal(fixed.categories[1].ctaHref, 'category.html?slug=sponsors#category-block-grid');
  assert.deepEqual(fixed.categories[2], config.categories[2]);
  assert.deepEqual(fixed.categories[0].blocks, config.categories[0].blocks);
  assert.deepEqual(Links.apply(fixed), fixed);
  assert.equal(config.categories[0].ctaHref, 'index.html#apply');
});
test('Ana sayfa bölümü linkleri ve yerel kategori çapaları ayrılır', () => {
  assert.equal(Links.href('#field'), 'index.html#field');
  assert.equal(Links.href('#apply'), 'index.html#apply');
  assert.equal(Links.href('#category-block-grid'), '#category-block-grid');
  assert.equal(Links.href('https://example.com/field#apply'), 'https://example.com/field#apply');
});
test('Yanlış kategori altında bir blok etkinlik gibi açılmaz', () => {
  const source = fs.readFileSync('event.js', 'utf8');
  const resolver = source.slice(source.indexOf('function resolveEvent('), source.indexOf('function renderEvent(', source.indexOf('function resolveEvent(')));
  let params = { slug: 'faq', eventId: 'faq-one' };
  const context = { getQueryParams: () => params };
  vm.runInNewContext(resolver, context);
  const config = { categories: [{ slug: 'faq', blocks: [{ id: 'faq-one' }] }, { slug: 'events', blocks: [{ id: 'event-one' }] }] };
  assert.equal(context.resolveEvent(config).eventBlock, null);
  params = { slug: 'wrong', eventId: 'event-one' };
  assert.equal(context.resolveEvent(config).eventBlock, null);
  params = { slug: 'events', eventId: 'event-one' };
  assert.equal(context.resolveEvent(config).eventBlock.id, 'event-one');
});
test('Kategori kartları güncel kayıtlar gelmeden tıklamaya açılmaz', async () => {
  let resolveState;
  let revealed = false;
  const renders = [];
  const context = {
    window: {
      RdatTeam: { profiles: [] },
      SiteConfig: { normalize: value => value },
      SiteDataClient: { loadPublicState: () => new Promise(resolve => { resolveState = resolve; }) },
    },
    document: { documentElement: { classList: { remove: () => { revealed = true; } } } },
  };
  const source = fs.readFileSync('category.js', 'utf8').replace(/init\(\);\s*$/, '');
  vm.runInNewContext(source, context);
  context.getSlugParam = () => 'events';
  context.getFallbackPublicState = () => ({ siteConfig: { source: 'fallback' } });
  context.renderBrand = context.renderNavigation = context.renderFooter = context.bindMobileNav = () => {};
  context.renderCategory = config => renders.push(config.source);
  const pending = context.init();
  assert.equal(revealed, false);
  assert.equal(renders.length, 0);
  resolveState({ siteConfig: { source: 'live' } });
  await pending;
  assert.equal(revealed, true);
  assert.deepEqual(renders, ['live']);
});
