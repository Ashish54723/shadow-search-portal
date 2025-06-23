
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export const useSearchNames = () => {
  const [searchNames, setSearchNames] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState('');
  const [bulkNames, setBulkNames] = useState('');

  const addSearchName = () => {
    if (currentName.trim() && !searchNames.includes(currentName.trim())) {
      setSearchNames([...searchNames, currentName.trim()]);
      setCurrentName('');
    }
  };

  const addBulkNames = () => {
    if (bulkNames.trim()) {
      const names = bulkNames
        .split(/[\n,;]+/)
        .map(name => name.trim())
        .filter(name => name && !searchNames.includes(name));
      
      if (names.length > 0) {
        setSearchNames([...searchNames, ...names]);
        setBulkNames('');
        toast({
          title: "Names added",
          description: `Added ${names.length} new names to your search list.`
        });
      }
    }
  };

  const removeSearchName = (index: number) => {
    setSearchNames(searchNames.filter((_, i) => i !== index));
  };

  const clearAllNames = () => {
    setSearchNames([]);
    toast({
      title: "Names cleared",
      description: "All search names have been removed."
    });
  };

  const copyNamesToClipboard = async () => {
    if (searchNames.length > 0) {
      try {
        await navigator.clipboard.writeText(searchNames.join('\n'));
        toast({
          title: "Copied to clipboard",
          description: `Copied ${searchNames.length} names to clipboard.`
        });
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Failed to copy names to clipboard.",
          variant: "destructive"
        });
      }
    }
  };

  return {
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
  };
};
