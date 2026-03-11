CREATE POLICY "Anyone can update debates"
ON public.generated_debates
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);