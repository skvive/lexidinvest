import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
let ts;try{ts=require('typescript')}catch{ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript/lib/typescript.js')}
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'lexid-ir-test-'));
for(const file of ['constants','model']){
 const src=fs.readFileSync(new URL(`../lib/${file}.ts`,import.meta.url),'utf8');
 const compiled=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},reportDiagnostics:true});
 assert.equal(compiled.diagnostics?.length||0,0,`Transpile error ${file}`);
 fs.writeFileSync(path.join(tmp,`${file}.js`),compiled.outputText);
}
const { validatePayload, escapeCSV, validResource, MODEL }=require(path.join(tmp,'model.js'));
test('all resources are strictly whitelisted',()=>{
 assert.equal(validResource('projects'),'projects');
 assert.equal(validResource('ir_audit'),null);
 assert.equal(validResource('../../users'),null);
 assert.equal(Object.keys(MODEL).length,6);
});
test('investor required and normal values are accepted',()=>{
 assert.throws(()=>validatePayload('investors',{email:'x@y.z'},true),/필수/);
 const a=validatePayload('investors',{name:'Jane VC',website_url:'https://example.com',status:'qualified'},true);
 assert.equal(a.name,'Jane VC');
});
test('SQL table and column injection is rejected',()=>{
 assert.throws(()=>validatePayload('projects',{'name;DROP TABLE ir_projects;--':'x'},false),/수정/);
 assert.throws(()=>validatePayload('projects',{slug:'../../escape',name:'x',sector:'AI'},true),/slug/);
});
test('javascript URLs and excessive payloads are blocked',()=>{
 assert.throws(()=>validatePayload('documents',{source_url:'javascript:alert(1)'},false),/URL/);
 assert.throws(()=>validatePayload('investors',{notes:'x'.repeat(6001)},false),/길이/);
});
test('submission state transitions are valid',()=>{
 assert.throws(()=>validatePayload('applications',{status:'paid-off'},false),/상태/);
 assert.equal(validatePayload('applications',{project_id:'a2b483d5-8192-487a-b4a0-c6a3a7652799',target_name:'VC'},true).target_name,'VC');
 assert.throws(()=>validatePayload('applications',{project_id:'a2b483d5-8192-487a-b4a0-c6a3a7652799'},true),/대상명/);
});
test('spreadsheet formula injection is escaped',()=>{
 assert.equal(escapeCSV('=1+1'),`"'=1+1"`);
 assert.equal(escapeCSV('+cmd'),`"'+cmd"`);
 assert.equal(escapeCSV('hello, "world"'),`"hello, ""world"""`);
});
test('no unverified default publication',()=>{
 const migration=fs.readFileSync(new URL('../db/001_schema.sql',import.meta.url),'utf8');
 assert.match(migration,/public_enabled BOOLEAN NOT NULL DEFAULT false/i);
 assert.match(migration,/confidential BOOLEAN NOT NULL DEFAULT true/i);
});

test('KST application deadline stays open through the local end of day',()=>{
 const {deadlineTone}=require(path.join(tmp,'constants.js'));
 assert.equal(deadlineTone('2026-11-07',Date.parse('2026-11-07T15:00:00+09:00')),'urgent');
 assert.equal(deadlineTone('2026-11-07',Date.parse('2026-11-07T23:59:59+09:00')),'urgent');
 assert.equal(deadlineTone('2026-11-07',Date.parse('2026-11-08T00:00:00+09:00')),'past');
 assert.equal(deadlineTone('2026-11-16',Date.parse('2026-11-07T15:00:00+09:00')),'upcoming');
 assert.equal(deadlineTone('',Date.parse('2026-11-07T15:00:00+09:00')),'neutral');
});
test('overview only shows upcoming deadlines while calendar retains deadline history',()=>{
 const workspace=fs.readFileSync(new URL('../app/dashboard/workspace.tsx',import.meta.url),'utf8');
 assert.match(workspace,/nextDeadlines=useMemo\(\(\)=>programUpcoming\.filter\(x=>!isPast\(x\.deadline\)\)/);
 assert.match(workspace,/nextDeadlines\.slice\(0,5\)/);
 assert.match(workspace,/programUpcoming\.map\(p=>/);
});

test('investor emails are normalized and malformed addresses are rejected',()=>{
 assert.equal(validatePayload('investors',{name:'  Jane  ',email:'  JANE@EXAMPLE.COM  '},true).email,'jane@example.com');
 assert.throws(()=>validatePayload('investors',{name:'Jane',email:'not-an-email'},true),/이메일/);
 assert.throws(()=>validatePayload('investors',{name:'Jane',email:'test@some domain.com'},true),/이메일/);
});
test('blank required names are blocked, including edits',()=>{
 assert.throws(()=>validatePayload('investors',{name:'   '},true),/필수값/);
 assert.throws(()=>validatePayload('projects',{name:'   '},false),/필수값/);
 assert.throws(()=>validatePayload('documents',{title:'  '},false),/필수값/);
});
test('invalid calendar dates are rejected before database access',()=>{
 assert.throws(()=>validatePayload('programs',{deadline:'2026-02-30'},false),/날짜/);
 assert.throws(()=>validatePayload('applications',{follow_up_date:'2026-13-03'},false),/날짜/);
 assert.equal(validatePayload('programs',{deadline:'2028-02-29'},false).deadline,'2028-02-29');
});
test('database errors are mapped without disclosing PostgreSQL messages',()=>{
 const source=fs.readFileSync(new URL('../lib/requests.ts',import.meta.url),'utf8');
 assert.match(source,/code==='23505'/);
 assert.match(source,/status:409/);
 assert.match(source,/code==='23503'/);
 assert.match(source,/status:422/);
 assert.doesNotMatch(source,/error:safe\?msg/);
});
test('expired admin sessions clear confidential dashboard memory',()=>{
 const source=fs.readFileSync(new URL('../app/dashboard/workspace.tsx',import.meta.url),'utf8');
 assert.ok(source.split('if(res.status===401){setData(EMPTY);').length>=3);
 assert.match(source,/location\.assign\('\/auth\/sign-in'\)/);
});
