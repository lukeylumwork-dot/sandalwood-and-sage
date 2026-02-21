
-- Create a public bucket for cached TTS audio
INSERT INTO storage.buckets (id, name, public) VALUES ('audio-cache', 'audio-cache', true);

-- Allow public read access
CREATE POLICY "Public read access for audio cache"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio-cache');

-- Allow edge functions (service role) to insert
CREATE POLICY "Service role can insert audio cache"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'audio-cache');
