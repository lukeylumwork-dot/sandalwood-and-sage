CREATE TABLE IF NOT EXISTS public.email_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS email_subscriptions_email_idx
  ON public.email_subscriptions (lower(email));

CREATE POLICY "Public can subscribe with valid email"
ON public.email_subscriptions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(email) <= 255
);
