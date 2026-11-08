import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('the authenticated workspace includes a private IR template gallery',()=>{
 const s=read('app/dashboard/workspace.tsx');
 assert.match(s, /section==='templates'/);assert.match(s,/IR 템플릿/);
 assert.match(s,/data\.documents\.filter\(x=>String\(x\.version_label\|\|''\)\.startsWith\('TEMPLATE'\)\)/);
 assert.match(s,/x\.source_url/);
});
test('public source does not embed private template links',()=>{
 const s=read('app/dashboard/workspace.tsx');
 assert.doesNotMatch(s, /1ak7FjdhrD-b1H7yPuQX9MEelu-f831O-/);
 assert.doesNotMatch(s, /1iUqaikxWTdCIao6e5mzU2Q5rudQuPovJ/);
});
test('admin dashboard retains server authentication',()=>{
 const s=read('app/dashboard/page.tsx');
 assert.match(s,/getAdmin\(\)/);assert.match(s,/redirect\('\/auth\/sign-in'\)/);
});