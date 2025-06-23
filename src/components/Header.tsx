
import React from 'react';
import { Shield, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const isAdminPage = window.location.pathname === '/admin';

  return (
    <header className="bg-white dark:bg-gray-900 shadow-neo-small border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <Search className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                <span className="text-blue-500">N</span>
                <span className="text-red-500">S</span>
                <span className="text-yellow-500">S</span>
              </h1>
              <p className="text-sm bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">
                Negative Media Search
              </p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4">
            <ThemeToggle />
            {!isAdminPage ? (
              <Button
                onClick={() => window.location.href = '/admin'}
                variant="outline"
                className="flex items-center gap-2 rounded-full shadow-neo-small hover:shadow-neo-small-hover transform hover:-translate-y-1 transition-all duration-300"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="flex items-center gap-2 rounded-full shadow-neo-small hover:shadow-neo-small-hover transform hover:-translate-y-1 transition-all duration-300"
              >
                <Search className="w-4 h-4" />
                Search Interface
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
