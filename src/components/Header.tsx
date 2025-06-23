
import React from 'react';
import { Shield, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const isAdminPage = window.location.pathname === '/admin';

  return (
    <header className="bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-2xl border-b border-gray-100 dark:border-gray-800 transition-colors duration-300 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 transform hover:scale-105 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 floating-element">
              <Search className="w-8 h-8 text-white" />
            </div>
            <div className="floating-element">
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
            <div className="floating-element">
              <ThemeToggle />
            </div>
            {!isAdminPage ? (
              <div className="floating-element">
                <Button
                  onClick={() => window.location.href = '/admin'}
                  variant="outline"
                  className="flex items-center gap-2 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400 text-gray-800 dark:text-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-black shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500"
                >
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </Button>
              </div>
            ) : (
              <div className="floating-element">
                <Button
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  className="flex items-center gap-2 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400 text-gray-800 dark:text-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-800 dark:hover:to-black shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500"
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
