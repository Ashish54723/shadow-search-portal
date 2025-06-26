
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Plus, AlertCircle } from 'lucide-react';
import { preserveSearchOperators, restoreSearchOperators, shouldTranslateString } from '@/utils/searchOperators';

interface SearchString {
  id: string;
  string_value: string;
  translations: Record<string, string>;
  is_active: boolean;
}

const AVAILABLE_LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' }
];

const AdminDashboard = () => {
  const [searchStrings, setSearchStrings] = useState<SearchString[]>([]);
  const [newString, setNewString] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [translationText, setTranslationText] = useState('');
  const [editingTranslations, setEditingTranslations] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchSearchStrings();
  }, []);

  const fetchSearchStrings = async () => {
    try {
      const { data, error } = await supabase
        .from('search_strings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Process the data to ensure translations is properly typed
      const processedData = data?.map(item => ({
        ...item,
        translations: (item.translations && typeof item.translations === 'object' && !Array.isArray(item.translations)) 
          ? item.translations as Record<string, string>
          : {}
      })) || [];
      
      setSearchStrings(processedData);
    } catch (error) {
      console.error('Error fetching search strings:', error);
    }
  };

  const addSearchString = async () => {
    if (!newString.trim()) return;

    // Check if the string contains search operators
    const hasOperators = /\b(AND|OR|NOT)\b/i.test(newString.trim());
    
    try {
      const { error } = await supabase
        .from('search_strings')
        .insert([{ string_value: newString.trim() }]);

      if (error) throw error;

      setNewString('');
      fetchSearchStrings();
      
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

  const addTranslation = async (stringId: string) => {
    if (!selectedLanguage || !translationText.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a language and enter translation text.",
        variant: "destructive"
      });
      return;
    }

    try {
      const searchString = searchStrings.find(s => s.id === stringId);
      if (!searchString) return;

      // Process the translation to preserve search operators
      const originalText = searchString.string_value;
      const { preservedText, tokens } = preserveSearchOperators(originalText);
      
      // For demonstration, we're using the user input as translation
      // In a real scenario, you might want to validate that operators are preserved
      let processedTranslation = translationText.trim();
      
      // Check if translation should preserve operators from original
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
        .eq('id', stringId);

      if (error) throw error;

      setSelectedLanguage('');
      setTranslationText('');
      fetchSearchStrings();
      toast({
        title: "Translation added",
        description: `Translation added in ${AVAILABLE_LANGUAGES.find(l => l.code === selectedLanguage)?.name}.`
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

  const removeTranslation = async (stringId: string, languageCode: string) => {
    try {
      const searchString = searchStrings.find(s => s.id === stringId);
      if (!searchString) return;

      const updatedTranslations = { ...searchString.translations };
      delete updatedTranslations[languageCode];

      const { error } = await supabase
        .from('search_strings')
        .update({ translations: updatedTranslations })
        .eq('id', stringId);

      if (error) throw error;

      fetchSearchStrings();
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

  const deleteSearchString = async (id: string) => {
    try {
      const { error } = await supabase
        .from('search_strings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchSearchStrings();
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

  const renderSearchStringCard = (searchString: SearchString) => {
    const hasOperators = /\b(AND|OR|NOT)\b/i.test(searchString.string_value);
    
    return (
      <div key={searchString.id} className="border rounded-lg p-6 bg-gray-50">
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
            onClick={() => deleteSearchString(searchString.id)}
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
                        {AVAILABLE_LANGUAGES.find(l => l.code === langCode)?.name || langCode}:
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
                    onClick={() => removeTranslation(searchString.id, langCode)}
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
                  {AVAILABLE_LANGUAGES
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
                onKeyDown={(e) => e.key === 'Enter' && addTranslation(searchString.id)}
              />
            </div>
            <Button 
              onClick={() => addTranslation(searchString.id)}
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-neo">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        {/* Add New Search String */}
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

        {/* Search Strings List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">Search Strings</h2>
          {searchStrings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No search strings added yet.</p>
          ) : (
            <div className="space-y-4">
              {searchStrings.map(renderSearchStringCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
