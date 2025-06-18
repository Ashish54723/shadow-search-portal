
import SearchInterface from "@/components/SearchInterface";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SearchInterface />
      </main>
    </div>
  );
};

export default Index;
