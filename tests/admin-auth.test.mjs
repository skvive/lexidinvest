import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const auth = fs.readFileSync(new URL('../lib/auth.ts', import.meta.url), 'utf8');
test('administrators require both a verified email and an explicit allowlist match', () => {
  assert.match(auth, /user\?\.emailVerified !== true/);
  assert.match(auth, /allowed\.includes\(email\)/);
});
test('no hard-coded production administrator session bypass', () => {
  assert.doesNotMatch(auth, /ADMIN_BYPASS|skipAuth|isDevAdmin|allowAnonymous/);
});
