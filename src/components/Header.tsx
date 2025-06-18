
import React from 'react';
import { Shield, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const isAdminPage = window.location.pathname === '/admin';

  return (
    <header className="bg-white shadow-neo-small border-b border-gray-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-neo-small">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">NSS</h1>
              <p className="text-sm text-gray-600">Negative Media Search</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4">
            {!isAdminPage ? (
              <Button
                onClick={() => window.location.href = '/admin'}
                variant="outline"
                className="rounded-2xl shadow-neo-small hover:shadow-neo-small-hover flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="rounded-2xl shadow-neo-small hover:shadow-neo-small-hover flex items-center gap-2"
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
