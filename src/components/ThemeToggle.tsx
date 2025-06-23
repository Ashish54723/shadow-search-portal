
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="icon"
      className="bg-white/90 dark:bg-black/90 backdrop-blur-lg border-2 border-gray-200 dark:border-gray-700 hover:border-yellow-400 dark:hover:border-blue-400 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500"
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-yellow-500 drop-shadow-lg" />
      ) : (
        <Moon className="w-5 h-5 text-blue-600 drop-shadow-lg" />
      )}
    </Button>
  );
};

export default ThemeToggle;
