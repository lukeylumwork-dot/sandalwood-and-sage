-- Add cover_image_url column to generated_debates
ALTER TABLE public.generated_debates ADD COLUMN IF NOT EXISTS cover_image_url text;

-- Create episode-media bucket for audio and artwork uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('episode-media', 'episode-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public reads on episode-media bucket
CREATE POLICY "Public read episode-media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'episode-media');

-- Allow inserts to episode-media bucket
CREATE POLICY "Allow inserts to episode-media"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'episode-media');

-- Allow updates to episode-media bucket
CREATE POLICY "Allow updates to episode-media"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'episode-media');

-- Allow deletes from episode-media bucket
CREATE POLICY "Allow deletes from episode-media"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'episode-media');