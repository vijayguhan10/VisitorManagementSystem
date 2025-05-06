import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Get theme from local storage or default to 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('visittrack-theme');
    return savedTheme || 'dark';
  });

  // Set a CSS variable for the primary background color
  const [primaryColor, setPrimaryColor] = useState(() => {
    const savedColor = localStorage.getItem('visittrack-primary-color');
    return savedColor || '#1e1e2e';
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('visittrack-theme', theme);
    
    // Apply theme to body element
    document.body.className = theme;
    
    // Apply primary color CSS variable
    document.documentElement.style.setProperty('--primary-color', theme === 'light' ? '#ffffff' : primaryColor);
  }, [theme, primaryColor]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const changePrimaryColor = (color) => {
    setPrimaryColor(color);
    localStorage.setItem('visittrack-primary-color', color);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, primaryColor, changePrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};