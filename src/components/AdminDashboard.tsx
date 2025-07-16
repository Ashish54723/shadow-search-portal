
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LogOut } from 'lucide-react';
import UserManagement from './UserManagement';
import BrandManagement from './BrandManagement';
import SearchStringForm from './SearchStringForm';
import SearchStringsList from './SearchStringsList';
import SearchHistoryList from './SearchHistoryList';

interface SearchString {
  id: string;
  string_value: string;
  translations: Record<string, string>;
  is_active: boolean;
}

interface AdminDashboardProps {
  adminId: string;
  onLogout: () => void;
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

const AdminDashboard = ({ adminId, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'brands' | 'strings' | 'users' | 'history'>('brands');
  const [searchStrings, setSearchStrings] = useState<SearchString[]>([]);

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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-neo">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Button
            onClick={onLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('brands')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'brands'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Brand Management
          </button>
          <button
            onClick={() => setActiveTab('strings')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'strings'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Search Strings
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Search History
          </button>
        </div>

        {activeTab === 'brands' ? (
          <BrandManagement adminId={adminId} />
        ) : activeTab === 'strings' ? (
          <>
            <SearchStringForm onStringAdded={fetchSearchStrings} />
            <SearchStringsList 
              searchStrings={searchStrings}
              availableLanguages={AVAILABLE_LANGUAGES}
              onUpdate={fetchSearchStrings}
            />
          </>
        ) : activeTab === 'users' ? (
          <UserManagement adminId={adminId} />
        ) : (
          <SearchHistoryList />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
