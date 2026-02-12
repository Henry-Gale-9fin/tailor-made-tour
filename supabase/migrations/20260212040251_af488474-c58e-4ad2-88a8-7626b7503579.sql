
-- Create features table
CREATE TABLE public.features (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  use_case TEXT NOT NULL,
  category TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'Image',
  status TEXT NOT NULL DEFAULT 'Prototype',
  image_url TEXT,
  url TEXT,
  feature_group TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public read, no write from client)
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Features are publicly readable"
  ON public.features FOR SELECT
  USING (true);
