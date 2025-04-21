// context/AppContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('journalEntries');
    return saved ? JSON.parse(saved) : [];
  });

  const setDataFunc = (newData) => {
    setData(newData);
    localStorage.setItem('journalEntries', JSON.stringify(newData));
  };

  return (
    <AppContext.Provider value={{ data, setDataFunc }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
