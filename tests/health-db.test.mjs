import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=(f)=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
test('health probes the actual database before returning a configured status',()=>{
 const health=read('app/api/health/route.ts');
 assert.match(health,/SELECT 1 AS ok/);
 assert.match(health,/db_unavailable/);
 assert.match(health,/database: 'reachable'/);
 assert.match(health,/status: 503/);
 assert.doesNotMatch(health,/SELECT \*|ir_investors|ir_documents/);
});
test('health never leaks DB credentials or source data',()=>{
 const health=read('app/api/health/route.ts');
 assert.doesNotMatch(health,/console\.error\([^\n]*\.message/);
 assert.doesNotMatch(health,/JSON\.stringify\(error\)|databaseUrl|connectionString/);
});
