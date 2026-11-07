import { NextResponse } from 'next/server';

// Unauthenticated health is intentionally limited to deployment/configuration status.
// It never includes credentials, user details, customer counts or DB contents.
export const dynamic = 'force-dynamic';
export function GET() {
  const configured = Boolean(
    process.env.DATABASE_URL &&
    process.env.NEON_AUTH_BASE_URL &&
    process.env.NEON_AUTH_COOKIE_SECRET &&
    process.env.NEON_AUTH_COOKIE_SECRET.length >= 32 &&
    process.env.ADMIN_EMAILS?.trim()
  );
  return NextResponse.json({
    app: 'lexid-investor-hub',
    version: '0.2.2',
    status: configured ? 'configured' : 'not_configured',
    // Configured does NOT mean a successful DB connection or completed OAuth E2E.
    readiness: 'requires_authenticated_smoke_test'
  }, {
    status: configured ? 200 : 503,
    headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }
  });
}
