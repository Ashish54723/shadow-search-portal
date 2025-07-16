
-- Create brands table for brand management
CREATE TABLE public.brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  keywords TEXT[] DEFAULT '{}',
  risk_level TEXT DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add role field to admin_users table
ALTER TABLE public.admin_users ADD COLUMN role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'analyst', 'viewer'));

-- Add role field to regular_users table  
ALTER TABLE public.regular_users ADD COLUMN role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'analyst', 'viewer'));

-- Add brand_id field to search_strings to link searches to brands
ALTER TABLE public.search_strings ADD COLUMN brand_id UUID REFERENCES public.brands(id);

-- Add brand_id field to search_history to track which brand searches were for
ALTER TABLE public.search_history ADD COLUMN brand_id UUID REFERENCES public.brands(id);

-- Enable RLS on brands table
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Create policies for brands table
CREATE POLICY "Admins and analysts can view all brands" 
  ON public.brands 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can create brands" 
  ON public.brands 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can update brands" 
  ON public.brands 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Admins can delete brands" 
  ON public.brands 
  FOR DELETE 
  USING (true);

-- Update existing admin user to have admin role
UPDATE public.admin_users SET role = 'admin' WHERE username = 'admin';
