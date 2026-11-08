# LEXID INVEST — Fundraising Operations Web App

Public-safe Next.js application source (v0.2.5). The source includes original branded concept art, authenticated operations UI, schema, tests, and a public portfolio landing page. **No investor list, private Drive document URLs, original IR files, passwords, or live credentials are included.** Private metadata and the investor pipeline remain in a separately protected database.

## Verified release status — 2026-11-07

- Pull request [#1](https://github.com/skvive/lexidinvest/pull/1) merged to `main` after push and PR checks passed.
- GitHub Actions build on `main` passed.
- Latest protected [Vercel staging deployment](https://lexid-4qwblqmgq-shinkang888-codes-projects.vercel.app) built from the merged commit and reached READY.
- 50 tracked source and brand image files; ten branded project WebP covers.
- Neon PostgreSQL currently contains 10 projects and 11 source-document records; none is approved for public visibility.

**Release gates:** Production `DATABASE_URL` now uses a scoped Neon read/write role and the `NEON_AUTH_COOKIE_SECRET` is encrypted in Vercel. Protected OAuth login remains untested end-to-end with a real admin account; `ir.lexid.site` is not yet attached. Deployments from GitHub source have succeeded, but automatic GitHub integration may still need app access. The unrelated `invest.lexid.site` is untouched.

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

## Stability update v0.2.4 (2026-11-07)

- Health endpoint now validates a real server-side DB round-trip (SELECT 1) before reporting configured status; errors return 503 without leaking SQL details.
- Date-only accelerator deadlines use the end of the local date (23:59:59.999 Asia/Seoul), eliminating premature "expired" labels.
- The dashboard highlights only future deadlines; its calendar retains expired deadlines for recordkeeping.
- Google-only login and admin email verification remain mandatory.

## Validation and session safety v0.2.5 (2026-11-08)

- Required names are trimmed and cannot be saved as whitespace only; investor emails are validated and normalized.
- Impossible calendar dates are rejected before SQL execution.
- Duplicate records (Postgres 23505) return 409, invalid foreign keys (23503) return 422; database diagnostics are not sent to clients.
- Dashboard data is cleared immediately and redirected to Google sign-in if an API request returns 401.
- Existing v0.2.4 health SQL probe and Asia/Seoul deadline logic remain unchanged.

## KAYSTYLE IR Templates v0.2.6 (2026-11-09)

The first KAYSTYLE × K-MOUSE / STEVEN.KAY fundraising project is stored only in protected Neon project data. Administrators can browse the editable templates via the `IR 템플릿` section, which reads documents where `version_label` starts with `TEMPLATE`. No Google Drive file IDs, internal URLs, investor lists or confidential financial data are hardcoded into this public GitHub repository. The 2027–2029 funding proposal of KRW 1 billion per year is conditional and not funded. Google login and separate IP/legal/financial verification remain necessary before external investor submission.
