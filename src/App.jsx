import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// 🧭 Component Imports
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Moods from './pages/Moods';
import Submit from './pages/Submit';
import NotFound from './pages/NotFound';

// 📦 Global State Provider
import { AppProvider } from './context/AppContext';

function App() {
  return (
    // 🌍 Wrap the entire app with global state provider
    <AppProvider>
      {/* 🛣️ Set up React Router for navigation */}
      <Router>
        {/* 🔝 Persistent navigation bar */}
        <Navbar />

        {/* 🧱 Page content container */}
        <div className="container">
          <Routes>
            {/* 🏠 Home page route */}
            <Route path="/" element={<Home />} />

            {/* 😊 Mood board route */}
            <Route path="/moods" element={<Moods />} />

            {/* 📝 Submit/Edit journal entry route */}
            <Route path="/journal" element={<Submit />} />

            {/* ❌ Catch-all route for undefined paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App; // 📤 Export App component
