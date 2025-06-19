
-- Add translations column to search_strings table
ALTER TABLE public.search_strings 
ADD COLUMN translations JSONB DEFAULT '{}';

-- Update existing records to have empty translations object
UPDATE public.search_strings 
SET translations = '{}' 
WHERE translations IS NULL;
