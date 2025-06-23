
import React from 'react';
import { X, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddedNamesDisplayProps {
  searchNames: string[];
  onRemoveName: (index: number) => void;
  onCopyNames: () => void;
  onClearAll: () => void;
}

const AddedNamesDisplay = ({ searchNames, onRemoveName, onCopyNames, onClearAll }: AddedNamesDisplayProps) => {
  if (searchNames.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Added Names ({searchNames.length})</label>
        <div className="flex gap-2">
          <Button
            onClick={onCopyNames}
            variant="outline"
            size="sm"
            className="rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy All
          </Button>
          <Button
            onClick={onClearAll}
            variant="outline"
            size="sm"
            className="rounded-xl shadow-neo-small hover:shadow-neo-small-hover text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-neo-inset transition-colors duration-300">
        {searchNames.map((name, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-2xl shadow-neo-small transition-colors duration-300"
          >
            <span className="text-sm font-medium">{name}</span>
            <button
              onClick={() => onRemoveName(index)}
              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddedNamesDisplay;
