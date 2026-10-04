const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const Blog = require('../blog-content');
test('12 yazı, benzersiz kimlikler, gerçek dosya kapakları ve yeterli içerik', () => {
  assert.equal(Blog.category.blocks.length, 12);
  assert.equal(new Set(Blog.category.blocks.map(p => p.id)).size, 12);
  for (const post of Blog.category.blocks) {
    assert.ok(post.text.split(/\s+/).length >= 135, post.title);
    assert.ok(fs.existsSync(path.join(__dirname, '..', post.imageUrl)));
  }
});
test('Blog geçişi tekrar uygulanabilir; düzenlenen ve silinen yazılar korunur', () => {
  const original = { categories: [{ slug: 'events', blocks: [{ id: 'archive' }] }] };
  const next = Blog.apply(original);
  assert.deepEqual(next.categories[0], original.categories[0]);
  next.categories[1].blocks = [{ id: 'custom', text: 'Özel yazı' }];
  assert.deepEqual(Blog.apply(next), next);
  next.categories[1].blocks = [];
  assert.deepEqual(Blog.apply(next), next);
});
test('Yazı metni başlık ve bağlantıya dönüşür; HTML veya javascript çalıştırılmaz', () => {
  const source = fs.readFileSync(path.join(__dirname, '../category.js'), 'utf8');
  const context = { escapeHtml: value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;') };
  vm.runInNewContext(source.slice(source.indexOf('function renderBlogText'), source.indexOf('function renderBlogArticle')), context);
  const rendered = context.renderBlogText('## Başlık\nParagraf\n\n[Üretici](https://example.com)\n<img onerror="bad">\n[Zararlı](javascript:alert)');
  assert.ok(rendered.includes('<h2>Başlık</h2><p>Paragraf</p>'));
  assert.ok(rendered.includes('href="https://example.com"'));
  assert.ok(!rendered.includes('<img'));
  assert.ok(!rendered.includes('href="javascript:'));
});
test('Uzun metinler normalleştirmede korunur ve son yazı silinince geri gelmez', () => {
  const context = { window: { RdatBlog: Blog, RdatAbout: require('../rdat-about'), EventBlocks: require('../event-blocks') } };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../site-config.js'), 'utf8'), context);
  const normalized = context.window.SiteConfig.normalize({ categories: [Blog.category] });
  const blog = normalized.categories.find(c => c.slug === 'blog');
  assert.equal(blog.blocks[0].text, Blog.category.blocks[0].text);
  blog.blocks = [];
  assert.equal(context.window.SiteConfig.normalize(normalized).categories.find(c => c.slug === 'blog').blocks.length, 0);
});
