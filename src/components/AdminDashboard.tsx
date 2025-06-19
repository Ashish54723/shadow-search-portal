import React, { useState, useEffect } from 'react';
import { Plus, X, Edit2, Save, Trash2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SearchString {
  id: string;
  string_value: string;
  translations: Record<string, string>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const [searchStrings, setSearchStrings] = useState<SearchString[]>([]);
  const [newString, setNewString] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [editingTranslations, setEditingTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [newTranslationLang, setNewTranslationLang] = useState('');
  const [newTranslationValue, setNewTranslationValue] = useState('');

  const commonLanguages = ['es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar'];

  useEffect(() => {
    fetchSearchStrings();
  }, []);

  const fetchSearchStrings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('search_strings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Parse translations JSON if it exists
      const processedData = data?.map(item => ({
        ...item,
        translations: item.translations || {}
      })) || [];
      
      setSearchStrings(processedData);
    } catch (error) {
      console.error('Error fetching search strings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch search strings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSearchString = async () => {
    if (!newString.trim()) return;

    try {
      const { data, error } = await supabase
        .from('search_strings')
        .insert([{ 
          string_value: newString.trim(),
          translations: {}
        }])
        .select()
        .single();

      if (error) throw error;

      setSearchStrings([{ ...data, translations: {} }, ...searchStrings]);
      setNewString('');
      toast({
        title: "Success",
        description: "Search string added successfully"
      });
    } catch (error) {
      console.error('Error adding search string:', error);
      toast({
        title: "Error",
        description: "Failed to add search string",
        variant: "destructive"
      });
    }
  };

  const updateSearchString = async (id: string, newValue: string, translations: Record<string, string>) => {
    try {
      const { error } = await supabase
        .from('search_strings')
        .update({ 
          string_value: newValue.trim(),
          translations: translations,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setSearchStrings(searchStrings.map(str => 
        str.id === id 
          ? { ...str, string_value: newValue.trim(), translations, updated_at: new Date().toISOString() }
          : str
      ));
      setEditingId(null);
      setEditingValue('');
      setEditingTranslations({});
      toast({
        title: "Success",
        description: "Search string updated successfully"
      });
    } catch (error) {
      console.error('Error updating search string:', error);
      toast({
        title: "Error",
        description: "Failed to update search string",
        variant: "destructive"
      });
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('search_strings')
        .update({ 
          is_active: !currentActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setSearchStrings(searchStrings.map(str => 
        str.id === id 
          ? { ...str, is_active: !currentActive, updated_at: new Date().toISOString() }
          : str
      ));
      toast({
        title: "Success",
        description: `Search string ${!currentActive ? 'activated' : 'deactivated'}`
      });
    } catch (error) {
      console.error('Error toggling search string:', error);
      toast({
        title: "Error",
        description: "Failed to update search string",
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

      setSearchStrings(searchStrings.filter(str => str.id !== id));
      toast({
        title: "Success",
        description: "Search string deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting search string:', error);
      toast({
        title: "Error",
        description: "Failed to delete search string",
        variant: "destructive"
      });
    }
  };

  const startEditing = (id: string, value: string, translations: Record<string, string>) => {
    setEditingId(id);
    setEditingValue(value);
    setEditingTranslations({ ...translations });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingValue('');
    setEditingTranslations({});
  };

  const addTranslation = () => {
    if (newTranslationLang.trim() && newTranslationValue.trim()) {
      setEditingTranslations({
        ...editingTranslations,
        [newTranslationLang.toLowerCase()]: newTranslationValue.trim()
      });
      setNewTranslationLang('');
      setNewTranslationValue('');
    }
  };

  const removeTranslation = (lang: string) => {
    const updatedTranslations = { ...editingTranslations };
    delete updatedTranslations[lang];
    setEditingTranslations(updatedTranslations);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-neo">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Manage search strings with translations that will be automatically combined with user-entered names in searches.
        </p>

        {/* Add New String */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Search String</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter search string..."
                value={newString}
                onChange={(e) => setNewString(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSearchString()}
                className="rounded-2xl border-0 bg-gray-50 shadow-neo-inset focus:shadow-neo-inset-focus"
              />
            </div>
            <Button
              onClick={addSearchString}
              disabled={!newString.trim()}
              className="rounded-xl shadow-neo hover:shadow-neo-hover px-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add String
            </Button>
          </div>
        </div>

        {/* Search Strings List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Search Strings ({searchStrings.length})
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : searchStrings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No search strings added yet. Add your first one above.
            </div>
          ) : (
            <div className="space-y-4">
              {searchStrings.map((string) => (
                <div
                  key={string.id}
                  className={`p-4 rounded-2xl shadow-neo-small ${
                    string.is_active ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  {editingId === string.id ? (
                    <div className="space-y-4">
                      <Input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        placeholder="Original string"
                        className="rounded-xl border-0 bg-white shadow-neo-inset"
                        autoFocus
                      />
                      
                      {/* Existing Translations */}
                      {Object.entries(editingTranslations).length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">Translations:</h4>
                          {Object.entries(editingTranslations).map(([lang, translation]) => (
                            <div key={lang} className="flex items-center gap-2">
                              <span className="text-xs bg-gray-200 px-2 py-1 rounded">{lang.toUpperCase()}</span>
                              <Input
                                type="text"
                                value={translation}
                                onChange={(e) => setEditingTranslations({
                                  ...editingTranslations,
                                  [lang]: e.target.value
                                })}
                                className="flex-1 rounded-xl border-0 bg-white shadow-neo-inset"
                              />
                              <Button
                                onClick={() => removeTranslation(lang)}
                                variant="outline"
                                size="sm"
                                className="rounded-xl"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Add New Translation */}
                      <div className="flex gap-2">
                        <select
                          value={newTranslationLang}
                          onChange={(e) => setNewTranslationLang(e.target.value)}
                          className="px-3 py-2 rounded-xl border-0 bg-white shadow-neo-inset"
                        >
                          <option value="">Select language</option>
                          {commonLanguages.map(lang => (
                            <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                          ))}
                        </select>
                        <Input
                          type="text"
                          placeholder="Translation"
                          value={newTranslationValue}
                          onChange={(e) => setNewTranslationValue(e.target.value)}
                          className="flex-1 rounded-xl border-0 bg-white shadow-neo-inset"
                        />
                        <Button
                          onClick={addTranslation}
                          disabled={!newTranslationLang || !newTranslationValue.trim()}
                          size="sm"
                          className="rounded-xl"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => updateSearchString(string.id, editingValue, editingTranslations)}
                          className="rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={cancelEditing}
                          variant="outline"
                          className="rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-sm font-medium ${
                            string.is_active ? 'text-gray-800' : 'text-gray-500'
                          }`}>
                            {string.string_value}
                          </span>
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            string.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {string.is_active ? 'Active' : 'Inactive'}
                          </span>
                          {Object.keys(string.translations || {}).length > 0 && (
                            <span className="flex items-center gap-1 text-xs text-blue-600">
                              <Globe className="w-3 h-3" />
                              {Object.keys(string.translations).length} translations
                            </span>
                          )}
                        </div>
                        
                        {string.translations && Object.keys(string.translations).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {Object.entries(string.translations).map(([lang, translation]) => (
                              <span
                                key={lang}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                              >
                                {lang.toUpperCase()}: {translation}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          onClick={() => startEditing(string.id, string.string_value, string.translations || {})}
                          variant="outline"
                          size="sm"
                          className="rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => toggleActive(string.id, string.is_active)}
                          variant={string.is_active ? "outline" : "default"}
                          size="sm"
                          className="rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
                        >
                          {string.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          onClick={() => deleteSearchString(string.id)}
                          variant="destructive"
                          size="sm"
                          className="rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
