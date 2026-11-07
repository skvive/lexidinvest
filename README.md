# LEXID INVEST — Fundraising Operations Web App

Public-safe Next.js application for the LEXID portfolio. The existing protected Vercel staging build is deployed separately.

## Safe deployment rule
This GitHub repository is public. **Never commit private investor contacts, Google Drive document URLs, original IR files, database credentials, or environment secrets.** The existing private records remain in Neon.

## Project
- Stack: Next.js 16, React 19, Neon PostgreSQL, Neon Auth
- Modules: portfolio landing, investor CRM, applications, deadlines, documents, risk reviews
- CI checks: npm test, npm run typecheck, npm run build
- Production cutover requires an authenticated end-to-end test.

Source package: maintained in the owner's protected Google Drive project folder.