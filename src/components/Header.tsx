
import React from 'react';
import { Shield, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const isAdminPage = window.location.pathname === '/admin';

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-2xl border-b border-gray-100 transition-colors duration-300 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 transform hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 floating-element" style={{ animation: 'float 8s ease-in-out infinite' }}>
              <Search className="w-8 h-8 text-white" />
            </div>
            <div className="floating-element" style={{ animation: 'float 8s ease-in-out infinite' }}>
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="text-blue-500 drop-shadow-lg">N</span>
                <span className="text-red-500 drop-shadow-lg">S</span>
                <span className="text-yellow-500 drop-shadow-lg">S</span>
              </h1>
              <p className="text-sm bg-gradient-to-r from-blue-600 via-red-500 to-yellow-500 bg-clip-text text-transparent font-semibold tracking-wide drop-shadow-sm">
                Negative Media Search
              </p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4">
            {!isAdminPage ? (
              <div className="floating-element" style={{ animation: 'float 8s ease-in-out infinite' }}>
                <Button
                  onClick={() => window.location.href = '/admin'}
                  variant="outline"
                  className="flex items-center gap-2 bg-white/90 backdrop-blur-lg border-2 border-gray-200 hover:border-blue-400 text-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500"
                  style={{ animation: 'float 8s ease-in-out infinite' }}
                >
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </Button>
              </div>
            ) : (
              <div className="floating-element" style={{ animation: 'float 8s ease-in-out infinite' }}>
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="flex items-center gap-2 bg-white/90 backdrop-blur-lg border-2 border-gray-200 hover:border-blue-400 text-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500"
                  style={{ animation: 'float 8s ease-in-out infinite' }}
                >
                  <Search className="w-4 h-4" />
                  Search Interface
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
