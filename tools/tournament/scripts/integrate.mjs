import { readFileSync,writeFileSync,mkdirSync,cpSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ts from 'typescript';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
const target=name=>args.includes(name)?path.resolve(args[args.indexOf(name)+1]):null;
const wd=target('--wd'),rd=target('--reddevil');
if(!wd&&!rd)throw new Error('--wd veya --reddevil proje yolu gereklidir.');
execFileSync(process.execPath,[path.join(root,'node_modules/vite/bin/vite.js'),'build','--base=/tournament-app/','--outDir=integration-dist'],{cwd:root,stdio:'inherit'});
const source=readFileSync(path.join(root,'src/engine.ts'),'utf8');
for(const [target,file,format] of [[wd,'server/tournament-engine.mjs',ts.ModuleKind.ESNext],[rd,'api/_lib/tournament-engine.js',ts.ModuleKind.CommonJS]].filter(([target])=>target)){
 const output=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:format}}).outputText;
 mkdirSync(path.dirname(path.join(target,file)),{recursive:true});
 writeFileSync(path.join(target,file),'// Ortak kaynak: turnuva/src/engine.ts. Yenileme: scripts/integrate.mjs.\n'+output);
 const dest=path.join(target,target===wd?'public/tournament-app':'tournament-app');mkdirSync(dest,{recursive:true});cpSync(path.join(root,'integration-dist'),dest,{recursive:true});
}
