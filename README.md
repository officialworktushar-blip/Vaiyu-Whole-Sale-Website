# Vaiyu Industries — Wholesale Website

Wholesale storefront for Vaiyu Industries with a customer catalog, cart/checkout,
order confirmation emails, and a password-protected admin panel.

## Tech Stack

- **Next.js 14** (App Router, React 18, TypeScript, Tailwind CSS)
- **Prisma 7** + **PostgreSQL** (Supabase)
- **Supabase Storage** for product and banner images
- **Nodemailer** (Gmail SMTP) for order emails
- **HMAC-signed cookies** for admin sessions

## Environment Variables

All configuration is read from `process.env` — nothing is hardcoded. Copy
`.env.example` to `.env` and fill in real values.

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string (Supabase/Neon). |
| `AUTH_SECRET` | Yes | Signs the admin session cookie. Use a long random string (`openssl rand -base64 32`). |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (`https://<ref>.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key (public, safe in the browser). |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service-role key (server-only, used by `/api/upload`). |
| `EMAIL_USER` | Yes | Gmail address used to send order emails. |
| `EMAIL_APP_PASSWORD` | Yes | Gmail App Password for the above account. |
| `ADMIN_EMAIL` | Yes | Address that receives order notifications. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site URL for Open Graph tags. |
| `ADMIN_PASSWORD` | Used by seed | Password for the admin user created by `db:seed:admin`. |
| `WHATSAPP_NUMBER` | Optional | Number for the floating WhatsApp button (`wa.me` link). |

## Local Setup

```bash
npm install          # also runs `prisma generate` (postinstall)
cp .env.example .env # fill in the variables above
npm run db:migrate   # applies schema changes to your local database
npm run db:seed      # creates demo categories, products, and a banner (dev only)
npm run db:seed:admin # creates the admin user (ADMIN_EMAIL + ADMIN_PASSWORD)
npm run dev          # http://localhost:3000
```

The admin panel is at `/admin` (login with the seeded admin credentials).

> **Note:** `npm run db:seed` is sample data only (placeholder images/descriptions).
> It refuses to run when `NODE_ENV=production` unless you set `SEED_FORCE=true`.
> Use `db:seed:admin` to create the admin user instead.

## Prisma Migrations in Production

Migrations are committed under `prisma/migrations/`. Apply them against the
production database (any machine that has the production `DATABASE_URL`):

```bash
DATABASE_URL="postgresql://..." npm run db:deploy
```

Or with the Vercel production env:

```bash
npx vercel env pull .env.production.local
set -a; source .env.production.local; set +a   # on Linux/macOS
npm run db:deploy
```

`npm run db:deploy` runs `prisma migrate deploy`, which applies only pending
migrations and is safe to run repeatedly. Do **not** use `db:migrate` (dev
command) against production.

## Seeding the Admin User in Production

```bash
ADMIN_EMAIL="admin@your-domain.com" ADMIN_PASSWORD="a-strong-password" npm run db:seed:admin
```

This upserts the admin (creates or resets the password). Requires
`DATABASE_URL` in your environment. Do not commit real credentials to git.

## Deploying to Vercel

1. Push the repo to GitHub (e.g. `vaiyu-wholesale`).
2. In the Vercel dashboard click **Add New → Project**, import the repo.
   Vercel auto-detects Next.js — leave the build command as-is.
3. Under **Settings → Environment Variables**, add every variable from the
   table above (production values). Mark `NEXT_PUBLIC_*` vars as
   **Preview**, **Production**, and **Development** as appropriate.
4. Create the `product-images` **public** bucket in Supabase Storage
   (Dashboard → Storage → New bucket, name `product-images`, Public bucket:
   ON). See the note below.
5. Before/after first deploy, apply migrations:
   ```bash
   npx vercel env pull .env.production.local
   # load the vars, then:
   npm run db:deploy
   ```
6. Create your admin user:
   ```bash
   ADMIN_EMAIL="..." ADMIN_PASSWORD="..." npm run db:seed:admin
   ```
7. Deploy (or push to the connected branch) and verify `/`, `/products`, and
   `/admin` in production.

Notes:

- The Prisma client is generated at install time via the `postinstall` script,
  so no generated files are committed (`/generated/` is gitignored).
- `next.config.mjs` whitelists `*.supabase.co` (your storage host) and
  `placehold.co` (dev fallback images) for the Next.js image optimizer.
- **Supabase Storage bucket:** the bucket must be **public** so images load on
  the live site. The server uploads with the service-role key (bypasses RLS);
  visitors only need public read access.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server. |
| `npm run build` | Production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | ESLint. |
| `npm run db:migrate` | Prisma dev migrations (local only). |
| `npm run db:deploy` | Apply committed migrations (production). |
| `npm run db:seed` | Dev sample data (categories/products/banner). Refuses in production. |
| `npm run db:seed:admin` | Create/update the admin user from `ADMIN_EMAIL`/`ADMIN_PASSWORD`. |
