
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
      <Button
        onClick={onSearch}
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
  );
};

export default SearchButton;
