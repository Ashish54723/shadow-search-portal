
import React, { useState } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import SearchResults from './SearchResults';

const SearchInterface = () => {
  const [searchStrings, setSearchStrings] = useState<string[]>([]);
  const [searchNames, setSearchNames] = useState<string[]>([]);
  const [currentString, setCurrentString] = useState('');
  const [currentName, setCurrentName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const addSearchString = () => {
    if (currentString.trim() && !searchStrings.includes(currentString.trim())) {
      setSearchStrings([...searchStrings, currentString.trim()]);
      setCurrentString('');
    }
  };

  const addSearchName = () => {
    if (currentName.trim() && !searchNames.includes(currentName.trim())) {
      setSearchNames([...searchNames, currentName.trim()]);
      setCurrentName('');
    }
  };

  const removeSearchString = (index: number) => {
    setSearchStrings(searchStrings.filter((_, i) => i !== index));
  };

  const removeSearchName = (index: number) => {
    setSearchNames(searchNames.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'string' | 'name') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'string') {
        addSearchString();
      } else {
        addSearchName();
      }
    }
  };

  const performSearch = async () => {
    if (searchStrings.length === 0 && searchNames.length === 0) {
      toast({
        title: "Search criteria required",
        description: "Please add at least one search string or name.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate search API call
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: "Sample Article 1",
          source: "News Source A",
          date: "2024-06-15",
          sentiment: "negative",
          excerpt: "This is a sample excerpt from a negative article mentioning the search terms...",
          url: "#"
        },
        {
          id: 2,
          title: "Sample Article 2",
          source: "News Source B",
          date: "2024-06-14",
          sentiment: "neutral",
          excerpt: "Another sample excerpt that contains relevant information about the search criteria...",
          url: "#"
        },
        {
          id: 3,
          title: "Sample Article 3",
          source: "News Source C",
          date: "2024-06-13",
          sentiment: "negative",
          excerpt: "Third sample article with negative sentiment related to the search parameters...",
          url: "#"
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
      
      toast({
        title: "Search completed",
        description: `Found ${mockResults.length} results matching your criteria.`
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Strings Section */}
      <div className="bg-white rounded-3xl p-8 shadow-neo">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Search Strings</h2>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Enter search string and press Enter or click +"
                value={currentString}
                onChange={(e) => setCurrentString(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'string')}
                className="pr-12 rounded-2xl border-0 bg-gray-50 shadow-neo-inset focus:shadow-neo-inset-focus transition-all duration-200"
              />
              <Button
                onClick={addSearchString}
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {searchStrings.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {searchStrings.map((str, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-2xl shadow-neo-small"
                >
                  <span className="text-sm font-medium">{str}</span>
                  <button
                    onClick={() => removeSearchString(index)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
                onKeyPress={(e) => handleKeyPress(e, 'name')}
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
