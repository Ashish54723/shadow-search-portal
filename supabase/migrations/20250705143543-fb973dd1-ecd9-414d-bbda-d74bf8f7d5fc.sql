
-- Create the string_buckets table
CREATE TABLE public.string_buckets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bucket_name TEXT NOT NULL,
  string_ids TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.string_buckets ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (matching the pattern of other tables)
CREATE POLICY "Allow public read access to string_buckets" 
  ON public.string_buckets 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to string_buckets" 
  ON public.string_buckets 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update access to string_buckets" 
  ON public.string_buckets 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public delete access to string_buckets" 
  ON public.string_buckets 
  FOR DELETE 
  USING (true);
