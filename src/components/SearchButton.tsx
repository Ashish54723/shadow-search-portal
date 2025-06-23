
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
        className="px-16 py-6 text-xl font-semibold bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-700 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500"
      >
        {isSearching ? (
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            Searching...
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6" />
            Search Negative Media
          </div>
        )}
      </Button>
    </div>
  );
};

export default SearchButton;
