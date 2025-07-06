
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SearchString } from '@/types/search';

interface StringBucket {
  id: string;
  bucket_name: string;
  string_ids: string[];
  created_at: string;
  updated_at: string;
}

export const useStringBuckets = (userId?: string) => {
  const [selectedBuckets, setSelectedBuckets] = useState<string[]>([]);
  const [buckets, setBuckets] = useState<StringBucket[]>([]);

  const fetchBuckets = async () => {
    try {
      let query = supabase
        .from('string_buckets')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBuckets(data || []);
    } catch (error) {
      console.error('Error fetching buckets:', error);
    }
  };

  const getSelectedBucketStrings = (allStrings: SearchString[]) => {
    if (selectedBuckets.length === 0) {
      // If no buckets selected, return all strings (backward compatibility)
      return allStrings;
    }

    // Get all string IDs from selected buckets
    const selectedStringIds = new Set<string>();
    buckets
      .filter(bucket => selectedBuckets.includes(bucket.id))
      .forEach(bucket => {
        bucket.string_ids.forEach(id => selectedStringIds.add(id));
      });

    // Return only strings that are in selected buckets
    return allStrings.filter(string => selectedStringIds.has(string.id));
  };

  const getAllSearchStringsFromBuckets = (allStrings: SearchString[]) => {
    const selectedStrings = getSelectedBucketStrings(allStrings);
    const stringValues: string[] = [];
    
    selectedStrings.forEach(adminString => {
      stringValues.push(adminString.string_value);
      
      if (adminString.translations) {
        Object.values(adminString.translations).forEach(translation => {
          if (translation.trim()) {
            stringValues.push(translation);
          }
        });
      }
    });
    
    return stringValues;
  };

  return {
    selectedBuckets,
    setSelectedBuckets,
    buckets,
    fetchBuckets,
    getSelectedBucketStrings,
    getAllSearchStringsFromBuckets
  };
};
