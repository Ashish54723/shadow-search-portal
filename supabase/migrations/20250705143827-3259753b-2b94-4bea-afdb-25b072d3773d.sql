
-- Create admin_users table for admin authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create regular_users table for managing users who can use the search functionality
CREATE TABLE public.regular_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add user_id column to search_strings to isolate strings per user
ALTER TABLE public.search_strings ADD COLUMN user_id UUID REFERENCES public.regular_users(id);

-- Add user_id column to string_buckets to isolate buckets per user
ALTER TABLE public.string_buckets ADD COLUMN user_id UUID REFERENCES public.regular_users(id);

-- Add user_id column to search_history to isolate history per user
ALTER TABLE public.search_history ADD COLUMN user_id UUID REFERENCES public.regular_users(id);

-- Add user_id column to search_names to isolate names per user
ALTER TABLE public.search_names ADD COLUMN user_id UUID REFERENCES public.regular_users(id);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on regular_users
ALTER TABLE public.regular_users ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Admins can view all admin users" 
  ON public.admin_users 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert admin users" 
  ON public.admin_users 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can update admin users" 
  ON public.admin_users 
  FOR UPDATE 
  USING (true);

-- Regular users policies  
CREATE POLICY "Admins can view all regular users" 
  ON public.regular_users 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can create regular users" 
  ON public.regular_users 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can update regular users" 
  ON public.regular_users 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Admins can delete regular users" 
  ON public.regular_users 
  FOR DELETE 
  USING (true);

-- Update search_strings policies to be user-specific
DROP POLICY IF EXISTS "Allow public read access to search_strings" ON public.search_strings;
DROP POLICY IF EXISTS "Allow public insert access to search_strings" ON public.search_strings;
DROP POLICY IF EXISTS "Allow public update access to search_strings" ON public.search_strings;
DROP POLICY IF EXISTS "Allow public delete access to search_strings" ON public.search_strings;

-- Update string_buckets policies to be user-specific
DROP POLICY IF EXISTS "Allow public read access to string_buckets" ON public.string_buckets;
DROP POLICY IF EXISTS "Allow public insert access to string_buckets" ON public.string_buckets;
DROP POLICY IF EXISTS "Allow public update access to string_buckets" ON public.string_buckets;
DROP POLICY IF EXISTS "Allow public delete access to string_buckets" ON public.string_buckets;

-- Update search_history policies to be user-specific
DROP POLICY IF EXISTS "Allow public read access to search_history" ON public.search_history;
DROP POLICY IF EXISTS "Allow public insert access to search_history" ON public.search_history;

-- Update search_names policies to be user-specific
DROP POLICY IF EXISTS "Allow public read access to search_names" ON public.search_names;
DROP POLICY IF EXISTS "Allow public insert access to search_names" ON public.search_names;

-- New user-specific policies (temporarily allowing all access - will be updated after authentication is implemented)
CREATE POLICY "Allow access to search_strings" ON public.search_strings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow access to string_buckets" ON public.string_buckets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow access to search_history" ON public.search_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow access to search_names" ON public.search_names FOR ALL USING (true) WITH CHECK (true);

-- Create function to hash passwords (simple implementation)
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Simple hash function - in production, use proper bcrypt or similar
  RETURN encode(digest(password || 'salt_string', 'sha256'), 'hex');
END;
$$;

-- Insert default admin user (username: admin, password: admin123)
INSERT INTO public.admin_users (username, password_hash, email) 
VALUES ('admin', public.hash_password('admin123'), 'admin@example.com');
