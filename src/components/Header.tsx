
import React from 'react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-neo-inset">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Negative Media Search
          </h1>
          <p className="text-lg text-gray-600">
            Advanced media monitoring with multi-string and multi-name search capabilities
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
