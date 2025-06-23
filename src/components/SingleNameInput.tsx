
import React from 'react';
import { Input } from '@/components/ui/input';

interface SingleNameInputProps {
  currentName: string;
  setCurrentName: (name: string) => void;
  onAddName: () => void;
}

const SingleNameInput = ({ currentName, setCurrentName }: SingleNameInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Just prevent default, the name will be auto-added when searching
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Add Single Name</label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Enter person/entity name (will be added automatically when searching)"
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="rounded-2xl border-0 bg-gray-50 dark:bg-gray-700 shadow-neo-inset focus:shadow-neo-inset-focus transition-all duration-200 dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default SingleNameInput;
