import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Submit = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { data, setDataFunc } = useAppContext(); // To update global state with the new post

  // Handle form submission and POST the data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = { title, body };

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      const result = await response.json();
      console.log('Post submitted successfully:', result);

      // Update global state to include the new post
      setDataFunc([result, ...data]);

      // Show success message
      setSuccessMsg('Post submitted successfully!');

      // Clear the form
      setTitle('');
      setBody('');

      // Optional: Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  return (
    <div className="submit-page">
      <h2>Submit a Post</h2>
      {successMsg && <p className="success-msg">{successMsg}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your post here"
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Submit;
