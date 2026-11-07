# LEXID INVEST — Fundraising Operations Web App

Public-safe Next.js application source (v0.2.1). The source includes original branded concept art, authenticated operations UI, schema, tests, and a public portfolio landing page. **No investor list, private Drive document URLs, original IR files, passwords, or live credentials are included.** Private metadata and the investor pipeline remain in a separately protected database.

## Run

Requires Node 22+, npm, Neon PostgreSQL, Neon Auth. Copy `.env.example` to `.env.local`, then supply real server-only values outside version control.

```
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

## Required server environment

- `DATABASE_URL`: restricted PostgreSQL application connection string (server only)
- `NEON_AUTH_BASE_URL`: Neon Auth endpoint URL
- `NEON_AUTH_COOKIE_SECRET`: securely generated random string, at least 32 characters
- `ADMIN_EMAILS`: comma-separated allowlist of approved administrator emails
- `NEXT_PUBLIC_BASE_URL`: deployed origin URL

## Security / disclosure

- Public portfolio pages contain creative images, not investment offers, approved valuations, or verified financial figures.
- Project documents and private investor data are never placed in the public repository.
- Only authenticated admin users can access operations endpoints; public publishing is disabled by default.
- Submissions and investment outcomes require reviewed evidence before being marked completed.
- Avoid automatically deploying to production until the actual `npm run build`, OAuth flows, access controls, and protected API E2E tests have passed.

This public-safe repository intentionally omits the private IR seed SQL and internal audit/checklist materials. Existing records belong in your secure Neon database, not a GitHub source tree.
