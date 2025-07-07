
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { History, ExternalLink, Calendar, User, Search } from 'lucide-react';

interface SearchHistoryItem {
  id: string;
  search_strings: string[];
  search_names: string[];
  results_count: number | null;
  created_at: string;
  user_id: string | null;
  username?: string;
}

const SearchHistoryList = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      setIsLoading(true);
      
      // First get search history
      const { data: historyData, error: historyError } = await supabase
        .from('search_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (historyError) throw historyError;

      // Get user information for each search
      const { data: usersData, error: usersError } = await supabase
        .from('regular_users')
        .select('id, username');

      if (usersError) throw usersError;

      // Combine the data
      const enrichedHistory = historyData?.map(item => {
        const user = usersData?.find(u => u.id === item.user_id);
        return {
          ...item,
          username: user?.username || 'Unknown User'
        };
      }) || [];

      setSearchHistory(enrichedHistory);
    } catch (error) {
      console.error('Error fetching search history:', error);
      toast({
        title: "Error",
        description: "Failed to load search history.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const generateSearchLink = (item: SearchHistoryItem) => {
    const searchParams = new URLSearchParams();
    if (item.search_strings.length > 0) {
      searchParams.set('strings', item.search_strings.join(','));
    }
    if (item.search_names.length > 0) {
      searchParams.set('names', item.search_names.join(','));
    }
    return `/search?${searchParams.toString()}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="w-6 h-6 text-blue-500 mr-3" />
            Search History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Loading search history...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <History className="w-6 h-6 text-blue-500 mr-3" />
            Search History ({searchHistory.length})
          </CardTitle>
          <Button
            onClick={fetchSearchHistory}
            variant="outline"
            size="sm"
          >
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {searchHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No search history found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Search Terms</TableHead>
                  <TableHead>Names Searched</TableHead>
                  <TableHead>Results Count</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        <div>
                          <div className="font-medium">
                            {item.username || 'Unknown User'}
                          </div>
                          {item.user_id && (
                            <div className="text-xs text-gray-500">
                              ID: {item.user_id.slice(0, 8)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-sm">
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {item.search_strings.length > 0 ? (
                          <div className="text-sm">
                            {item.search_strings.slice(0, 2).map((str, idx) => (
                              <div key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded mb-1 text-xs">
                                {str.length > 30 ? `${str.slice(0, 30)}...` : str}
                              </div>
                            ))}
                            {item.search_strings.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{item.search_strings.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No search strings</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {item.search_names.length > 0 ? (
                          <div className="text-sm">
                            {item.search_names.slice(0, 2).map((name, idx) => (
                              <div key={idx} className="bg-green-50 text-green-700 px-2 py-1 rounded mb-1 text-xs">
                                {name}
                              </div>
                            ))}
                            {item.search_names.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{item.search_names.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No names</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {item.results_count || 0} results
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(generateSearchLink(item), '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchHistoryList;
