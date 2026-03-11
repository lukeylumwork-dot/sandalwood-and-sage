ALTER TABLE public.generated_debates
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS side_a_label text,
  ADD COLUMN IF NOT EXISTS side_b_label text,
  ADD COLUMN IF NOT EXISTS side_a_summary text,
  ADD COLUMN IF NOT EXISTS side_b_summary text;