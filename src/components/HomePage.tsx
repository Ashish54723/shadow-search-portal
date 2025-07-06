
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Shield, Users, Database, Globe, Target } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

const HomePage = ({ onGetStarted }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-2xl border-b border-gray-100 transition-colors duration-300">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500 floating-element" style={{ animation: 'float 8s ease-in-out infinite' }}>
                <svg width="32" height="32" viewBox="0 0 32 32" className="text-white">
                  {/* Magnifying glass body */}
                  <circle 
                    cx="12" 
                    cy="12" 
                    r="8" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5"
                    className="animate-pulse"
                  />
                  {/* Magnifying glass handle */}
                  <line 
                    x1="18" 
                    y1="18" 
                    x2="26" 
                    y2="26" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  {/* Warning exclamation mark inside the glass */}
                  <line 
                    x1="12" 
                    y1="8" 
                    x2="12" 
                    y2="13" 
                    stroke="#ff4444" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                    style={{ animation: 'flash 2s ease-in-out infinite' }}
                  />
                  <circle 
                    cx="12" 
                    cy="16" 
                    r="1" 
                    fill="#ff4444"
                    style={{ animation: 'flash 2s ease-in-out infinite' }}
                  />
                  {/* Negative indicator waves */}
                  <circle 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    fill="none" 
                    stroke="#ff4444" 
                    strokeWidth="1" 
                    opacity="0.4"
                    style={{ animation: 'ripple 3s ease-out infinite' }}
                  />
                  <circle 
                    cx="12" 
                    cy="12" 
                    r="12" 
                    fill="none" 
                    stroke="#ff4444" 
                    strokeWidth="0.5" 
                    opacity="0.2"
                    style={{ animation: 'ripple 3s ease-out infinite 0.5s' }}
                  />
                </svg>
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
            
            {/* Login/Signup Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                onClick={onGetStarted}
                variant="outline"
                size="sm"
                className="shadow-lg hover:shadow-xl"
              >
                Login
              </Button>
              <Button
                onClick={onGetStarted}
                size="sm"
                className="shadow-lg hover:shadow-xl"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6 floating-element" style={{ animation: 'float 8s ease-in-out infinite' }}>
            Advanced Media Monitoring Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Monitor and search through media content with powerful multi-string and multi-name search capabilities. 
            Stay informed about mentions, track narratives, and manage your digital presence effectively.
          </p>
          <div className="floating-element" style={{ animation: 'float 8s ease-in-out infinite' }}>
            <Button
              onClick={onGetStarted}
              size="lg"
              className="text-lg px-8 py-4 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="floating-element transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl" style={{ animation: 'float 8s ease-in-out infinite' }}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">Multi-String Search</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Search across multiple strings simultaneously with support for translations and complex queries.
              </p>
            </CardContent>
          </Card>

          <Card className="floating-element transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl" style={{ animation: 'float 8s ease-in-out infinite' }}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">Multi-Name Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Track multiple names, entities, or brands in a single search operation for comprehensive monitoring.
              </p>
            </CardContent>
          </Card>

          <Card className="floating-element transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl" style={{ animation: 'float 8s ease-in-out infinite' }}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">Organized Buckets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Organize your search strings into buckets for better management and targeted searches.
              </p>
            </CardContent>
          </Card>

          <Card className="floating-element transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl" style={{ animation: 'float 8s ease-in-out infinite' }}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">Multi-Language Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Search across different languages with built-in translation support for global monitoring.
              </p>
            </CardContent>
          </Card>

          <Card className="floating-element transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl" style={{ animation: 'float 8s ease-in-out infinite' }}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">Admin Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Comprehensive admin dashboard for user management and system configuration.
              </p>
            </CardContent>
          </Card>

          <Card className="floating-element transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-3xl" style={{ animation: 'float 8s ease-in-out infinite' }}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">Precise Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                Get accurate, relevant results with advanced search operators and filtering options.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Use Cases Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 floating-element" style={{ animation: 'float 8s ease-in-out infinite' }}>
            Perfect For
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left p-6 bg-white rounded-2xl shadow-2xl floating-element transform hover:scale-105 transition-all duration-300" style={{ animation: 'float 8s ease-in-out infinite' }}>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Brand Monitoring</h4>
              <p className="text-gray-600">
                Track mentions of your brand, products, or services across various media channels and respond quickly to emerging narratives.
              </p>
            </div>
            <div className="text-left p-6 bg-white rounded-2xl shadow-2xl floating-element transform hover:scale-105 transition-all duration-300" style={{ animation: 'float 8s ease-in-out infinite' }}>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">AML Compliance</h4>
              <p className="text-gray-600">
                Conduct adverse media searches for anti-money laundering compliance, screening entities against negative news and regulatory actions.
              </p>
            </div>
            <div className="text-left p-6 bg-white rounded-2xl shadow-2xl floating-element transform hover:scale-105 transition-all duration-300" style={{ animation: 'float 8s ease-in-out infinite' }}>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Competitive Intelligence</h4>
              <p className="text-gray-600">
                Keep track of competitors, industry trends, and market developments to stay ahead in your business sector.
              </p>
            </div>
            <div className="text-left p-6 bg-white rounded-2xl shadow-2xl floating-element transform hover:scale-105 transition-all duration-300" style={{ animation: 'float 8s ease-in-out infinite' }}>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Research & Analysis</h4>
              <p className="text-gray-600">
                Conduct comprehensive media analysis for academic research, market studies, or strategic planning initiatives.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-12 shadow-2xl floating-element" style={{ animation: 'float 8s ease-in-out infinite' }}>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Start Monitoring?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Join our platform and take control of your media presence today.
          </p>
          <Button
            onClick={onGetStarted}
            size="lg"
            className="text-lg px-12 py-4 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500"
          >
            Sign Up Now
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-gray-100 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">
            © 2024 Negative Media Search. Advanced media monitoring made simple.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
