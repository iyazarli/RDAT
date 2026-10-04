const test=require('node:test');const assert=require('node:assert/strict');
const {createTournamentRepository}=require('../api/_lib/tournaments');const {demo,summary}=require('../api/_lib/tournament-engine');
function fakeBlob(){const rows=new Map();let seq=0;return {rows,async get(p,o){assert.equal(o.access,'private');assert.equal(o.useCache,false);const x=rows.get(p);if(!x)return null;return {statusCode:200,etag:x.etag,stream:new Blob([x.data]).stream()};},async put(p,data,o){assert.equal(o.access,'private');const prev=rows.get(p);if(prev&&(!o.allowOverwrite||(o.ifMatch&&o.ifMatch!==prev.etag)))throw Object.assign(new Error('precondition'),{name:'BlobPreconditionFailedError'});rows.set(p,{data,etag:String(++seq)});},async list(o){return {blobs:[...rows.keys()].filter(p=>p.startsWith(o.prefix)).map(pathname=>({pathname})),hasMore:false};}};}
test('Özel Blob kaydet/aç, geçmiş, 89 maç ve eşzamanlı sürüm kontrolü',async()=>{
 const blob=fakeBlob(),repo=createTournamentRepository(blob),t=demo();const saved=await repo.save(t.id,t);assert.equal(saved.revision,1);assert.deepEqual(summary(await repo.get(t.id)),summary(t));assert.equal((await repo.list()).length,1);await assert.rejects(()=>repo.save(t.id,t),e=>e.status===409);
 const attempts=await Promise.allSettled([repo.save(t.id,{...saved,name:'A'}),repo.save(t.id,{...saved,name:'B'})]);assert.equal(attempts.filter(x=>x.status==='fulfilled').length,1);assert.equal(attempts.filter(x=>x.status==='rejected'&&x.reason.status===409).length,1);assert(blob.rows.has(`tournaments/history/${t.id}/1.json`));assert.equal((await repo.get(t.id)).matches.length,89);await assert.rejects(()=>repo.get('../bad'),e=>e.status===400);
});
test('Admin API anonim erişimi ve çapraz kaynaklı yazmayı reddeder',async()=>{
 process.env.ADMIN_SESSION_SECRET='test-only-secret';const handler=require('../api/admin/tournaments');let status,body;const res={setHeader(){},end(x){status=this.statusCode;body=JSON.parse(x);}};await handler({method:'GET',url:'/api/admin/tournaments',headers:{}},res);assert.equal(status,401);
 const auth=require('../api/_lib/admin-auth');let cookie;auth.setAdminSessionCookie({headers:{}},{setHeader(k,v){cookie=v.split(';')[0];}});await handler({method:'PUT',url:'/api/admin/tournaments?id=x',headers:{cookie,host:'reddevil.test',origin:'https://evil.test','content-type':'application/json'},body:{}},res);assert.equal(status,403);assert(body.error);
});
test('Bozuk JSON 400, sınırsız akıştaki büyük gövde 413 döner',async()=>{
 const {Readable}=require('node:stream');process.env.ADMIN_SESSION_SECRET='test-only-secret';const handler=require('../api/admin/tournaments');const auth=require('../api/_lib/admin-auth');let cookie;auth.setAdminSessionCookie({headers:{}},{setHeader(k,v){cookie=v.split(';')[0];}});
 for(const [raw,expected] of [['{bad-json',400],['x'.repeat(2*1024*1024+1),413]]){
  const req=Readable.from([raw]);req.method='PUT';req.url='/api/admin/tournaments?id=test';req.headers={cookie,host:'reddevil.test',origin:'https://reddevil.test','content-type':'application/json'};
  let status;const res={setHeader(){},end(){status=this.statusCode;}};await handler(req,res);assert.equal(status,expected);
 }
});
