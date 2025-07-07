// SidebarContext.js
import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isToggled, setIsToggled] = useState(true); // Initial state: true (expanded)

  const toggleSidebar = () => {
    setIsToggled(!isToggled);
  };

  return (
    <SidebarContext.Provider value={{ isToggled, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  return useContext(SidebarContext);
};
