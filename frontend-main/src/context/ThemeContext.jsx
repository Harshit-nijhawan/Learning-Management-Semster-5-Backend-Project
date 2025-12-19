import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Always use light theme
  const theme = 'light';

  useEffect(() => {
    // Ensure only light class is present
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    
    // Clear theme from localStorage if it exists
    localStorage.removeItem('theme');
  }, []);

  const toggleTheme = () => {
    // No-op: Theme toggling is disabled
    console.log("Theme toggling is disabled");
  };

  const value = {
    theme,
    toggleTheme,
    isDark: false
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
