# Release Checklist

Use this checklist for the real Supabase and Vercel release. The current content lifecycle has no draft state: creating an episode publishes it immediately, editing updates the public episode, featuring changes public display, and deleting removes the episode.

## Required Environment Variables

Vercel:

```sh
VITE_SUPABASE_URL="https://tboprfkeksspinywexea.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
```

Supabase Edge Function secrets:

```sh
ADMIN_PASSWORD="your-admin-password"
SUPABASE_URL="https://tboprfkeksspinywexea.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

## Deploy

1. Run local checks:

   ```sh
   npm ci
   npm run lint
   npx tsc --noEmit
   npm test
   npm run build
   ```

2. Commit and push the release branch to GitHub.

3. Link to the Supabase project if needed:

   ```sh
   supabase link --project-ref tboprfkeksspinywexea
   ```

4. Apply any unapplied migrations:

   ```sh
   supabase db push
   ```

   The deployment must include these latest hardening migrations:

   ```text
   20260420000000_lock_episode_media_uploads.sql
   20260420001000_tighten_topic_submission_policy.sql
   ```

5. Set Supabase Edge Function secrets:

   ```sh
   supabase secrets set ADMIN_PASSWORD="..."
   supabase secrets set SUPABASE_URL="https://tboprfkeksspinywexea.supabase.co"
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY="..."
   ```

6. Deploy all Edge Functions:

   ```sh
   supabase functions deploy verify-admin
   supabase functions deploy admin-write
   supabase functions deploy admin-upload
   supabase functions deploy rss-feed
   supabase functions deploy share-episode
   ```

7. Configure Vercel environment variables, then deploy from the pushed GitHub branch.

## Post-Deploy Verification

- Visit `https://sandalwoodandsage.fm` and confirm the home page loads without console errors.
- Visit `/admin`, log in with `ADMIN_PASSWORD`, and confirm the episode list loads.
- Create a test episode with title, description, question, arguments, and category. Confirm it appears publicly immediately.
- Edit the test episode title or summary and confirm the public episode updates.
- Upload an audio file. Confirm the upload succeeds, the URL is saved, and the public audio player loads metadata.
- Upload cover artwork. Confirm the upload succeeds and artwork appears in the featured card or share metadata.
- Feature the test episode. Confirm only that episode shows as featured/latest.
- Unfeature the test episode. Confirm the latest episode fallback still works.
- Copy the share link from the episode modal. Open it in a private window and confirm it redirects to the site and opens the correct episode.
- Open `https://tboprfkeksspinywexea.supabase.co/functions/v1/rss-feed`. Confirm XML loads publicly and includes `<item>`, `<guid>`, `<link>`, and `<enclosure>` for episodes with audio.
- Delete the test episode. Confirm it disappears from admin and public views.
- Confirm live links and metadata use `https://sandalwoodandsage.fm`, not a Vercel preview URL or old domain.

## Known Release Limitations

- There is no draft/unpublish workflow. Create means public immediately.
- Topic submissions have shape validation but no CAPTCHA or durable rate limiting.
- Admin access is a shared password, not per-user auth.
- RSS enclosure length falls back to `0` if the audio host does not return `content-length` to a `HEAD` request.
- The build currently has a large bundle warning from generated UI/dependency footprint.
