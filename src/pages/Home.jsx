import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Home = () => {
  const { data, setDataFunc } = useAppContext();
  const navigate = useNavigate();
  const [journalInput, setJournalInput] = useState('');
  const [journalResponse, setJournalResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!data || data.length === 0) {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const result = await response.json();
        setDataFunc(result);
      }
    };

    fetchData();
  }, [data, setDataFunc]);

  const handleJournalSubmit = async () => {
    if (!journalInput) return;
    setIsLoading(true);
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173', // or your deployed URL
          'X-Title': 'MuseMood Journal'
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct', // or another model like 'openai/gpt-3.5-turbo'
          messages: [
            { role: 'system', content: 'You are a friendly mood journaling assistant.' },
            { role: 'user', content: journalInput }
          ]
        })
      });
  
      const data = await response.json();
      setJournalResponse(data.choices[0].message.content);
    } catch (error) {
      console.error(error);
      setJournalResponse("Oops! Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="home-page">
      <div className="hero-section card">
        <h1>🎶 Discover Your Mood Through Music</h1>
        <p>
          Welcome to MuseMood — your cozy corner for mood-based music exploration and
          journaling. Dive into sounds that match your vibe and reflect your thoughts
          with our AI-powered journaling assistant.
        </p>
        <div className="cta-buttons">
          <button onClick={() => navigate('/moods')} className="btn mood-btn">
            🎵 Explore Music
          </button>
          <button onClick={() => navigate('/journal')} className="btn journal-btn">
            📝 Start Journaling
          </button>
        </div>
      </div>

      <div className="journal-section card">
        <h2>🧠 Mood Journal Chatbot</h2>
        <textarea
          placeholder="How are you feeling today? Type here..."
          value={journalInput}
          onChange={(e) => setJournalInput(e.target.value)}
          className="journal-textarea"
        />
        <button onClick={handleJournalSubmit} className="btn submit-btn">
          {isLoading ? 'Thinking...' : 'Reflect'}
        </button>
        {journalResponse && (
          <div className="journal-response">
            <h4>Your Reflection</h4>
            <p>{journalResponse}</p>
          </div>
        )}
      </div>

      <h2 style={{ marginTop: '2rem' }}>Latest Entries</h2>
      <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '1rem' }}>
        Think of your journal entries as heartfelt letters to your future self. Write with love.
      </p>
      <div className="post-list">
        <p>No journal entries yet. Start by reflecting above!</p>
      </div>
    </div>
  );
};

export default Home;
