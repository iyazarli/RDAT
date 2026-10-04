const test = require('node:test');
const assert = require('node:assert/strict');
const Language = require('../rdat-language');
test('Türkçe karakterler ve büyük/küçük harfler doğru dönüştürülür', () => {
  assert.equal(Language.correct('Iletisim Guvenlik Takima katildiginda'), 'İletişim Güvenlik Takıma katıldığında');
  assert.equal(Language.correct('ETKINLIK FOTOGRAFLARI'), 'ETKİNLİK FOTOĞRAFLARI');
  assert.equal(Language.correct('Yeni baslayanlar icin egitim var mi?'), 'Yeni başlayanlar için eğitim var mı?');
  assert.equal(Language.correct('Katılım, şarjör, gözlük, dürüstlük'), 'Katılım, şarjör, gözlük, dürüstlük');
});
test('Bağlantılar, kimlikler, tarihler ve görseller korunur; işlem tekrar uygulanabilir', () => {
  const state = { id: 'takim', slug: 'basvuru', imageUrl: 'data:image/png;base64,Guvenlik', url: '/takim', event_date: '2026-10-04', title: 'Takim Lideri', text: 'Guvenlik [kaynak](https://example.com/bakim/)' };
  const fixed = Language.apply(state);
  assert.equal(fixed.title, 'Takım Lideri');
  assert.equal(fixed.text, 'Güvenlik [kaynak](https://example.com/bakim/)');
  for (const field of ['id','slug','imageUrl','url','event_date']) assert.equal(fixed[field], state[field]);
  assert.deepEqual(Language.apply(fixed), fixed);
  assert.equal(state.title, 'Takim Lideri');
});
