
import React, { useState, useEffect } from 'react';
import SearchInterface from "@/components/SearchInterface";
import UserLogin from "@/components/UserLogin";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Index = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from sessionStorage)
    const storedUserId = sessionStorage.getItem('userId');
    const storedUsername = sessionStorage.getItem('username');
    if (storedUserId && storedUsername) {
      setUserId(storedUserId);
      setUsername(storedUsername);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (id: string, name: string) => {
    setUserId(id);
    setUsername(name);
    sessionStorage.setItem('userId', id);
    sessionStorage.setItem('username', name);
  };

  const handleLogout = () => {
    setUserId(null);
    setUsername(null);
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userId || !username) {
    return <UserLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 transition-colors duration-300">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Search Portal</h1>
            <p className="text-sm text-gray-600">Welcome, {username}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
      <main className="container mx-auto px-4 py-8">
        <SearchInterface userId={userId} />
      </main>
    </div>
  );
};

export default Index;
