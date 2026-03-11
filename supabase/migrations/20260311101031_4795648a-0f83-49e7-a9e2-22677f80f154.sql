CREATE POLICY "Anyone can delete debates"
ON public.generated_debates
FOR DELETE
TO public
USING (true);