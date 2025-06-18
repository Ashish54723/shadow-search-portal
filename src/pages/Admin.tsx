
import AdminDashboard from "@/components/AdminDashboard";
import Header from "@/components/Header";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </main>
    </div>
  );
};

export default Admin;
