import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// Unauthenticated health exposes only configuration and database reachability.
// It does not disclose record counts, credentials, user details or SQL errors.
export const dynamic = 'force-dynamic';
const headers = { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } as const;
export async function GET() {
  const configured = Boolean(
    process.env.DATABASE_URL &&
    process.env.NEON_AUTH_BASE_URL &&
    process.env.NEON_AUTH_COOKIE_SECRET &&
    process.env.NEON_AUTH_COOKIE_SECRET.length >= 32 &&
    process.env.ADMIN_EMAILS?.trim()
  );
  if (!configured) {
    return NextResponse.json({
      app: 'lexid-investor-hub', version: '0.2.5',
      status: 'not_configured', database: 'not_checked',
      readiness: 'not_ready'
    }, { status: 503, headers });
  }
  try {
    const result = await sql()`SELECT 1 AS ok`;
    if (Number(result[0]?.ok) !== 1) throw new Error('Database probe failed');
    return NextResponse.json({
      app: 'lexid-investor-hub', version: '0.2.5',
      status: 'configured', database: 'reachable',
      readiness: 'requires_authenticated_smoke_test'
    }, { status: 200, headers });
  } catch (error) {
    console.error('HEALTH_DB_PROBE_FAILED', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json({
      app: 'lexid-investor-hub', version: '0.2.5',
      status: 'db_unavailable', database: 'unreachable',
      readiness: 'not_ready'
    }, { status: 503, headers });
  }
}
