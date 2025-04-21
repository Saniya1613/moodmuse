import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Submit = () => {
  const { data, setDataFunc } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const entryIndex = location.state?.index; // Check if there's an entryIndex in the state

  useEffect(() => {
    if (entryIndex !== undefined) {
      const entry = data[entryIndex];
      setTitle(entry.title);
      setBody(entry.body);
    }
  }, [entryIndex, data]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newPost = {
      title,
      body,
      date: new Date().toLocaleString(), // Date + Time
    };

    let updatedData;
    if (entryIndex !== undefined) {
      updatedData = data.map((entry, index) =>
        index === entryIndex ? { ...newPost, date: data[entryIndex].date } : entry
      );
    } else {
      updatedData = [newPost, ...data];
    }

    setDataFunc(updatedData);
    setSuccessMsg('Journal entry saved successfully!');
    setTitle('');
    setBody('');

    setTimeout(() => {
      setSuccessMsg('');
      navigate('/');
    }, 1500);
  };

  return (
    <div className="submit-page">
      <h2>📝 {entryIndex !== undefined ? 'Edit Journal Entry' : 'New Journal Entry'}</h2>
      {successMsg && <p className="success-msg">{successMsg}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title of your journal"
          required
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your thoughts here..."
          required
        />
        <button type="submit">{entryIndex !== undefined ? 'Update Entry' : 'Submit Entry'}</button>
      </form>

      <button onClick={() => navigate('/')} className="btn back-btn">
        Back to Home
      </button>
    </div>
  );
};

export default Submit;
