import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=(s)=>fs.readFileSync(new URL('../'+s,import.meta.url),'utf8');
test('health endpoint does not report app ready before configuration',()=>{
 const h=read('app/api/health/route.ts');
 assert.ok(h.includes("version: '"+JSON.parse(read('package.json')).version+"'"));
 assert.match(h,/not_configured/);
 assert.match(h,/503/);
 assert.doesNotMatch(h,/DATABASE_URL\s*:/);
});
test('mutating endpoints reject missing request origin and non-JSON payloads',()=>{
 const c=read('lib/requests.ts');
 assert.match(c,/if\(!origin \|\|/);
 assert.match(c,/application\\\/json/);
 assert.match(c,/sec-fetch-site/);
});
test('sensitive API routes retain auth and origin gates',()=>{
 for(const f of ['app/api/data/route.ts','app/api/data/[id]/route.ts']){
   const t=read(f);assert.match(t,/await authorized\(\)/);assert.match(t,/await checkOrigin\(req\)/);
 }
});
test('CI never commits runtime env files',()=>{
 const g=read('.gitignore');assert.match(g,/\.env\.\*/);assert.match(g,/node_modules/);
 const ci=read('.github/workflows/ci.yml');assert.match(ci,/npm run build/);
 assert.match(ci,/example\.invalid/);
});
