
import SearchInterface from "@/components/SearchInterface";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:via-gray-900 dark:to-black transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SearchInterface />
      </main>
    </div>
  );
};

export default Index;
