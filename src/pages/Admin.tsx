
import React, { useState, useEffect } from 'react';
import AdminDashboard from "@/components/AdminDashboard";
import AdminLogin from "@/components/AdminLogin";
import Header from "@/components/Header";

const Admin = () => {
  const [adminId, setAdminId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in (from sessionStorage)
    const storedAdminId = sessionStorage.getItem('adminId');
    if (storedAdminId) {
      setAdminId(storedAdminId);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (id: string) => {
    setAdminId(id);
    sessionStorage.setItem('adminId', id);
  };

  const handleLogout = () => {
    setAdminId(null);
    sessionStorage.removeItem('adminId');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!adminId) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AdminDashboard adminId={adminId} onLogout={handleLogout} />
      </main>
    </div>
  );
};

export default Admin;
