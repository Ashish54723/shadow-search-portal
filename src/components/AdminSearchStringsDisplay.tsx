
import React from 'react';

interface SearchString {
  id: string;
  string_value: string;
  is_active: boolean;
}

interface AdminSearchStringsDisplayProps {
  adminStrings: SearchString[];
}

const AdminSearchStringsDisplay = ({ adminStrings }: AdminSearchStringsDisplayProps) => {
  if (adminStrings.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-neo">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Active Search Strings</h2>
      <p className="text-gray-600 mb-4">These admin-managed strings will be automatically combined with your search names:</p>
      <div className="flex flex-wrap gap-2">
        {adminStrings.map((str) => (
          <div
            key={str.id}
            className="bg-blue-100 text-blue-800 px-4 py-2 rounded-2xl shadow-neo-small"
          >
            <span className="text-sm font-medium">{str.string_value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSearchStringsDisplay;
