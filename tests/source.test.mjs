import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=new URL('../',import.meta.url);
test('all TypeScript/TSX source passes parser diagnostics',async()=>{
 const {createRequire}=await import('node:module');const require=createRequire(import.meta.url);let ts;try{ts=require('typescript')}catch{ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js')}
 function walk(p){return fs.readdirSync(p,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(p,x.name)):/\.tsx?$/.test(x.name)?[path.join(p,x.name)]:[])}
 const files=walk(new URL('../app',import.meta.url).pathname).concat(walk(new URL('../lib',import.meta.url).pathname));
 for(const file of files){const source=fs.readFileSync(file,'utf8');const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,file.endsWith(".tsx")?ts.ScriptKind.TSX:ts.ScriptKind.TS);assert.equal(tree.parseDiagnostics.length,0,`Syntax error in ${file}: ${tree.parseDiagnostics.map(d=>d.messageText)}`)}
 assert.ok(files.length>12);
});
test('all content API functions gate authentication',()=>{
 for(const f of ['app/api/data/route.ts','app/api/data/[id]/route.ts','app/api/export/route.ts']){
  const source=fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');assert.match(source,/await authorized\(\)/,f);
 }
});
test('live URL for unrelated project is never overridden',()=>{
 const files=['app/page.tsx','app/dashboard/workspace.tsx'];
 for(const f of files)assert.doesNotMatch(fs.readFileSync(new URL('../'+f,import.meta.url),'utf8'),/invest\.lexid\.site/);
});
test('submissions cannot be marked completed without a real evidence URL',()=>{
 const s=fs.readFileSync(new URL('../lib/server-data.ts',import.meta.url),'utf8');
 assert.match(s,/\['submitted','won'\]\.includes\(String\(data\.status\)\)/);
 assert.match(s,/SELECT evidence_url FROM ir_applications/);
 assert.match(s,/실제 증빙 HTTPS URL이 필요합니다/);
});
test('approved public summaries are kept separate from internal metadata',()=>{
 const s=fs.readFileSync(new URL('../lib/server-data.ts',import.meta.url),'utf8');
 const p=fs.readFileSync(new URL('../app/p/[slug]/page.tsx',import.meta.url),'utf8');
 assert.match(s,/data\.public_enabled===true/);
 assert.match(s,/공개 소개문이 필요합니다/);
 assert.match(p,/AND public_enabled=true/);
 assert.doesNotMatch(p,/p\.summary/);
});
test('production auth configuration fails closed if signing secret is missing',()=>{
 const s=fs.readFileSync(new URL('../lib/auth.ts',import.meta.url),'utf8');
 assert.match(s,/NODE_ENV==='production'/);
 assert.match(s,/cookieSecret\.length<32/);
 assert.match(s,/ADMIN_EMAILS/);
});
