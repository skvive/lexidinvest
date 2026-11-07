# LEXID INVEST — Fundraising Operations Web App

Public-safe Next.js application source (v0.2.3). The source includes original branded concept art, authenticated operations UI, schema, tests, and a public portfolio landing page. **No investor list, private Drive document URLs, original IR files, passwords, or live credentials are included.** Private metadata and the investor pipeline remain in a separately protected database.

## Verified release status — 2026-11-07

- Pull request [#1](https://github.com/skvive/lexidinvest/pull/1) merged to `main` after push and PR checks passed.
- GitHub Actions build on `main` passed.
- Latest protected [Vercel staging deployment](https://lexid-4qwblqmgq-shinkang888-codes-projects.vercel.app) built from the merged commit and reached READY.
- 50 tracked source and brand image files; ten branded project WebP covers.
- Neon PostgreSQL currently contains 10 projects and 11 source-document records; none is approved for public visibility.

**Release gates:** Vercel automatic Git integration still needs installation access to `skvive/lexidinvest`. The production `DATABASE_URL` and `NEON_AUTH_COOKIE_SECRET` are not configured (cross-app credential forwarding was denied by the security gate). Real Google OAuth and database E2E checks remain pending. The public custom domain `ir.lexid.site` has not been attached; the unrelated `invest.lexid.site` has not been modified.

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

## Administrator sign-in

The admin sign-in page intentionally provides **Google login only**; Neon Auth disables email/password sign-in and self-signup. The server verifies the Google account's email and requires an exact `ADMIN_EMAILS` allowlist match. Callback/sign-out remain handled by Neon Auth. Production release still requires a real Google OAuth login E2E check before attaching the public custom domain.
