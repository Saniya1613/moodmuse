import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Submit = () => {
  const { data, setDataFunc } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const entryIndex = location.state?.index;

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
      image, // Add image to the entry
      date: new Date().toLocaleString(),
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
    setImage(null);

    setTimeout(() => {
      setSuccessMsg('');
      navigate('/');
    }, 1500);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Save the image data as base64 URL
      };
      reader.readAsDataURL(file);
    }
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

        {/* List Feature */}
        <div className="tool-bar">
          <button type="button" onClick={() => setBody(body + '\n- Item 1\n- Item 2\n- Item 3')}>
            Add List
          </button>

          {/* Image Upload Feature */}
          <label className="image-upload-label" htmlFor="imageUpload">Attach Image</label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="image-upload-input"
          />
        </div>

        {/* Display Image if any */}
        {image && (
          <div className="image-preview">
            <img src={image} alt="Uploaded" className="uploaded-image" />
          </div>
        )}

        <button type="submit">{entryIndex !== undefined ? 'Update Entry' : 'Submit Entry'}</button>
      </form>

      <button onClick={() => navigate('/')} className="btn back-btn">
        Back to Home
      </button>
    </div>
  );
};

export default Submit;
