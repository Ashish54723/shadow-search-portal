
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchButtonProps {
  onSearch: () => void;
  isSearching: boolean;
}

const SearchButton = ({ onSearch, isSearching }: SearchButtonProps) => {
  return (
    <div className="text-center">
      <div className="floating-element">
        <Button
          onClick={onSearch}
          disabled={isSearching}
          size="lg"
          className="px-20 py-8 text-2xl font-bold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 hover:from-emerald-500 hover:via-blue-600 hover:to-purple-700 dark:from-emerald-500 dark:via-blue-600 dark:to-purple-700 dark:hover:from-emerald-600 dark:hover:via-blue-700 dark:hover:to-purple-800 shadow-3xl hover:shadow-4xl transform hover:-translate-y-3 transition-all duration-700 backdrop-blur-xl border-0"
        >
          {isSearching ? (
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
                Searching...
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Search className="w-8 h-8 drop-shadow-lg" />
              <span className="bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent drop-shadow-lg">
                Search Negative Media
              </span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SearchButton;
