import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Plus, AlertCircle } from 'lucide-react';

interface SearchString {
  id: string;
  string_value: string;
  translations: Record<string, string>;
  is_active: boolean;
}

interface SearchStringCardProps {
  searchString: SearchString;
  availableLanguages: Array<{ code: string; name: string }>;
  onUpdate: () => void;
}

const SearchStringCard = ({ searchString, availableLanguages, onUpdate }: SearchStringCardProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [translationText, setTranslationText] = useState('');

  const addTranslation = async () => {
    if (!selectedLanguage || !translationText.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a language and enter translation text.",
        variant: "destructive"
      });
      return;
    }

    try {
      const originalText = searchString.string_value;
      let processedTranslation = translationText.trim();
      
      const originalHasOperators = /\b(AND|OR|NOT)\b/i.test(originalText);
      const translationHasOperators = /\b(AND|OR|NOT)\b/i.test(processedTranslation);
      
      if (originalHasOperators && !translationHasOperators) {
        toast({
          title: "Warning",
          description: "Original string contains search operators. Make sure to include equivalent operators in your translation.",
          variant: "destructive"
        });
        return;
      }

      const updatedTranslations = {
        ...searchString.translations,
        [selectedLanguage]: processedTranslation
      };

      const { error } = await supabase
        .from('search_strings')
        .update({ translations: updatedTranslations })
        .eq('id', searchString.id);

      if (error) throw error;

      setSelectedLanguage('');
      setTranslationText('');
      onUpdate();
      toast({
        title: "Translation added",
        description: `Translation added in ${availableLanguages.find(l => l.code === selectedLanguage)?.name}.`
      });
    } catch (error) {
      console.error('Error adding translation:', error);
      toast({
        title: "Error",
        description: "Failed to add translation.",
        variant: "destructive"
      });
    }
  };

  const removeTranslation = async (languageCode: string) => {
    try {
      const updatedTranslations = { ...searchString.translations };
      delete updatedTranslations[languageCode];

      const { error } = await supabase
        .from('search_strings')
        .update({ translations: updatedTranslations })
        .eq('id', searchString.id);

      if (error) throw error;

      onUpdate();
      toast({
        title: "Translation removed",
        description: "Translation has been removed successfully."
      });
    } catch (error) {
      console.error('Error removing translation:', error);
      toast({
        title: "Error",
        description: "Failed to remove translation.",
        variant: "destructive"
      });
    }
  };

  const deleteSearchString = async () => {
    try {
      const { error } = await supabase
        .from('search_strings')
        .delete()
        .eq('id', searchString.id);

      if (error) throw error;

      onUpdate();
      toast({
        title: "Search string deleted",
        description: "The search string has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting search string:', error);
      toast({
        title: "Error",
        description: "Failed to delete search string.",
        variant: "destructive"
      });
    }
  };

  const hasOperators = /\b(AND|OR|NOT)\b/i.test(searchString.string_value);
  
  return (
    <div className="border rounded-lg p-6 bg-gray-50">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-medium text-gray-800">
              {searchString.string_value}
            </h3>
            {hasOperators && (
              <div className="relative group">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <div className="absolute left-0 top-6 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  Contains search operators
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Original string in English
            {hasOperators && <span className="text-amber-600"> (contains search operators)</span>}
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={deleteSearchString}
          style={{ animation: 'float 8s ease-in-out infinite' }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Existing Translations */}
      {Object.keys(searchString.translations).length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Translations:</h4>
          <div className="space-y-2">
            {Object.entries(searchString.translations).map(([langCode, translation]) => (
              <div key={langCode} className="flex justify-between items-center bg-white p-3 rounded border">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">
                      {availableLanguages.find(l => l.code === langCode)?.name || langCode}:
                    </span>
                    {/\b(AND|OR|NOT)\b/i.test(translation) && (
                      <div className="relative group">
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                        <div className="absolute left-0 top-4 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Contains search operators
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-gray-600">{translation}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTranslation(langCode)}
                  style={{ animation: 'float 8s ease-in-out infinite' }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Translation */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Add Translation:</h4>
        {hasOperators && (
          <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            This string contains search operators (AND, OR, NOT). Make sure to preserve them in your translation.
          </div>
        )}
        <div className="flex gap-3">
          <div className="flex-1">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages
                  .filter(lang => !searchString.translations[lang.code])
                  .map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-2">
            <Input
              value={translationText}
              onChange={(e) => setTranslationText(e.target.value)}
              placeholder="Enter translation..."
              onKeyDown={(e) => e.key === 'Enter' && addTranslation()}
            />
          </div>
          <Button 
            onClick={addTranslation}
            disabled={!selectedLanguage || !translationText.trim()}
            size="sm"
            style={{ animation: 'float 8s ease-in-out infinite' }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchStringCard;
