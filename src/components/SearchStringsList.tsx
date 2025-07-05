
import React from 'react';
import SearchStringCard from './SearchStringCard';

interface SearchString {
  id: string;
  string_value: string;
  translations: Record<string, string>;
  is_active: boolean;
}

interface SearchStringsListProps {
  searchStrings: SearchString[];
  availableLanguages: Array<{ code: string; name: string }>;
  onUpdate: () => void;
}

const SearchStringsList = ({ searchStrings, availableLanguages, onUpdate }: SearchStringsListProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-700">Search Strings</h2>
      {searchStrings.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No search strings added yet.</p>
      ) : (
        <div className="space-y-4">
          {searchStrings.map(searchString => (
            <SearchStringCard
              key={searchString.id}
              searchString={searchString}
              availableLanguages={availableLanguages}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchStringsList;
