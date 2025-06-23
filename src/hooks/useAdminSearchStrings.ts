
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SearchString } from '@/types/search';

export const useAdminSearchStrings = () => {
  const [adminStrings, setAdminStrings] = useState<SearchString[]>([]);

  const fetchAdminSearchStrings = async () => {
    try {
      const { data, error } = await supabase
        .from('search_strings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const processedData = data?.map(item => ({
        ...item,
        translations: (item.translations && typeof item.translations === 'object' && !Array.isArray(item.translations)) 
          ? item.translations as Record<string, string>
          : {}
      })) || [];
      
      setAdminStrings(processedData);
    } catch (error) {
      console.error('Error fetching admin search strings:', error);
    }
  };

  const getAllSearchStrings = () => {
    const allStrings: string[] = [];
    
    adminStrings.forEach(adminString => {
      allStrings.push(adminString.string_value);
      
      if (adminString.translations) {
        Object.values(adminString.translations).forEach(translation => {
          if (translation.trim()) {
            allStrings.push(translation);
          }
        });
      }
    });
    
    return allStrings;
  };

  return {
    adminStrings,
    fetchAdminSearchStrings,
    getAllSearchStrings
  };
};
