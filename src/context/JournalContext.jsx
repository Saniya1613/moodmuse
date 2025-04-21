// context/JournalContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const JournalContext = createContext();

export const JournalProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("journalEntries");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("journalEntries", JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry) => {
    setEntries((prev) => [...prev, entry]);
  };

  const deleteEntry = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEntry = (updatedEntry) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
    );
  };

  return (
    <JournalContext.Provider value={{ entries, addEntry, deleteEntry, updateEntry }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => useContext(JournalContext);
