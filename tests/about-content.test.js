const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const About = require('../rdat-about');
const Events = require('../event-blocks');

test('İçerik kuruluşu, oyun düzenini ve katılım değerlerini içerir', () => {
  assert.match(About.category.intro, /2022/);
  assert.match(About.category.blocks[2].text, /iki haftada bir pazar/);
  assert.match(About.category.blocks[2].text, /yaklaşık 40/);
  assert.match(About.category.blocks[3].text, /Atatürk ilke ve inkılaplarına tam bağlılık/);
  assert.ok(About.home.criteriaItems.some(item => item.includes('Atatürk')));
});
test('Güncelleme tekrar uygulanabilir; özel içerik ve diğer kategoriler korunur', () => {
  const stored = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/site-state.json'))).siteConfig;
  const next = About.apply(stored);
  assert.deepEqual(About.apply(next), next);
  assert.deepEqual(next.categories.filter(c => c.slug !== 'about'), stored.categories.filter(c => c.slug !== 'about'));
  const custom = structuredClone(stored);
  custom.categories.find(c => c.slug === 'about').intro = 'Özel tanıtım';
  custom.home.about.text = 'Özel ana sayfa içeriği';
  assert.deepEqual(About.apply(custom), custom);
});
test('Tarayıcı ve API varsayılanları aynı Hakkımızda içeriğini kullanır', () => {
  const context = { window: { EventBlocks: Events, RdatAbout: About, RdatBlog: require('../blog-content') } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../site-config.js'), 'utf8'), context);
  const browser = context.window.SiteConfig.DEFAULT_SITE_CONFIG;
  const server = require('../api/_lib/default-state').DEFAULT_SITE_CONFIG;
  assert.deepEqual(JSON.parse(JSON.stringify(browser.home.about)), server.home.about);
  assert.deepEqual(JSON.parse(JSON.stringify(browser.categories.find(c => c.slug === 'about'))), server.categories.find(c => c.slug === 'about'));
});
