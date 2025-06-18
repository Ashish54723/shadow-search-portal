
-- Create a table to store admin-managed search strings
CREATE TABLE public.search_strings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  string_value TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table to store the search names entered by users
CREATE TABLE public.search_names (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table to store search results/history
CREATE TABLE public.search_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_strings TEXT[] NOT NULL,
  search_names TEXT[] NOT NULL,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) - for now allowing public access since no auth is implemented
ALTER TABLE public.search_strings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

-- Create policies that allow public access (you may want to restrict this later with authentication)
CREATE POLICY "Allow public read access to search_strings" 
  ON public.search_strings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to search_strings" 
  ON public.search_strings 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public update access to search_strings" 
  ON public.search_strings 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Allow public delete access to search_strings" 
  ON public.search_strings 
  FOR DELETE 
  USING (true);

CREATE POLICY "Allow public read access to search_names" 
  ON public.search_names 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to search_names" 
  ON public.search_names 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public read access to search_history" 
  ON public.search_history 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to search_history" 
  ON public.search_history 
  FOR INSERT 
  WITH CHECK (true);
