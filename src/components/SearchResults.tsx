
import React from 'react';
import { ExternalLink, Calendar, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchResult {
  id: number;
  title: string;
  source: string;
  date: string;
  sentiment: 'negative' | 'neutral' | 'positive';
  excerpt: string;
  url: string;
}

interface SearchResultsProps {
  results: SearchResult[];
}

const SearchResults = ({ results }: SearchResultsProps) => {
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'negative':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'neutral':
        return <Info className="w-5 h-5 text-yellow-500" />;
      case 'positive':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'negative':
        return 'border-l-red-500 bg-red-50';
      case 'neutral':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'positive':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-neo">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Search Results ({results.length} found)
      </h2>
      
      <div className="space-y-6">
        {results.map((result) => (
          <div
            key={result.id}
            className={`border-l-4 rounded-2xl p-6 shadow-neo-small hover:shadow-neo-small-hover transition-all duration-200 ${getSentimentColor(result.sentiment)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {result.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="font-medium">{result.source}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {result.date}
                  </div>
                  <div className="flex items-center gap-1">
                    {getSentimentIcon(result.sentiment)}
                    <span className="capitalize">{result.sentiment}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4 leading-relaxed">
              {result.excerpt}
            </p>
            
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl shadow-neo-small hover:shadow-neo-small-hover"
                onClick={() => window.open(result.url, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Read Full Article
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
