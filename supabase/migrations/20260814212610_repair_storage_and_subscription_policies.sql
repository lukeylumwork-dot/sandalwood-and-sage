-- Bring storage.objects and email_subscriptions to the state the earlier
-- migrations intended. 20260417174057 and 20260417181543 only landed in part:
-- their public-schema statements took effect but their storage.objects
-- statements did not, leaving anonymous INSERT open on both buckets.
-- 20260423000000 was never applied as written either -- production carried
-- email_subscriptions policies from a differently-versioned migration whose
-- INSERT check is `true`, so the email validation never ran.

-- 1. episode-media: public read only. Admin uploads go through the
--    admin-upload edge function using the service role, which has BYPASSRLS,
--    so removing these does not affect admin publishing.
DROP POLICY IF EXISTS "Allow inserts to episode-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow updates to episode-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes from episode-media" ON storage.objects;

-- 2. audio-cache: "Service role can insert audio cache" was granted to PUBLIC
--    despite its name, so any anon key holder could write to the bucket.
--    Replace it with a genuinely service-role-scoped policy. Public read is
--    already served by "Public read access for audio cache", so no second
--    SELECT policy is added.
DROP POLICY IF EXISTS "Service role can insert audio cache" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read audio cache" ON storage.objects;
DROP POLICY IF EXISTS "Service role manages audio-cache" ON storage.objects;

CREATE POLICY "Service role manages audio-cache"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'audio-cache' AND auth.role() = 'service_role')
WITH CHECK (bucket_id = 'audio-cache' AND auth.role() = 'service_role');

-- 3. email_subscriptions: replace the unconditional INSERT policy with the
--    validating one from 20260423000000, and add that migration's
--    case-insensitive unique index. Verified beforehand: no existing row
--    fails the check and no case-insensitive duplicates exist.
DROP POLICY IF EXISTS "anon_insert_email_subscriptions" ON public.email_subscriptions;
DROP POLICY IF EXISTS "Public can subscribe with valid email" ON public.email_subscriptions;

CREATE POLICY "Public can subscribe with valid email"
ON public.email_subscriptions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(email) <= 255
);

CREATE UNIQUE INDEX IF NOT EXISTS email_subscriptions_email_idx
  ON public.email_subscriptions (lower(email));
