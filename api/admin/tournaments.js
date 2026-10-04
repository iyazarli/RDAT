const { requireAdmin } = require('../_lib/admin-auth');
const { sendJson, methodNotAllowed } = require('../_lib/http');
const { createTournamentRepository } = require('../_lib/tournaments');
const repository = createTournamentRepository(require('@vercel/blob'));
async function readBoundedJson(req) {
  const limit=2*1024*1024;
  if(req.body && typeof req.body==='object') {
    if(Buffer.byteLength(JSON.stringify(req.body))>limit)throw Object.assign(new Error('İstek çok büyük.'),{status:413});
    return req.body;
  }
  const chunks=[];let size=0;
  for await(const chunk of req) {
    const bytes=Buffer.from(chunk);size+=bytes.length;
    if(size>limit)throw Object.assign(new Error('İstek çok büyük.'),{status:413});
    chunks.push(bytes);
  }
  try{return JSON.parse(Buffer.concat(chunks).toString('utf8'));}
  catch{throw Object.assign(new Error('Geçerli JSON gerekli.'),{status:400});}
}
module.exports = async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if(!['GET','PUT'].includes(req.method))return methodNotAllowed(res,['GET','PUT']);
  try {
    if(!requireAdmin(req,res))return;
    const id=new URL(req.url,'http://localhost').searchParams.get('id');
    if(req.method==='GET')return sendJson(res,200,id?await repository.get(id):await repository.list());
    // Yazmalar mevcut admin çereziyle ve aynı kaynaklı JSON isteğiyle sınırlıdır.
    let origin;try{origin=new URL(req.headers.origin);}catch{return sendJson(res,403,{error:'İstek kaynağı doğrulanamadı.'});}
    if(origin.host!==req.headers.host||!String(req.headers['content-type']||'').startsWith('application/json'))return sendJson(res,403,{error:'Aynı kaynaklı JSON isteği gerekli.'});
    if(!id)return sendJson(res,400,{error:'Turnuva kimliği gerekli.'});
    if(Number(req.headers['content-length']||0)>2*1024*1024)return sendJson(res,413,{error:'İstek çok büyük.'});
    const body=await readBoundedJson(req);
    if(Buffer.byteLength(JSON.stringify(body))>2*1024*1024)return sendJson(res,413,{error:'İstek çok büyük.'});
    return sendJson(res,200,await repository.save(id,body));
  } catch(e) { if(!e.status)console.error('Turnuva API:',e.message);return sendJson(res,e.status||503,{error:e.status?e.message:'Turnuva depolamasına ulaşılamadı. Tekrar deneyin.'}); }
};
