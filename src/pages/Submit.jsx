import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Submit = () => {
  // 🔗 Access shared context data and function
  const { data, setDataFunc } = useAppContext();

  // 🌐 Navigation and route state
  const navigate = useNavigate();
  const location = useLocation();

  // 🧠 Local state for form data
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // 📌 Check if we are editing an existing entry
  const entryIndex = location.state?.index;

  // 🔄 Pre-fill form if editing an entry
  useEffect(() => {
    if (entryIndex !== undefined) {
      const entry = data[entryIndex];
      setTitle(entry.title);
      setBody(entry.body);
    }
  }, [entryIndex, data]);

  // 📨 Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // 📦 Create a new journal entry object
    const newPost = {
      title,
      body,
      image, // 💾 Base64 image data
      date: new Date().toLocaleString(), // 🕒 Add timestamp
    };

    let updatedData;

    if (entryIndex !== undefined) {
      // ✏️ Update existing entry (preserve original date)
      updatedData = data.map((entry, index) =>
        index === entryIndex ? { ...newPost, date: data[entryIndex].date } : entry
      );
    } else {
      // ➕ Add new entry to the top of the list
      updatedData = [newPost, ...data];
    }

    // 🔁 Update shared context data
    setDataFunc(updatedData);

    // ✅ Show success message and reset form
    setSuccessMsg('Journal entry saved successfully!');
    setTitle('');
    setBody('');
    setImage(null);

    // ⏳ Redirect back to home after short delay
    setTimeout(() => {
      setSuccessMsg('');
      navigate('/');
    }, 1500);
  };

  // 📷 Handle image upload and convert to base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="submit-page">
      {/* 🔤 Heading: Edit or New Entry */}
      <h2>📝 {entryIndex !== undefined ? 'Edit Journal Entry' : 'New Journal Entry'}</h2>

      {/* ✅ Success Message */}
      {successMsg && <p className="success-msg">{successMsg}</p>}

      {/* 📋 Journal Entry Form */}
      <form onSubmit={handleSubmit}>
        {/* ✍️ Title input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title of your journal"
          required
        />

        {/* 📝 Body textarea */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your thoughts here..."
          required
        />

        {/* 🛠️ Tool Bar */}
        <div className="tool-bar">
          {/* 🗒️ Add predefined list to the entry */}
          <button type="button" onClick={() => setBody(body + '\n- Item 1\n- Item 2\n- Item 3')}>
            Add List
          </button>

          {/* 📎 Upload image */}
          <label className="image-upload-label" htmlFor="imageUpload">Attach Image</label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="image-upload-input"
          />
        </div>

        {/* 🖼️ Preview uploaded image */}
        {image && (
          <div className="image-preview">
            <img src={image} alt="Uploaded" className="uploaded-image" />
          </div>
        )}

        {/* 🚀 Submit or Update Button */}
        <button type="submit">
          {entryIndex !== undefined ? 'Update Entry' : 'Submit Entry'}
        </button>
      </form>

      {/* 🔙 Go Back Button */}
      <button onClick={() => navigate('/')} className="btn back-btn">
        Back to Home
      </button>
    </div>
  );
};

export default Submit; // 📤 Export component
