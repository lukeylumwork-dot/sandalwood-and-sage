-- Media uploads are handled by the admin-upload edge function with the
-- service role key. Anonymous clients must not be able to write storage
-- objects directly, even if the admin UI has verified a password.
DROP POLICY IF EXISTS "Admin can upload episode media" ON storage.objects;
