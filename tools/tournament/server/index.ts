import express from 'express';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateTournament, reconcile, type Tournament } from '../src/engine.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dataDir=process.env.TURNUVA_DATA_DIR ?? path.join(root,'data');
mkdirSync(dataDir,{recursive:true});
const db=new DatabaseSync(path.join(dataDir,'turnuvalar.sqlite'));
db.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS tournaments(id TEXT PRIMARY KEY, name TEXT NOT NULL, payload TEXT NOT NULL, revision INTEGER NOT NULL, updated TEXT NOT NULL); CREATE TABLE IF NOT EXISTS history(id INTEGER PRIMARY KEY, tournament_id TEXT NOT NULL, payload TEXT NOT NULL, updated TEXT NOT NULL);');
const app=express();app.use(express.json({limit:'2mb'}));
app.use('/api',(_req,res,next)=>{res.setHeader('Cache-Control','no-store');next();});
app.get('/api/tournaments',(_req,res)=>res.json(db.prepare('SELECT id,name,revision,updated FROM tournaments ORDER BY updated DESC').all()));
app.get('/api/tournaments/:id',(req,res)=>{const row=db.prepare('SELECT payload FROM tournaments WHERE id=?').get(req.params.id) as {payload:string}|undefined;if(!row)return res.status(404).json({error:'Turnuva bulunamadı.'});res.json(JSON.parse(row.payload));});
app.put('/api/tournaments/:id',(req,res)=>{
  try {
    validateTournament(req.body);const input=req.body as Tournament;if(input.id!==req.params.id)throw new Error('Turnuva kimliği uyuşmuyor.');
    const t=reconcile(input).tournament;
    db.exec('BEGIN IMMEDIATE');
    try {
      const prior=db.prepare('SELECT revision,payload FROM tournaments WHERE id=?').get(t.id) as {revision:number;payload:string}|undefined;
      if(prior&&prior.revision!==t.revision){db.exec('ROLLBACK');return res.status(409).json({error:'Bu turnuva başka bir sekmede değiştirildi. Kaydınızı dışa aktarın ve güncel turnuvayı yeniden açın.'});}
      if(prior)db.prepare('INSERT INTO history(tournament_id,payload,updated) VALUES(?,?,?)').run(t.id,prior.payload,new Date().toISOString());
      t.revision=(prior?.revision??0)+1;
      db.prepare('INSERT INTO tournaments VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,payload=excluded.payload,revision=excluded.revision,updated=excluded.updated').run(t.id,t.name,JSON.stringify(t),t.revision,new Date().toISOString());
      db.exec('COMMIT');res.json(t);
    } catch(e){db.exec('ROLLBACK');throw e;}
  }catch(e){res.status(400).json({error:e instanceof Error?e.message:'Kayıt başarısız.'});}
});
app.use(express.static(path.join(root,'dist')));
app.use((err:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction)=>res.status(400).json({error:err instanceof Error?err.message:'İstek okunamadı.'}));
const port=Number(process.env.PORT ?? 4317);
const server=app.listen(port,'127.0.0.1',()=>console.log(`Turnuva sunucusu: http://127.0.0.1:${port}`));
server.on('error',e=>{console.error('Sunucu başlatılamadı:',e.message);process.exit(1);});
