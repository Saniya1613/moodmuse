import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Home = () => {
  const { data, setDataFunc } = useAppContext();
  const navigate = useNavigate();
  const [journalInput, setJournalInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');

  const handleJournalSubmit = async () => {
    if (!journalInput) return;
    setIsLoading(true);
  
    const userMessage = { role: 'user', content: journalInput };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
  
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://your-site.com', // Replace with your deployed site's domain
          'X-Title': 'MuseMood Journaling Assistant'
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a friendly, empathetic journaling companion helping users reflect on emotions, thoughts, and moods with comforting, thoughtful responses.'
            },
            ...updatedMessages
          ],
          temperature: 0.8,
          max_tokens: 250
        }),
      });
  
      const data = await response.json();
      console.log('OpenRouter Response:', data);
  
      const reply = data?.choices?.[0]?.message?.content?.trim();
  
      if (!reply) {
        throw new Error("No reply from OpenRouter");
      }
  
      const assistantMessage = {
        role: 'assistant',
        content: reply
      };
  
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Hmm, I couldn’t respond right now. Want to try again?"
      }]);
    } finally {
      setIsLoading(false);
      setJournalInput('');
    }
  };
  

  const handleDeleteEntry = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setDataFunc(updatedData);
  };

  const handleEditEntry = (index) => {
    const entry = data[index];
    setNewTitle(entry.title);
    setNewBody(entry.body);
    setIsEditing(index);
  };

  const handleSaveEdit = (index) => {
    const updatedData = [...data];
    updatedData[index] = { ...updatedData[index], title: newTitle, body: newBody };
    setDataFunc(updatedData);
    setIsEditing(null);
  };

  return (
    <div className="home-page">
      <div className="hero-section card">
        <h1>🎶 Discover Your Mood Through Music</h1>
        <p>
          Welcome to MuseMood — your cozy corner for mood-based music exploration and journaling. Dive into sounds that match your vibe and reflect your thoughts with our AI-powered journaling assistant.
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
        <div className="chat-container">
          {messages.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>

        <textarea
          placeholder="How are you feeling today? Type here..."
          value={journalInput}
          onChange={(e) => setJournalInput(e.target.value)}
          className="journal-textarea"
        />
        <button onClick={handleJournalSubmit} className="btn submit-btn">
          {isLoading ? 'Thinking...' : 'Reflect'}
        </button>
      </div>

      <h2 style={{ marginTop: '2rem' }}>Latest Entries</h2>
      <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '1rem' }}>
        Think of your journal entries as heartfelt letters to your future self. Write with love.
      </p>

      <div className="entry-grid">
        {data && data.length > 0 ? (
          data.map((entry, index) => (
            <div key={index} className="entry-card">
              {isEditing === index ? (
                <>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Edit title"
                  />
                  <textarea
                    value={newBody}
                    onChange={(e) => setNewBody(e.target.value)}
                    placeholder="Edit content"
                  />
                  <button onClick={() => handleSaveEdit(index)} className="save-btn">Save</button>
                </>
              ) : (
                <>
                  <h3>{entry.title}</h3>

                  {entry.image && (
                    <div className="entry-image">
                      <img src={entry.image} alt="Journal Visual" />
                    </div>
                  )}

                  <p className="entry-content">{entry.body}</p>
                  <small className="entry-date">{entry.date}</small>
                  <div className="entry-actions">
                    <button onClick={() => handleEditEntry(index)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDeleteEntry(index)} className="delete-btn">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="empty-entries">No journal entries yet. Start by reflecting above!</p>
        )}
      </div>
    </div>
  );
};

export default Home;
