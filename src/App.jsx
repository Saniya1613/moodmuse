import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'; 
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Moods from './pages/Moods';
import Submit from './pages/Submit';
import NotFound from './pages/NotFound';
import { AppProvider } from './context/AppContext'; 

function App() {
  return (
    <AppProvider>
      <Router> 
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/moods" element={<Moods />} />
            <Route path="/journal" element={<Submit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
