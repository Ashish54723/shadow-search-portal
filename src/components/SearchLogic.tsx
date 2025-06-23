
import { useAdminSearchStrings } from '@/hooks/useAdminSearchStrings';
import { useSearchNames } from '@/hooks/useSearchNames';
import { useSearchExecution } from '@/hooks/useSearchExecution';

export const useSearchLogic = () => {
  const {
    adminStrings,
    fetchAdminSearchStrings,
    getAllSearchStrings
  } = useAdminSearchStrings();

  const {
    searchNames,
    setSearchNames,
    currentName,
    setCurrentName,
    bulkNames,
    setBulkNames,
    addSearchName,
    addBulkNames,
    removeSearchName,
    clearAllNames,
    copyNamesToClipboard
  } = useSearchNames();

  const {
    isSearching,
    searchResults,
    performSearch: executeSearch
  } = useSearchExecution();

  const performSearch = async () => {
    const allSearchStrings = getAllSearchStrings();
    await executeSearch(
      searchNames,
      setSearchNames,
      currentName,
      setCurrentName,
      bulkNames,
      setBulkNames,
      allSearchStrings,
      adminStrings
    );
  };

  return {
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
  };
};
