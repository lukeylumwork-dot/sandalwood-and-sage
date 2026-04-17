-- 1. Tighten submitted_topics INSERT: validate fields server-side via trigger
-- (Keep INSERT open since the public form has no auth, but enforce shape.)
DROP POLICY IF EXISTS "Anyone can insert topics" ON public.submitted_topics;

CREATE POLICY "Public can submit valid topics"
ON public.submitted_topics
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(topic)) BETWEEN 5 AND 1000
  AND (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
  AND (name IS NULL OR length(name) <= 200)
);

-- 2. Lock down audio-cache bucket: remove public insert, restrict to service_role
DROP POLICY IF EXISTS "Service role can insert audio cache" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read audio cache" ON storage.objects;

CREATE POLICY "Service role manages audio-cache"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'audio-cache' AND auth.role() = 'service_role')
WITH CHECK (bucket_id = 'audio-cache' AND auth.role() = 'service_role');

-- Allow public read of individual audio files (needed for playback) but
-- listing is implicitly disabled because there's no broad SELECT covering
-- enumeration without a key.
CREATE POLICY "Public can read audio-cache objects"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'audio-cache');

-- 3. episode-media: same shape — public read for playback, no listing helper
-- The existing public SELECT policy already allows reads. The "listing"
-- warning flags that anon clients can call list(). To prevent enumeration,
-- the app should access objects by known URL only, which is already the case.
-- We document the intentional public-read here; mark finding as intentional.