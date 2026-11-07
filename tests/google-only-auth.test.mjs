import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=(p)=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('the administrator sign-in uses Google OAuth exclusively',()=>{
  const page=read('app/auth/[path]/page.tsx');
  const login=read('app/auth/google-only-sign-in.tsx');
  assert.match(page,/GoogleOnlySignIn/);
  assert.match(login,/authClient\.signIn\.social/);
  assert.match(login,/provider: 'google'/);
  assert.doesNotMatch(login,/signIn\.email|signUp\.email|password:/);
});
test('unsupported sign-up and reset routes redirect to the Google sign-in page',()=>{
  assert.match(read('app/auth/[path]/page.tsx'),/redirect\('\/auth\/sign-in'\)/);
  assert.match(read('app/auth/[path]/page.tsx'),/path !== 'sign-in'/);
});
test('the shared UI provider does not enable email OTP or credential UI',()=>{
  const provider=read('app/providers.tsx');
  assert.match(provider,/social=\{\{ providers: \['google'\] \}\}/);
  assert.doesNotMatch(provider,/emailOTP|emailAndPassword|forgotPassword: true/);
});
