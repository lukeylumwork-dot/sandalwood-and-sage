# Sandalwood & Sage

Sandalwood & Sage is a Vite, React, and Supabase site for publishing short debate podcast episodes. The public app displays the latest episode, an episode archive, topic submissions, subscription links, RSS, and share metadata. A hidden `/admin` route lets an editor publish, update, feature, delete, and upload media for episodes.

## Architecture

- `src/` contains the Vite React app.
- `src/pages/Index.tsx` composes the public page.
- `src/pages/Admin.tsx` contains the admin publishing UI.
- `src/components/EpisodesList.tsx` reads public episodes and handles episode deep links.
- `src/integrations/supabase/` contains the browser Supabase client and generated database types.
- `supabase/migrations/` defines tables, storage buckets, RLS policies, and policy hardening.
- `supabase/functions/` contains Supabase Edge Functions:
  - `verify-admin`: verifies the admin password.
  - `admin-write`: performs validated service-role episode writes.
  - `admin-upload`: performs validated service-role media uploads.
  - `rss-feed`: emits the public RSS feed.
  - `share-episode`: emits episode-specific share metadata and redirects into the app.
- `vercel.json` rewrites all routes to the Vite app entry so React Router routes work on refresh.

## Data Flow

Public visitors read `generated_debates` directly through the anon Supabase client. Topic suggestions insert into `submitted_topics` through the anon client, with RLS enforcing basic shape limits and no public read policy.

Admin users enter the shared admin password in `/admin`. The browser verifies it with `verify-admin`, then sends episode writes to `admin-write` and media uploads to `admin-upload`. Those functions validate the request and use the Supabase service role key server-side.

RSS and share URLs are public Supabase Edge Functions. Share URLs use stable episode IDs and redirect to `/?episode=<id>#episodes`, where the React app opens the matching episode modal.

## Setup

Use npm as the package manager for this repo.

```sh
npm ci
npm run dev
```

The dev server defaults to port `8080`.

## Environment Variables

Vercel or frontend hosting variables:

```sh
VITE_SUPABASE_URL="https://svtwzufbwajdolcgqdqf.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
```

Supabase Edge Function secrets, set with `supabase secrets set`:

```sh
ADMIN_PASSWORD="admin-password"
SUPABASE_URL="https://svtwzufbwajdolcgqdqf.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in Vite, Vercel client env vars, or browser code.

## Verification

```sh
npm run lint
npx tsc --noEmit
npm test
npm run build
```

`npm test` currently has only lightweight coverage. Add focused tests around episode mapping, share links, RSS generation, and admin flows before relying on it as a release gate.

## Deployment Notes

- Deploy the frontend to Vercel or Lovable-compatible static hosting.
- Apply Supabase migrations before using admin publishing.
- Deploy all Supabase Edge Functions after changing `supabase/functions`.
- `rss-feed` and `share-episode` are configured as public functions in `supabase/config.toml`.
- `admin-write`, `admin-upload`, and `verify-admin` expect the admin password and anon Authorization header from the browser.
- The `episode-media` bucket should remain public-read but must not allow anonymous direct writes. Uploads should go through `admin-upload`.

## Known Limitations

- RSS enclosure lengths are read with a short `HEAD` request when possible and fall back to `0`; storing file sizes with episodes would be more reliable.
- Topic submission has basic RLS validation but no CAPTCHA or durable rate limiting.
- Admin access is password-based rather than per-user Supabase Auth.
- There is no draft/published column yet; creating an episode makes it publicly visible, and deleting removes it.
- The app still has a broad generated shadcn/ui surface area and dependency footprint.
- Test coverage is minimal.
