
import React from 'react';
import SingleNameInput from './SingleNameInput';
import BulkNameInput from './BulkNameInput';
import AddedNamesDisplay from './AddedNamesDisplay';

interface SearchNamesSectionProps {
  currentName: string;
  setCurrentName: (name: string) => void;
  onAddName: () => void;
  bulkNames: string;
  setBulkNames: (names: string) => void;
  onAddBulkNames: () => void;
  searchNames: string[];
  onRemoveName: (index: number) => void;
  onCopyNames: () => void;
  onClearAll: () => void;
}

const SearchNamesSection = ({
  currentName,
  setCurrentName,
  onAddName,
  bulkNames,
  setBulkNames,
  onAddBulkNames,
  searchNames,
  onRemoveName,
  onCopyNames,
  onClearAll
}: SearchNamesSectionProps) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-neo">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Search Names</h2>
      
      <div className="space-y-6">
        <SingleNameInput
          currentName={currentName}
          setCurrentName={setCurrentName}
          onAddName={onAddName}
        />

        <BulkNameInput
          bulkNames={bulkNames}
          setBulkNames={setBulkNames}
          onAddBulkNames={onAddBulkNames}
        />
        
        <AddedNamesDisplay
          searchNames={searchNames}
          onRemoveName={onRemoveName}
          onCopyNames={onCopyNames}
          onClearAll={onClearAll}
        />
      </div>
    </div>
  );
};

export default SearchNamesSection;
