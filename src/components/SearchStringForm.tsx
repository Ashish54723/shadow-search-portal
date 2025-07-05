
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle } from 'lucide-react';

interface SearchStringFormProps {
  onStringAdded: () => void;
}

const SearchStringForm = ({ onStringAdded }: SearchStringFormProps) => {
  const [newString, setNewString] = useState('');

  const addSearchString = async () => {
    if (!newString.trim()) return;

    const hasOperators = /\b(AND|OR|NOT)\b/i.test(newString.trim());
    
    try {
      const { error } = await supabase
        .from('search_strings')
        .insert([{ string_value: newString.trim() }]);

      if (error) throw error;

      setNewString('');
      onStringAdded();
      
      if (hasOperators) {
        toast({
          title: "Search string added",
          description: "Note: Search operators (AND, OR, NOT) will be preserved during translation.",
        });
      } else {
        toast({
          title: "Search string added",
          description: "The search string has been added successfully."
        });
      }
    } catch (error) {
      console.error('Error adding search string:', error);
      toast({
        title: "Error",
        description: "Failed to add search string.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-xl font-semibold text-gray-700">Add New Search String</h2>
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Search Operator Guidelines:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use AND, OR, NOT for boolean operations</li>
          <li>• Use quotes for exact phrases: "exact phrase"</li>
          <li>• These operators will be preserved during translation</li>
          <li>• Example: "negative news" AND (scandal OR controversy)</li>
        </ul>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="newString">Search String</Label>
          <Input
            id="newString"
            value={newString}
            onChange={(e) => setNewString(e.target.value)}
            placeholder="Enter search string with operators..."
            onKeyDown={(e) => e.key === 'Enter' && addSearchString()}
          />
        </div>
        <div className="flex items-end">
          <Button 
            onClick={addSearchString} 
            disabled={!newString.trim()}
            style={{ animation: 'float 8s ease-in-out infinite' }}
          >
            Add String
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchStringForm;
