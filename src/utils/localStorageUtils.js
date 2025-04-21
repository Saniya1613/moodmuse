export const getJournalEntries = () => {
    const entries = localStorage.getItem('journalEntries');
    return entries ? JSON.parse(entries) : [];
  };
  
  export const saveJournalEntries = (entries) => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  };
  