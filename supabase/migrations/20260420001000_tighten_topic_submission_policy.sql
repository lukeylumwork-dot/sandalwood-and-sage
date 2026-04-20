-- Keep public topic submissions available, but make the database constraints
-- match the client-side limits so bypassing the browser cannot store oversized
-- values.
DROP POLICY IF EXISTS "Public can submit valid topics" ON public.submitted_topics;

CREATE POLICY "Public can submit valid topics"
ON public.submitted_topics
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(topic)) BETWEEN 5 AND 500
  AND (email IS NULL OR email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
  AND (name IS NULL OR length(name) <= 100)
);
