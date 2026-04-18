-- Allow authenticated and anon users to upload to episode-media bucket.
-- Uploads are gated at the application layer by the admin password; this
-- policy permits the browser-side Supabase client (anon key) to reach storage.
-- Paths are constrained to audio/ and artwork/ folders to limit blast radius.
DROP POLICY IF EXISTS "Admin can upload episode media" ON storage.objects;

CREATE POLICY "Admin can upload episode media"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'episode-media'
  AND (
    (storage.foldername(name))[1] IN ('audio', 'artwork')
  )
);
