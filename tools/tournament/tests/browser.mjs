import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
const url=process.env.APP_URL??'http://127.0.0.1:4317';
try{
 await page.goto(url);await page.getByRole('heading',{name:'Takımlar',exact:true}).waitFor();
 await page.getByRole('button',{name:'Takım ekle'}).click();await page.getByLabel('Takım adı',{exact:true}).fill('Tarayıcı Test Takımı');await page.getByLabel('Şehir',{exact:true}).fill('İstanbul');await page.getByLabel('Oyuncular').fill('Oyuncu Bir\nOyuncu İki');await page.getByLabel('Kaptan',{exact:true}).selectOption({label:'Oyuncu Bir'});await page.getByRole('button',{name:'Takımı kaydet'}).click();await page.getByRole('cell',{name:'Tarayıcı Test Takımı'}).waitFor();
 await page.getByRole('button',{name:'Demo/Test verisi oluştur'}).click();await page.getByRole('heading',{name:'Turnuva Özeti',exact:true}).waitFor();
 assert((await page.locator('.eyebrow').allTextContents()).some(x=>x.includes('89 / 89')));
 const medals=await page.locator('.podium h2').allTextContents();assert.equal(new Set(medals).size,3);assert(!medals[2].includes(' - '));assert(!medals.includes('Sonuç bekleniyor'));
 await page.getByRole('button',{name:'Kaydet',exact:true}).click();await page.getByRole('status').filter({hasText:'kalıcı kayda yazıldı'}).waitFor();
 const options=await page.getByLabel('Kayıtlı turnuvayı aç').locator('option').evaluateAll(os=>os.map(x=>({id:x.value,name:x.textContent})));const saved=options.find(x=>x.name==='Demo / 40 Takım');assert(saved);
 await page.reload();await page.getByRole('button',{name:'Turnuva Özeti',exact:false}).click();assert.deepEqual(await page.locator('.podium h2').allTextContents(),medals);
 await page.getByRole('button',{name:'Grup Maçları',exact:false}).click();assert.equal(await page.locator('.match-row').count(),60);
 await page.getByRole('button',{name:'3. Ler Turnuvası',exact:false}).click();assert.equal(await page.locator('.match-row').count(),7);
 await page.getByRole('button',{name:'Finaller',exact:false}).click();assert.equal(await page.locator('.match-row').count(),22);assert.deepEqual(await page.locator('.round>h2').allTextContents(),['Ön Eleme','Son 16','Çeyrek Final','Yarı Final','Üçüncülük Maçı','Final']);
 mkdirSync('evidence',{recursive:true});await page.screenshot({path:'evidence/finaller-desktop.png',fullPage:true});
 const semi=page.locator('.match-row').filter({has:page.locator('.match-meta span',{hasText:'fs0'})});await semi.getByRole('button').click();await page.getByLabel('Ev sahibi skoru').fill('2');await page.getByLabel('Deplasman skoru').fill('2');await page.getByRole('button',{name:'Sonucu kaydet',exact:true}).click();
 await page.getByRole('button',{name:'Turnuva Özeti',exact:false}).click();assert.deepEqual(await page.locator('.podium h2').allTextContents(),['Sonuç bekleniyor','Sonuç bekleniyor','Sonuç bekleniyor']);
 await page.getByRole('button',{name:'Finaller',exact:false}).click();await semi.getByRole('button').click();await page.getByLabel('Beraberlik: kazananı açıkça seçin').selectOption({index:1});await page.getByRole('button',{name:'Sonucu kaydet',exact:true}).click();assert.equal(await page.locator('.match-row').filter({has:page.locator('.match-meta span',{hasText:'ff',exact:true})}).getByRole('button').isEnabled(),true);
 await page.getByLabel('Kayıtlı turnuvayı aç').selectOption(saved.id);await page.getByRole('status').filter({hasText:'Kaydedilen turnuva açıldı'}).waitFor();await page.getByRole('button',{name:'Turnuva Özeti',exact:false}).click();assert.deepEqual(await page.locator('.podium h2').allTextContents(),medals);
 await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));await page.screenshot({path:'evidence/ozet-mobil.png',fullPage:true});await page.getByRole('button',{name:'Finaller',exact:false}).click();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
 assert.deepEqual(errors,[]);console.log('PASS: takım/oyuncu/kaptan, 60+7+22 maç, üç madalya/tek bronz, tur sırası, SQLite kaydet/aç, beraberlik/düzeltme, mobil görünüm; tarayıcı hatası yok.');
}finally{await browser.close();}
