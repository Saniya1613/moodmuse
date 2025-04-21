import React, { createContext, useState, useContext } from "react";

// Create a context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [data, setData] = useState(null); // State to store fetched data

  // Function to update the data
  const setDataFunc = (newData) => {
    setData(newData);
  };

  return (
    <AppContext.Provider value={{ data, setDataFunc }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  return useContext(AppContext);
};
