import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SearchResults from './SearchResults';
import AdminSearchStringsDisplay from './AdminSearchStringsDisplay';
import SingleNameInput from './SingleNameInput';
import BulkNameInput from './BulkNameInput';
import AddedNamesDisplay from './AddedNamesDisplay';
import { preserveSearchOperators, restoreSearchOperators, shouldTranslateString } from '@/utils/searchOperators';

interface SearchString {
  id: string;
  string_value: string;
  translations: Record<string, string>;
  is_active: boolean;
}

const SearchInterface = () => {
  const [searchNames, setSearchNames] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState('');
  const [bulkNames, setBulkNames] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [adminStrings, setAdminStrings] = useState<SearchString[]>([]);

  useEffect(() => {
    fetchAdminSearchStrings();
  }, []);

  const fetchAdminSearchStrings = async () => {
    try {
      const { data, error } = await supabase
        .from('search_strings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Process the data to ensure translations is properly typed
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
      // Add original string (with preserved operators)
      allStrings.push(adminString.string_value);
      
      // Add all translations (operators should already be preserved)
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

  const saveSearchToHistory = async (searchStrings: string[], searchNames: string[], resultsCount: number) => {
    try {
      await supabase
        .from('search_history')
        .insert([{
          search_strings: searchStrings,
          search_names: searchNames,
          results_count: resultsCount
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
    
    // Save search names to database
    if (searchNames.length > 0) {
      try {
        const nameInserts = searchNames.map(name => ({ name_value: name }));
        await supabase.from('search_names').insert(nameInserts);
      } catch (error) {
        console.error('Error saving search names:', error);
      }
    }
    
    // Log the search strings being used for debugging
    console.log('Search strings with preserved operators:', allSearchStrings);
    
    // Simulate search API call with combined strings and names
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: "Sample Negative Article about Searched Entity",
          source: "News Source A",
          date: "2024-06-15",
          sentiment: "negative",
          excerpt: `Negative coverage mentioning ${searchNames.join(', ')} in relation to search operators and multilingual terms...`,
          url: "#"
        },
        {
          id: 2,
          title: "Critical Report on Recent Developments",
          source: "News Source B",
          date: "2024-06-14",
          sentiment: "negative",
          excerpt: `Investigation reveals concerning information about ${searchNames[0] || 'the entity'} using advanced search patterns with preserved boolean operators...`,
          url: "#"
        },
        {
          id: 3,
          title: "Neutral Analysis of Current Situation",
          source: "News Source C",
          date: "2024-06-13",
          sentiment: "neutral",
          excerpt: `Balanced coverage of ${searchNames.join(' and ')} discussing multilingual search capabilities with operator preservation...`,
          url: "#"
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
      
      // Save search history
      saveSearchToHistory(allSearchStrings, searchNames, mockResults.length);
      
      const totalLanguages = adminStrings.reduce((acc, str) => {
        return acc + Object.keys(str.translations || {}).length;
      }, 0);
      
      const operatorCount = allSearchStrings.filter(str => /\b(AND|OR|NOT)\b/i.test(str)).length;
      
      toast({
        title: "Search completed with operator preservation",
        description: `Found ${mockResults.length} results using ${allSearchStrings.length} search terms across ${totalLanguages + adminStrings.length} languages with ${searchNames.length} names. ${operatorCount} strings contain search operators.`
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <AdminSearchStringsDisplay adminStrings={adminStrings} />

      {/* Search Names Section */}
      <div className="bg-white rounded-3xl p-8 shadow-neo">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Search Names</h2>
        
        <div className="space-y-6">
          <SingleNameInput
            currentName={currentName}
            setCurrentName={setCurrentName}
            onAddName={addSearchName}
          />

          <BulkNameInput
            bulkNames={bulkNames}
            setBulkNames={setBulkNames}
            onAddBulkNames={addBulkNames}
          />
          
          <AddedNamesDisplay
            searchNames={searchNames}
            onRemoveName={removeSearchName}
            onCopyNames={copyNamesToClipboard}
            onClearAll={clearAllNames}
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="text-center">
        <Button
          onClick={performSearch}
          disabled={isSearching}
          size="lg"
          className="px-12 py-4 text-lg rounded-2xl shadow-neo hover:shadow-neo-hover transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isSearching ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Searching...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Negative Media
            </div>
          )}
        </Button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <SearchResults results={searchResults} />
      )}
    </div>
  );
};

export default SearchInterface;
