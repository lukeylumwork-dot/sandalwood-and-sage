
-- Lock down generated_debates: keep public read, remove public writes
DROP POLICY IF EXISTS "Anyone can insert debates" ON public.generated_debates;
DROP POLICY IF EXISTS "Anyone can update debates" ON public.generated_debates;
DROP POLICY IF EXISTS "Anyone can delete debates" ON public.generated_debates;

-- Lock down episode-media bucket: keep public read, remove public writes
DROP POLICY IF EXISTS "Allow inserts to episode-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow updates to episode-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes from episode-media" ON storage.objects;

-- (No replacement policies needed — service_role bypasses RLS, so the
-- admin-write edge function continues to work. Anonymous clients can still
-- read both the table and the bucket via the existing SELECT policies.)
