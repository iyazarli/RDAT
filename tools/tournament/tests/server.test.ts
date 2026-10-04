import { beforeAll,afterAll,it,expect } from 'vitest';
import { spawn,type ChildProcess } from 'node:child_process';
import { mkdtempSync,rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { demo,fresh,summary } from '../src/engine';
let child:ChildProcess;const dir=mkdtempSync(path.join(tmpdir(),'turnuva-test-'));const url='http://127.0.0.1:4328';
async function boot(){child=spawn(process.execPath,['--import','tsx','server/index.ts'],{cwd:process.cwd(),env:{...process.env,PORT:'4328',TURNUVA_DATA_DIR:dir},stdio:'pipe'});for(let i=0;i<100;i++){try{if((await fetch(url+'/api/tournaments')).ok)return;}catch{}await new Promise(r=>setTimeout(r,50));}throw new Error('Test sunucusu başlatılamadı.');}
async function stop(){if(!child||child.exitCode!==null)return;await new Promise<void>(r=>{child.once('exit',()=>r());child.kill();});}
beforeAll(boot);afterAll(async()=>{await stop();rmSync(dir,{recursive:true,force:true});});
it('SQLite kaydı, yeniden açma, sürüm çakışması ve süreç yeniden başlatma',async()=>{
 const t=demo();const endpoint=url+'/api/tournaments/'+t.id;
 const save=()=>fetch(endpoint,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(t)});
 let res=await save();expect(res.status).toBe(200);const saved=await res.json();expect(saved.revision).toBe(1);
 res=await save();expect(res.status).toBe(409);
 const opened=await(await fetch(endpoint)).json();expect(summary(opened)).toEqual(summary(t));expect(opened.matches).toHaveLength(89);
 await stop();await boot();const restarted=await(await fetch(endpoint)).json();expect(restarted.matches).toEqual(saved.matches);
 const updated={...saved,name:'Düzeltilen turnuva'};res=await fetch(endpoint,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(updated)});expect(res.status).toBe(200);expect((await res.json()).revision).toBe(2);
});
it('Kurasız yeni turnuva kaydedilip tekrar açılabilir',async()=>{const t=fresh();const res=await fetch(url+'/api/tournaments/'+t.id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(t)});expect(res.status).toBe(200);const x=await res.json();expect(x.matches).toHaveLength(0);expect(x.groups).toHaveLength(0);});
it('Geçersiz istek reddedilir ve kayıt bozulmaz',async()=>{const res=await fetch(url+'/api/tournaments/bad',{method:'PUT',headers:{'Content-Type':'application/json'},body:'{"name":"bad"}'});expect(res.status).toBe(400);expect((await fetch(url+'/api/tournaments/bad')).status).toBe(404);});
