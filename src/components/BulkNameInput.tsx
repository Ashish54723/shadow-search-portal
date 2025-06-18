
import React from 'react';
import { Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface BulkNameInputProps {
  bulkNames: string;
  setBulkNames: (names: string) => void;
  onAddBulkNames: () => void;
}

const BulkNameInput = ({ bulkNames, setBulkNames, onAddBulkNames }: BulkNameInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Add Multiple Names (Bulk)</label>
      <div className="space-y-2">
        <Textarea
          placeholder="Paste multiple names here (one per line, or separated by commas/semicolons)&#10;Example:&#10;John Doe&#10;Jane Smith&#10;Company ABC"
          value={bulkNames}
          onChange={(e) => setBulkNames(e.target.value)}
          className="min-h-[120px] rounded-2xl border-0 bg-gray-50 shadow-neo-inset focus:shadow-neo-inset-focus transition-all duration-200 resize-none"
        />
        <div className="flex gap-2">
          <Button
            onClick={onAddBulkNames}
            disabled={!bulkNames.trim()}
            className="rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
          >
            <Clipboard className="w-4 h-4 mr-2" />
            Add Names
          </Button>
          <Button
            onClick={() => setBulkNames('')}
            variant="outline"
            disabled={!bulkNames.trim()}
            className="rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkNameInput;
