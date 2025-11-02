import React, { createContext, useContext } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
 
  const value = {
    
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};