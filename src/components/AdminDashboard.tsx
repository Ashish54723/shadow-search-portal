
import React, { useState, useEffect } from 'react';
import { Plus, X, Edit2, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SearchString {
  id: string;
  string_value: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const [searchStrings, setSearchStrings] = useState<SearchString[]>([]);
  const [newString, setNewString] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      setSearchStrings(data || []);
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
        .insert([{ string_value: newString.trim() }])
        .select()
        .single();

      if (error) throw error;

      setSearchStrings([data, ...searchStrings]);
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

  const updateSearchString = async (id: string, newValue: string) => {
    try {
      const { error } = await supabase
        .from('search_strings')
        .update({ 
          string_value: newValue.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setSearchStrings(searchStrings.map(str => 
        str.id === id 
          ? { ...str, string_value: newValue.trim(), updated_at: new Date().toISOString() }
          : str
      ));
      setEditingId(null);
      setEditingValue('');
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

  const startEditing = (id: string, value: string) => {
    setEditingId(id);
    setEditingValue(value);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingValue('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-neo">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Manage search strings that will be automatically combined with user-entered names in searches.
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
                  className={`flex items-center gap-4 p-4 rounded-2xl shadow-neo-small ${
                    string.is_active ? 'bg-green-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex-1">
                    {editingId === string.id ? (
                      <Input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            updateSearchString(string.id, editingValue);
                          } else if (e.key === 'Escape') {
                            cancelEditing();
                          }
                        }}
                        className="rounded-xl border-0 bg-white shadow-neo-inset"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-3">
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
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {editingId === string.id ? (
                      <>
                        <Button
                          onClick={() => updateSearchString(string.id, editingValue)}
                          size="sm"
                          className="rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={cancelEditing}
                          variant="outline"
                          size="sm"
                          className="rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => startEditing(string.id, string.string_value)}
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
                      </>
                    )}
                  </div>
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
