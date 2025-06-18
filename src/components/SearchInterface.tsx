
import React, { useState, useEffect } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SearchResults from './SearchResults';

interface SearchString {
  id: string;
  string_value: string;
  is_active: boolean;
}

const SearchInterface = () => {
  const [searchNames, setSearchNames] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState('');
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
      setAdminStrings(data || []);
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

  const removeSearchName = (index: number) => {
    setSearchNames(searchNames.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSearchName();
    }
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
    const activeAdminStrings = adminStrings.map(s => s.string_value);
    
    if (activeAdminStrings.length === 0 && searchNames.length === 0) {
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
    
    // Simulate search API call with combined strings and names
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: "Sample Negative Article about Searched Entity",
          source: "News Source A",
          date: "2024-06-15",
          sentiment: "negative",
          excerpt: `Negative coverage mentioning ${searchNames.join(', ')} in relation to ${activeAdminStrings.slice(0, 2).join(', ')}...`,
          url: "#"
        },
        {
          id: 2,
          title: "Critical Report on Recent Developments",
          source: "News Source B",
          date: "2024-06-14",
          sentiment: "negative",
          excerpt: `Investigation reveals concerning information about ${searchNames[0] || 'the entity'} regarding ${activeAdminStrings[0] || 'various issues'}...`,
          url: "#"
        },
        {
          id: 3,
          title: "Neutral Analysis of Current Situation",
          source: "News Source C",
          date: "2024-06-13",
          sentiment: "neutral",
          excerpt: `Balanced coverage of ${searchNames.join(' and ')} discussing ${activeAdminStrings.slice(1, 3).join(', ')}...`,
          url: "#"
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
      
      // Save search history
      saveSearchToHistory(activeAdminStrings, searchNames, mockResults.length);
      
      toast({
        title: "Search completed",
        description: `Found ${mockResults.length} results combining ${activeAdminStrings.length} admin strings with ${searchNames.length} names.`
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Admin Search Strings Display */}
      {adminStrings.length > 0 && (
        <div className="bg-white rounded-3xl p-8 shadow-neo">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Active Search Strings</h2>
          <p className="text-gray-600 mb-4">These admin-managed strings will be automatically combined with your search names:</p>
          <div className="flex flex-wrap gap-2">
            {adminStrings.map((str) => (
              <div
                key={str.id}
                className="bg-blue-100 text-blue-800 px-4 py-2 rounded-2xl shadow-neo-small"
              >
                <span className="text-sm font-medium">{str.string_value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Names Section */}
      <div className="bg-white rounded-3xl p-8 shadow-neo">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Search Names</h2>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Enter person/entity name and press Enter or click +"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-12 rounded-2xl border-0 bg-gray-50 shadow-neo-inset focus:shadow-neo-inset-focus transition-all duration-200"
              />
              <Button
                onClick={addSearchName}
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {searchNames.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {searchNames.map((name, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-2xl shadow-neo-small"
                >
                  <span className="text-sm font-medium">{name}</span>
                  <button
                    onClick={() => removeSearchName(index)}
                    className="text-green-600 hover:text-green-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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
