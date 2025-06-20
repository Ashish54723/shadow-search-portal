
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchResultsProps {
  searchStrings: string[];
  searchNames: string[];
}

const SearchResults = ({ searchStrings, searchNames }: SearchResultsProps) => {
  const createGoogleSearchUrl = (query: string) => {
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  const createCombinedSearchUrl = (searchString: string, names: string[]) => {
    const combinedQuery = names.length > 0 
      ? `${searchString} (${names.join(' OR ')})`
      : searchString;
    return createGoogleSearchUrl(combinedQuery);
  };

  // Auto-open the first combined search when results are ready
  useEffect(() => {
    if (searchStrings.length > 0) {
      const firstSearchString = searchStrings[0];
      const autoSearchUrl = createCombinedSearchUrl(firstSearchString, searchNames);
      window.open(autoSearchUrl, '_blank');
    }
  }, [searchStrings, searchNames]);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-neo">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Google Search Results
      </h2>
      
      <Tabs defaultValue="combined" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="combined">Combined Search</TabsTrigger>
          <TabsTrigger value="strings">Search Strings</TabsTrigger>
          <TabsTrigger value="names">Names Only</TabsTrigger>
          <TabsTrigger value="individual">Individual</TabsTrigger>
        </TabsList>

        <TabsContent value="combined" className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Combined Search</h3>
            <p className="text-gray-600 mb-4">Search all strings combined with all names</p>
            {searchStrings.map((searchString, index) => {
              const combinedQuery = searchNames.length > 0 
                ? `${searchString} (${searchNames.join(' OR ')})`
                : searchString;
              return (
                <div key={index} className="mb-4 p-4 bg-white rounded-xl border">
                  <p className="text-sm text-gray-600 mb-2">
                    Query: {combinedQuery}
                  </p>
                  <Button
                    onClick={() => window.open(createCombinedSearchUrl(searchString, searchNames), '_blank')}
                    className="w-full rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search on Google
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="strings" className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Strings Only</h3>
            <p className="text-gray-600 mb-4">Search each string individually</p>
            {searchStrings.map((searchString, index) => (
              <div key={index} className="mb-4 p-4 bg-white rounded-xl border">
                <p className="text-sm text-gray-600 mb-2">Query: {searchString}</p>
                <Button
                  onClick={() => window.open(createGoogleSearchUrl(searchString), '_blank')}
                  className="w-full rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search on Google
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="names" className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Names Only</h3>
            <p className="text-gray-600 mb-4">Search each name individually</p>
            {searchNames.map((name, index) => (
              <div key={index} className="mb-4 p-4 bg-white rounded-xl border">
                <p className="text-sm text-gray-600 mb-2">Query: {name}</p>
                <Button
                  onClick={() => window.open(createGoogleSearchUrl(name), '_blank')}
                  className="w-full rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search on Google
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="individual" className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Individual Combinations</h3>
            <p className="text-gray-600 mb-4">Each string combined with each name</p>
            {searchStrings.map((searchString, stringIndex) => (
              <div key={stringIndex} className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">String: {searchString}</h4>
                {searchNames.length > 0 ? (
                  searchNames.map((name, nameIndex) => (
                    <div key={nameIndex} className="mb-3 p-4 bg-white rounded-xl border">
                      <p className="text-sm text-gray-600 mb-2">
                        Query: {searchString} {name}
                      </p>
                      <Button
                        onClick={() => window.open(createGoogleSearchUrl(`${searchString} ${name}`), '_blank')}
                        className="w-full rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Search on Google
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-white rounded-xl border">
                    <p className="text-sm text-gray-600 mb-2">
                      Query: {searchString}
                    </p>
                    <Button
                      onClick={() => window.open(createGoogleSearchUrl(searchString), '_blank')}
                      className="w-full rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search on Google
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchResults;
