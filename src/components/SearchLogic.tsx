
import { useAdminSearchStrings } from '@/hooks/useAdminSearchStrings';
import { useSearchNames } from '@/hooks/useSearchNames';
import { useSearchExecution } from '@/hooks/useSearchExecution';
import { useStringBuckets } from '@/hooks/useStringBuckets';

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

  const {
    selectedBuckets,
    setSelectedBuckets,
    buckets,
    fetchBuckets,
    getSelectedBucketStrings
  } = useStringBuckets();

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
      getSelectedBucketStrings(adminStrings)
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
    selectedBuckets,
    setSelectedBuckets,
    buckets,
    fetchAdminSearchStrings,
    fetchBuckets,
    addSearchName,
    addBulkNames,
    removeSearchName,
    clearAllNames,
    copyNamesToClipboard,
    performSearch
  };
};
