
import React, { useEffect } from 'react';
import SearchResults from './SearchResults';
import AdminSearchStringsDisplay from './AdminSearchStringsDisplay';
import SearchNamesSection from './SearchNamesSection';
import SearchButton from './SearchButton';
import StringBuckets from './StringBuckets';
import { useSearchLogic } from './SearchLogic';

interface SearchInterfaceProps {
  userId: string;
}

const SearchInterface = ({ userId }: SearchInterfaceProps) => {
  const {
    searchNames,
    currentName,
    setCurrentName,
    bulkNames,
    setBulkNames,
    isSearching,
    searchResults,
    adminStrings,
    selectedBuckets,
    setSelectedBuckets,
    fetchAdminSearchStrings,
    fetchBuckets,
    addSearchName,
    addBulkNames,
    removeSearchName,
    clearAllNames,
    copyNamesToClipboard,
    performSearch
  } = useSearchLogic(userId);

  useEffect(() => {
    fetchAdminSearchStrings();
    fetchBuckets();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <AdminSearchStringsDisplay adminStrings={adminStrings} />

      <StringBuckets
        availableStrings={adminStrings}
        selectedBuckets={selectedBuckets}
        onBucketSelectionChange={setSelectedBuckets}
        userId={userId}
      />

      <SearchNamesSection
        currentName={currentName}
        setCurrentName={setCurrentName}
        onAddName={addSearchName}
        bulkNames={bulkNames}
        setBulkNames={setBulkNames}
        onAddBulkNames={addBulkNames}
        searchNames={searchNames}
        onRemoveName={removeSearchName}
        onCopyNames={copyNamesToClipboard}
        onClearAll={clearAllNames}
      />

      <SearchButton onSearch={performSearch} isSearching={isSearching} />

      {searchResults && (
        <SearchResults 
          searchStrings={searchResults.searchStrings}
          searchNames={searchResults.searchNames}
        />
      )}
    </div>
  );
};

export default SearchInterface;
