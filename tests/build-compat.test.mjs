import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=(p)=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('Neon Auth and Neon Auth UI versions are compatible with the verified build',()=>{
 const deps=JSON.parse(read('package.json')).dependencies;
 assert.equal(deps['@neondatabase/auth'],'0.6.0-beta');
 assert.equal(deps['@neondatabase/auth-ui'],'0.4.0-beta');
});
test('Neon dynamic SQL uses the supported parameterized query API',()=>{
 const source=read('lib/server-data.ts');
 assert.match(source,/db\(\)\.query\(/);
 assert.doesNotMatch(source,/db\(\)\(/);
});
test('PWA manifest and social metadata are type-compatible with Next.js',()=>{
 assert.doesNotMatch(read('app/manifest.ts'),/any maskable/);
 assert.match(read('app/layout.tsx'),/metadataBase:/);
});
