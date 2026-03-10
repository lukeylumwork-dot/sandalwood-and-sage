
-- Table for AI-generated debates
CREATE TABLE public.generated_debates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  summary TEXT NOT NULL,
  host_intro TEXT NOT NULL,
  for_argument TEXT NOT NULL,
  against_argument TEXT NOT NULL,
  key_points JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.generated_debates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert debates"
  ON public.generated_debates FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read debates"
  ON public.generated_debates FOR SELECT
  USING (true);

-- Table for user-submitted topic suggestions
CREATE TABLE public.submitted_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.submitted_topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert topics"
  ON public.submitted_topics FOR INSERT
  WITH CHECK (true);

-- No public SELECT on submitted_topics to protect PII (name/email)
