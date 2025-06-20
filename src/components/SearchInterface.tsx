
import React, { useEffect } from 'react';
import SearchResults from './SearchResults';
import AdminSearchStringsDisplay from './AdminSearchStringsDisplay';
import SearchNamesSection from './SearchNamesSection';
import SearchButton from './SearchButton';
import { useSearchLogic } from './SearchLogic';

const SearchInterface = () => {
  const {
    searchNames,
    currentName,
    setCurrentName,
    bulkNames,
    setBulkNames,
    isSearching,
    searchResults,
    adminStrings,
    fetchAdminSearchStrings,
    addSearchName,
    addBulkNames,
    removeSearchName,
    clearAllNames,
    copyNamesToClipboard,
    performSearch
  } = useSearchLogic();

  useEffect(() => {
    fetchAdminSearchStrings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <AdminSearchStringsDisplay adminStrings={adminStrings} />

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
