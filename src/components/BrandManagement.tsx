
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Building2, Edit3, Tag } from 'lucide-react';

interface Brand {
  id: string;
  name: string;
  industry: string | null;
  keywords: string[];
  risk_level: string;
  is_active: boolean;
  created_at: string;
}

interface BrandManagementProps {
  adminId: string;
}

const BrandManagement = ({ adminId }: BrandManagementProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [newBrand, setNewBrand] = useState({
    name: '',
    industry: '',
    keywords: '',
    risk_level: 'medium'
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const createBrand = async () => {
    if (!newBrand.name.trim()) {
      toast({
        title: "Brand name required",
        description: "Please enter a brand name.",
        variant: "destructive"
      });
      return;
    }

    try {
      const keywords = newBrand.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      const { error } = await supabase
        .from('brands')
        .insert([{
          name: newBrand.name.trim(),
          industry: newBrand.industry.trim() || null,
          keywords: keywords,
          risk_level: newBrand.risk_level,
          created_by: adminId
        }]);

      if (error) throw error;

      setNewBrand({ name: '', industry: '', keywords: '', risk_level: 'medium' });
      setShowCreateForm(false);
      fetchBrands();

      toast({
        title: "Brand created",
        description: `Brand "${newBrand.name}" has been created successfully.`
      });
    } catch (error: any) {
      console.error('Error creating brand:', error);
      toast({
        title: "Error",
        description: error.message?.includes('duplicate') 
          ? "Brand name already exists. Please choose a different name."
          : "Failed to create brand.",
        variant: "destructive"
      });
    }
  };

  const updateBrand = async () => {
    if (!editingBrand || !editingBrand.name.trim()) {
      toast({
        title: "Brand name required",
        description: "Please enter a brand name.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Ensure keywords is always treated as string[] - fix for line 114 error
      const keywordsArray = Array.isArray(editingBrand.keywords) 
        ? editingBrand.keywords 
        : (editingBrand.keywords as any as string).split(',').map(k => k.trim()).filter(k => k.length > 0);

      const { error } = await supabase
        .from('brands')
        .update({
          name: editingBrand.name.trim(),
          industry: editingBrand.industry?.trim() || null,
          keywords: keywordsArray,
          risk_level: editingBrand.risk_level,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingBrand.id);

      if (error) throw error;

      setEditingBrand(null);
      fetchBrands();

      toast({
        title: "Brand updated",
        description: `Brand "${editingBrand.name}" has been updated successfully.`
      });
    } catch (error: any) {
      console.error('Error updating brand:', error);
      toast({
        title: "Error",
        description: "Failed to update brand.",
        variant: "destructive"
      });
    }
  };

  const deleteBrand = async (brandId: string, brandName: string) => {
    if (!confirm(`Are you sure you want to delete brand "${brandName}"? This will also remove it from all associated search strings and history.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', brandId);

      if (error) throw error;

      fetchBrands();
      toast({
        title: "Brand deleted",
        description: `Brand "${brandName}" has been deleted successfully.`
      });
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast({
        title: "Error",
        description: "Failed to delete brand.",
        variant: "destructive"
      });
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="w-6 h-6 text-blue-500 mr-3" />
            <CardTitle>Brand Management</CardTitle>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Brand
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showCreateForm && (
          <div className="mb-6 p-4 bg-green-50 rounded-2xl border">
            <h3 className="font-semibold text-gray-800 mb-4">Create New Brand</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Name *
                </label>
                <Input
                  value={newBrand.name}
                  onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                  placeholder="Enter brand name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <Input
                  value={newBrand.industry}
                  onChange={(e) => setNewBrand({ ...newBrand, industry: e.target.value })}
                  placeholder="e.g., Technology, Finance, Healthcare"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (comma-separated)
                </label>
                <Input
                  value={newBrand.keywords}
                  onChange={(e) => setNewBrand({ ...newBrand, keywords: e.target.value })}
                  placeholder="e.g., fraud, scandal, lawsuit, investigation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Level
                </label>
                <Select value={newBrand.risk_level} onValueChange={(value) => setNewBrand({ ...newBrand, risk_level: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={createBrand}>
                  Create Brand
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewBrand({ name: '', industry: '', keywords: '', risk_level: 'medium' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Existing Brands ({brands.length})</h3>
          
          {brands.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No brands created yet. Create your first brand to get started with monitoring.
            </p>
          ) : (
            <div className="space-y-3">
              {brands.map(brand => (
                <div key={brand.id} className="border rounded-lg p-4 bg-gray-50">
                  {editingBrand?.id === brand.id ? (
                    <div className="space-y-4">
                      <Input
                        value={editingBrand.name}
                        onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                        placeholder="Brand name"
                      />
                      <Input
                        value={editingBrand.industry || ''}
                        onChange={(e) => setEditingBrand({ ...editingBrand, industry: e.target.value })}
                        placeholder="Industry"
                      />
                      <Input
                        value={Array.isArray(editingBrand.keywords) ? editingBrand.keywords.join(', ') : ''}
                        onChange={(e) => setEditingBrand({ 
                          ...editingBrand, 
                          keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k.length > 0)
                        })}
                        placeholder="Keywords (comma-separated)"
                      />
                      <Select value={editingBrand.risk_level} onValueChange={(value) => setEditingBrand({ ...editingBrand, risk_level: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Button onClick={updateBrand} size="sm">Save</Button>
                        <Button variant="outline" onClick={() => setEditingBrand(null)} size="sm">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-800">{brand.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${getRiskLevelColor(brand.risk_level)}`}>
                            {brand.risk_level.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            brand.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {brand.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        {brand.industry && (
                          <p className="text-sm text-gray-600 mb-1">Industry: {brand.industry}</p>
                        )}
                        {brand.keywords && brand.keywords.length > 0 && (
                          <div className="flex items-center gap-1 mb-1">
                            <Tag className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-500">
                              {brand.keywords.join(', ')}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-gray-500">
                          Created: {new Date(brand.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingBrand(brand)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteBrand(brand.id, brand.name)}
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
      </CardContent>
    </Card>
  );
};

export default BrandManagement;
