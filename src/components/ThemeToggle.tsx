
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
      className="rounded-full shadow-neo-small hover:shadow-neo-small-hover transition-all duration-300"
    >
      {isDarkMode ? (
        <Sun className="w-4 h-4 text-yellow-500" />
      ) : (
        <Moon className="w-4 h-4 text-blue-600" />
      )}
    </Button>
  );
};

export default ThemeToggle;
