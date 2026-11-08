import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = p => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
test('all health responses report the package version, whether healthy, unconfigured, or DB unavailable', () => {
 const pkg=JSON.parse(read('package.json'));
 const src=read('app/api/health/route.ts');
 const versions=[...src.matchAll(/version:\s*'([^']+)'/g)].map(m=>m[1]);
 assert.equal(versions.length,3);
 assert.deepEqual(versions,[pkg.version,pkg.version,pkg.version]);
});
