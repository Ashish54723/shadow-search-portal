
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { SearchResultData, SearchString } from '@/types/search';

export const useSearchExecution = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultData | null>(null);

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

  const performSearch = async (
    searchNames: string[],
    setSearchNames: (names: string[]) => void,
    currentName: string,
    setCurrentName: (name: string) => void,
    bulkNames: string,
    setBulkNames: (names: string) => void,
    allSearchStrings: string[],
    adminStrings: SearchString[]
  ) => {
    // Auto-add current name if it exists and isn't already in the list
    let finalSearchNames = [...searchNames];
    if (currentName.trim() && !searchNames.includes(currentName.trim())) {
      finalSearchNames = [...searchNames, currentName.trim()];
      setSearchNames(finalSearchNames);
      setCurrentName('');
    }

    // Auto-add bulk names if they exist
    if (bulkNames.trim()) {
      const names = bulkNames
        .split(/[\n,;]+/)
        .map(name => name.trim())
        .filter(name => name && !finalSearchNames.includes(name));
      
      if (names.length > 0) {
        finalSearchNames = [...finalSearchNames, ...names];
        setSearchNames(finalSearchNames);
        setBulkNames('');
      }
    }
    
    if (allSearchStrings.length === 0 && finalSearchNames.length === 0) {
      toast({
        title: "Search criteria required",
        description: "Please add at least one search name, or ask admin to add search strings.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    if (finalSearchNames.length > 0) {
      try {
        const nameInserts = finalSearchNames.map(name => ({ name_value: name }));
        await supabase.from('search_names').insert(nameInserts);
      } catch (error) {
        console.error('Error saving search names:', error);
      }
    }
    
    console.log('Search strings with preserved operators:', allSearchStrings);
    
    setTimeout(() => {
      const searchResultData: SearchResultData = {
        searchStrings: allSearchStrings,
        searchNames: finalSearchNames
      };
      
      setSearchResults(searchResultData);
      setIsSearching(false);
      
      saveSearchToHistory(allSearchStrings, finalSearchNames);
      
      const totalLanguages = adminStrings.reduce((acc, str) => {
        return acc + Object.keys(str.translations || {}).length;
      }, 0);
      
      const operatorCount = allSearchStrings.filter(str => /\b(AND|OR|NOT)\b/i.test(str)).length;
      
      toast({
        title: "Search prepared",
        description: `Prepared Google searches using ${allSearchStrings.length} search terms across ${totalLanguages + adminStrings.length} languages with ${finalSearchNames.length} names. ${operatorCount} strings contain search operators.`
      });
    }, 1000);
  };

  return {
    isSearching,
    searchResults,
    performSearch
  };
};
