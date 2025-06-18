
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SingleNameInputProps {
  currentName: string;
  setCurrentName: (name: string) => void;
  onAddName: () => void;
}

const SingleNameInput = ({ currentName, setCurrentName, onAddName }: SingleNameInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddName();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Add Single Name</label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Enter person/entity name and press Enter or click +"
            value={currentName}
            onChange={(e) => setCurrentName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pr-12 rounded-2xl border-0 bg-gray-50 shadow-neo-inset focus:shadow-neo-inset-focus transition-all duration-200"
          />
          <Button
            onClick={onAddName}
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SingleNameInput;
