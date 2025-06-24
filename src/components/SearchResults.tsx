
import React, { useEffect, useState } from 'react';
import { ExternalLink, Search, Copy, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from '@/hooks/use-toast';

interface SearchResultsProps {
  searchStrings: string[];
  searchNames: string[];
}

const SearchResults = ({ searchStrings, searchNames }: SearchResultsProps) => {
  const [allSearchUrls, setAllSearchUrls] = useState<string[]>([]);
  const [isGeneratingPDFs, setIsGeneratingPDFs] = useState(false);

  const createGoogleSearchUrl = (query: string) => {
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  const createCombinedSearchUrl = (searchString: string, names: string[]) => {
    const combinedQuery = names.length > 0 
      ? `${searchString} (${names.join(' OR ')})`
      : searchString;
    return createGoogleSearchUrl(combinedQuery);
  };

  // Auto-open search combinations when results are ready
  useEffect(() => {
    if (searchStrings.length > 0) {
      const searchUrls: string[] = [];
      
      // Only combine names with search strings (no individual name combinations)
      searchStrings.forEach(searchString => {
        const combinedUrl = createCombinedSearchUrl(searchString, searchNames);
        searchUrls.push(combinedUrl);
      });
      
      // Strings only (if no names provided)
      if (searchNames.length === 0) {
        searchStrings.forEach(searchString => {
          const stringOnlyUrl = createGoogleSearchUrl(searchString);
          searchUrls.push(stringOnlyUrl);
        });
      }
      
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
    if (searchNames.length > 0) {
      // Only count combined searches (strings + names)
      return searchStrings.length;
    } else {
      // If no names, count individual strings
      return searchStrings.length;
    }
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

  const generatePDFsFromTabs = async () => {
    if (allSearchUrls.length === 0) {
      toast({
        title: "No URLs available",
        description: "Please perform a search first to generate PDFs.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPDFs(true);
    
    try {
      // Use the browser's print functionality to generate PDFs
      const printPromises = allSearchUrls.map((url, index) => {
        return new Promise<void>((resolve) => {
          // Open each URL in a new window for printing
          const printWindow = window.open(url, `search_${index}`, 'width=1200,height=800');
          
          if (printWindow) {
            printWindow.addEventListener('load', () => {
              setTimeout(() => {
                // Trigger print dialog for each window
                printWindow.print();
                resolve();
              }, 2000); // Wait for page to fully load
            });
          } else {
            resolve();
          }
        });
      });

      await Promise.all(printPromises);
      
      toast({
        title: "PDF generation initiated",
        description: `Print dialogs opened for ${allSearchUrls.length} search results. Use your browser's print-to-PDF option.`
      });
    } catch (error) {
      toast({
        title: "PDF generation failed",
        description: "Failed to generate PDFs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDFs(false);
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

        <div className="mb-6 flex gap-4 justify-center">
          <Button
            onClick={copyUrlsToClipboard}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy All URLs
          </Button>
          
          <Button
            onClick={generatePDFsFromTabs}
            disabled={isGeneratingPDFs}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            {isGeneratingPDFs ? 'Generating PDFs...' : 'Create PDFs'}
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
              {searchNames.length > 0 
                ? "Search strings combined with all names have been opened in new browser tabs"
                : "All search strings have been opened in new browser tabs"
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
