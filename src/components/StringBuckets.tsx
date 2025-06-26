
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Plus, Package } from 'lucide-react';

interface StringBucket {
  id: string;
  bucket_name: string;
  string_ids: string[];
  created_at: string;
  updated_at: string;
}

interface SearchString {
  id: string;
  string_value: string;
  translations: Record<string, string>;
  is_active: boolean;
}

interface StringBucketsProps {
  availableStrings: SearchString[];
  selectedBuckets: string[];
  onBucketSelectionChange: (buckets: string[]) => void;
}

const StringBuckets = ({ availableStrings, selectedBuckets, onBucketSelectionChange }: StringBucketsProps) => {
  const [buckets, setBuckets] = useState<StringBucket[]>([]);
  const [newBucketName, setNewBucketName] = useState('');
  const [selectedStringsForNewBucket, setSelectedStringsForNewBucket] = useState<string[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchBuckets();
  }, []);

  const fetchBuckets = async () => {
    try {
      const { data, error } = await supabase
        .from('string_buckets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBuckets(data || []);
    } catch (error) {
      console.error('Error fetching buckets:', error);
    }
  };

  const createBucket = async () => {
    if (!newBucketName.trim() || selectedStringsForNewBucket.length === 0) {
      toast({
        title: "Missing information",
        description: "Please enter bucket name and select at least one string.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('string_buckets')
        .insert([{
          bucket_name: newBucketName.trim(),
          string_ids: selectedStringsForNewBucket
        }]);

      if (error) throw error;

      setNewBucketName('');
      setSelectedStringsForNewBucket([]);
      setShowCreateForm(false);
      fetchBuckets();
      
      toast({
        title: "Bucket created",
        description: `Bucket "${newBucketName}" created with ${selectedStringsForNewBucket.length} strings.`
      });
    } catch (error) {
      console.error('Error creating bucket:', error);
      toast({
        title: "Error",
        description: "Failed to create bucket.",
        variant: "destructive"
      });
    }
  };

  const deleteBucket = async (bucketId: string) => {
    try {
      const { error } = await supabase
        .from('string_buckets')
        .delete()
        .eq('id', bucketId);

      if (error) throw error;

      // Remove from selected buckets if it was selected
      const updatedSelection = selectedBuckets.filter(id => id !== bucketId);
      onBucketSelectionChange(updatedSelection);
      
      fetchBuckets();
      toast({
        title: "Bucket deleted",
        description: "The bucket has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting bucket:', error);
      toast({
        title: "Error",
        description: "Failed to delete bucket.",
        variant: "destructive"
      });
    }
  };

  const handleBucketSelection = (bucketId: string, checked: boolean) => {
    let updatedSelection;
    if (checked) {
      updatedSelection = [...selectedBuckets, bucketId];
    } else {
      updatedSelection = selectedBuckets.filter(id => id !== bucketId);
    }
    onBucketSelectionChange(updatedSelection);
  };

  const getStringsByIds = (stringIds: string[]) => {
    return availableStrings.filter(str => stringIds.includes(str.id));
  };

  const handleStringSelectionForNewBucket = (stringId: string, checked: boolean) => {
    if (checked) {
      setSelectedStringsForNewBucket([...selectedStringsForNewBucket, stringId]);
    } else {
      setSelectedStringsForNewBucket(prev => prev.filter(id => id !== stringId));
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-neo">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Package className="w-6 h-6 text-blue-500 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-800">String Buckets</h2>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
          style={{ animation: 'float 8s ease-in-out infinite' }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Bucket
        </Button>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-4 bg-blue-50 rounded-2xl border">
          <h3 className="font-semibold text-gray-800 mb-4">Create New Bucket</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bucket Name
              </label>
              <Input
                value={newBucketName}
                onChange={(e) => setNewBucketName(e.target.value)}
                placeholder="Enter bucket name (e.g., 'Team A Strings', 'Legal Research')"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Strings for this Bucket
              </label>
              <div className="max-h-40 overflow-y-auto space-y-2 border rounded p-3 bg-white">
                {availableStrings.map(string => (
                  <div key={string.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedStringsForNewBucket.includes(string.id)}
                      onCheckedChange={(checked) => 
                        handleStringSelectionForNewBucket(string.id, checked as boolean)
                      }
                    />
                    <span className="text-sm text-gray-700">{string.string_value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={createBucket}
                disabled={!newBucketName.trim() || selectedStringsForNewBucket.length === 0}
                style={{ animation: 'float 8s ease-in-out infinite' }}
              >
                Create Bucket
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewBucketName('');
                  setSelectedStringsForNewBucket([]);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Available Buckets</h3>
        
        {buckets.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No buckets created yet. Create your first bucket to organize search strings.
          </p>
        ) : (
          <div className="space-y-3">
            {buckets.map(bucket => {
              const bucketStrings = getStringsByIds(bucket.string_ids);
              return (
                <div key={bucket.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Checkbox
                        checked={selectedBuckets.includes(bucket.id)}
                        onCheckedChange={(checked) => 
                          handleBucketSelection(bucket.id, checked as boolean)
                        }
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-2">
                          {bucket.bucket_name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {bucketStrings.length} strings in this bucket
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {bucketStrings.map(string => (
                            <span
                              key={string.id}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs"
                            >
                              {string.string_value}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteBucket(bucket.id)}
                      style={{ animation: 'float 8s ease-in-out infinite' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedBuckets.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 rounded-xl">
          <h4 className="font-medium text-green-800 mb-2">
            Selected Buckets ({selectedBuckets.length})
          </h4>
          <p className="text-sm text-green-700">
            These buckets will be used for your search operations.
          </p>
        </div>
      )}
    </div>
  );
};

export default StringBuckets;
