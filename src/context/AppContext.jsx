// context/AppContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a context object to hold global state
const AppContext = createContext();

// Create a provider component to wrap the app and supply the context values
export const AppProvider = ({ children }) => {
  // Initialize state from localStorage if available, otherwise use an empty array
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('journalEntries');
    return saved ? JSON.parse(saved) : [];
  });

  // Custom setter function that updates both the state and localStorage
  const setDataFunc = (newData) => {
    setData(newData); // Update React state
    localStorage.setItem('journalEntries', JSON.stringify(newData)); // Persist data to localStorage
  };

  return (
    // Provide the context value (data and setter function) to all child components
    <AppContext.Provider value={{ data, setDataFunc }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access the context values easily in other components
export const useAppContext = () => useContext(AppContext);
