import { createNeonAuth } from '@neondatabase/auth/next/server';
const cookieSecret=process.env.NEON_AUTH_COOKIE_SECRET;
if(process.env.NODE_ENV==='production' && (!cookieSecret || cookieSecret.length<32)) throw new Error('NEON_AUTH_COOKIE_SECRET must be at least 32 characters in production');
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL || 'https://example.invalid',
  cookies: { secret: cookieSecret || 'local-dev-only-not-valid-for-production-000000' }
});
export async function getAdmin() {
  const response = await auth.getSession();
  const payload = 'data' in response && response.data ? response.data : response;
  const user = 'user' in payload ? payload.user : null;
  const email = user?.email?.toLowerCase();
  const allowed = (process.env.ADMIN_EMAILS || '').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
  if (!email || !allowed.includes(email)) return null;
  return { id: user!.id, email };
}
