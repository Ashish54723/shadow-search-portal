
import React from 'react';

interface SearchString {
  id: string;
  string_value: string;
  translations: Record<string, string>;
  is_active: boolean;
}

interface AdminSearchStringsDisplayProps {
  adminStrings: SearchString[];
}

const AdminSearchStringsDisplay = ({ adminStrings }: AdminSearchStringsDisplayProps) => {
  if (adminStrings.length === 0) return null;

  // Get all unique languages from translations
  const getAllLanguages = () => {
    const languages = new Set<string>();
    adminStrings.forEach(str => {
      if (str.translations) {
        Object.keys(str.translations).forEach(lang => languages.add(lang));
      }
    });
    return Array.from(languages);
  };

  const languages = getAllLanguages();

  return (
    <div className="bg-white rounded-3xl p-8 shadow-neo">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Active Search Strings</h2>
      <p className="text-gray-600 mb-4">These admin-managed strings will be automatically combined with your search names in multiple languages:</p>
      
      <div className="space-y-4">
        {adminStrings.map((str) => (
          <div key={str.id} className="bg-blue-50 rounded-2xl p-4 shadow-neo-small">
            <div className="mb-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-xl text-sm font-medium">
                {str.string_value} (Original)
              </span>
            </div>
            
            {str.translations && Object.keys(str.translations).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(str.translations).map(([lang, translation]) => (
                  <span
                    key={lang}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-xl text-sm"
                  >
                    {translation} ({lang.toUpperCase()})
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {languages.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Available Languages:</h3>
          <div className="flex flex-wrap gap-2">
            {languages.map(lang => (
              <span key={lang} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium">
                {lang.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSearchStringsDisplay;
