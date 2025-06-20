
import React, { useEffect, useState } from 'react';
import { ExternalLink, Search, Copy } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';

interface SearchResultsProps {
  searchStrings: string[];
  searchNames: string[];
}

const SearchResults = ({ searchStrings, searchNames }: SearchResultsProps) => {
  const [allSearchUrls, setAllSearchUrls] = useState<string[]>([]);

  const createGoogleSearchUrl = (query: string) => {
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  const createCombinedSearchUrl = (searchString: string, names: string[]) => {
    const combinedQuery = names.length > 0 
      ? `${searchString} (${names.join(' OR ')})`
      : searchString;
    return createGoogleSearchUrl(combinedQuery);
  };

  // Auto-open all search combinations when results are ready
  useEffect(() => {
    if (searchStrings.length > 0) {
      const searchUrls: string[] = [];
      
      // Combined searches (string + all names)
      searchStrings.forEach(searchString => {
        const combinedUrl = createCombinedSearchUrl(searchString, searchNames);
        searchUrls.push(combinedUrl);
      });
      
      // Individual string + name combinations
      if (searchNames.length > 0) {
        searchStrings.forEach(searchString => {
          searchNames.forEach(name => {
            const individualUrl = createGoogleSearchUrl(`${searchString} ${name}`);
            searchUrls.push(individualUrl);
          });
        });
      }
      
      // Strings only
      searchStrings.forEach(searchString => {
        const stringOnlyUrl = createGoogleSearchUrl(searchString);
        searchUrls.push(stringOnlyUrl);
      });
      
      // Names only
      searchNames.forEach(name => {
        const nameOnlyUrl = createGoogleSearchUrl(name);
        searchUrls.push(nameOnlyUrl);
      });
      
      setAllSearchUrls(searchUrls);
      
      // Open all tabs with a small delay to prevent browser blocking
      searchUrls.forEach((url, index) => {
        setTimeout(() => {
          window.open(url, '_blank');
        }, index * 100); // 100ms delay between each tab
      });
    }
  }, [searchStrings, searchNames]);

  const getTotalSearchCount = () => {
    let count = 0;
    
    // Combined searches
    count += searchStrings.length;
    
    // Individual combinations
    if (searchNames.length > 0) {
      count += searchStrings.length * searchNames.length;
    }
    
    // Strings only
    count += searchStrings.length;
    
    // Names only
    count += searchNames.length;
    
    return count;
  };

  const copyUrlsToClipboard = async () => {
    if (allSearchUrls.length > 0) {
      try {
        await navigator.clipboard.writeText(allSearchUrls.join('\n'));
        toast({
          title: "URLs copied to clipboard",
          description: `Copied ${allSearchUrls.length} search URLs to clipboard.`
        });
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Failed to copy URLs to clipboard.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-neo">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-blue-500 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Google Searches Opened
          </h2>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {getTotalSearchCount()}
          </div>
          <p className="text-gray-600">
            Google search tabs opened automatically
          </p>
        </div>

        <div className="mb-6">
          <Button
            onClick={copyUrlsToClipboard}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <Copy className="w-4 h-4" />
            Copy All URLs
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Search Strings Used</h3>
            <div className="text-sm text-gray-600 space-y-1">
              {searchStrings.map((string, index) => (
                <div key={index} className="bg-white rounded-lg p-2">
                  {string}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Names Used</h3>
            <div className="text-sm text-gray-600 space-y-1">
              {searchNames.length > 0 ? (
                searchNames.map((name, index) => (
                  <div key={index} className="bg-white rounded-lg p-2">
                    {name}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 italic">No names added</div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center justify-center text-blue-700">
            <ExternalLink className="w-4 h-4 mr-2" />
            <span className="text-sm">
              All search combinations have been opened in new browser tabs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
