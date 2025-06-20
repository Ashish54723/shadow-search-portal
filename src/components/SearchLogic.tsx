
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SearchString {
  id: string;
  string_value: string;
  translations: Record<string, string>;
  is_active: boolean;
}

interface SearchResultData {
  searchStrings: string[];
  searchNames: string[];
}

export const useSearchLogic = () => {
  const [searchNames, setSearchNames] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState('');
  const [bulkNames, setBulkNames] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultData | null>(null);
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

  const addSearchName = () => {
    if (currentName.trim() && !searchNames.includes(currentName.trim())) {
      setSearchNames([...searchNames, currentName.trim()]);
      setCurrentName('');
    }
  };

  const addBulkNames = () => {
    if (bulkNames.trim()) {
      const names = bulkNames
        .split(/[\n,;]+/)
        .map(name => name.trim())
        .filter(name => name && !searchNames.includes(name));
      
      if (names.length > 0) {
        setSearchNames([...searchNames, ...names]);
        setBulkNames('');
        toast({
          title: "Names added",
          description: `Added ${names.length} new names to your search list.`
        });
      }
    }
  };

  const removeSearchName = (index: number) => {
    setSearchNames(searchNames.filter((_, i) => i !== index));
  };

  const clearAllNames = () => {
    setSearchNames([]);
    toast({
      title: "Names cleared",
      description: "All search names have been removed."
    });
  };

  const copyNamesToClipboard = async () => {
    if (searchNames.length > 0) {
      try {
        await navigator.clipboard.writeText(searchNames.join('\n'));
        toast({
          title: "Copied to clipboard",
          description: `Copied ${searchNames.length} names to clipboard.`
        });
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Failed to copy names to clipboard.",
          variant: "destructive"
        });
      }
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

  const saveSearchToHistory = async (searchStrings: string[], searchNames: string[]) => {
    try {
      await supabase
        .from('search_history')
        .insert([{
          search_strings: searchStrings,
          search_names: searchNames,
          results_count: 0
        }]);
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  };

  const performSearch = async () => {
    const allSearchStrings = getAllSearchStrings();
    
    if (allSearchStrings.length === 0 && searchNames.length === 0) {
      toast({
        title: "Search criteria required",
        description: "Please add at least one search name, or ask admin to add search strings.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    if (searchNames.length > 0) {
      try {
        const nameInserts = searchNames.map(name => ({ name_value: name }));
        await supabase.from('search_names').insert(nameInserts);
      } catch (error) {
        console.error('Error saving search names:', error);
      }
    }
    
    console.log('Search strings with preserved operators:', allSearchStrings);
    
    setTimeout(() => {
      const searchResultData: SearchResultData = {
        searchStrings: allSearchStrings,
        searchNames: searchNames
      };
      
      setSearchResults(searchResultData);
      setIsSearching(false);
      
      saveSearchToHistory(allSearchStrings, searchNames);
      
      const totalLanguages = adminStrings.reduce((acc, str) => {
        return acc + Object.keys(str.translations || {}).length;
      }, 0);
      
      const operatorCount = allSearchStrings.filter(str => /\b(AND|OR|NOT)\b/i.test(str)).length;
      
      toast({
        title: "Search prepared",
        description: `Prepared Google searches using ${allSearchStrings.length} search terms across ${totalLanguages + adminStrings.length} languages with ${searchNames.length} names. ${operatorCount} strings contain search operators.`
      });
    }, 1000);
  };

  return {
    searchNames,
    currentName,
    setCurrentName,
    bulkNames,
    setBulkNames,
    isSearching,
    searchResults,
    adminStrings,
    fetchAdminSearchStrings,
    addSearchName,
    addBulkNames,
    removeSearchName,
    clearAllNames,
    copyNamesToClipboard,
    performSearch
  };
};
