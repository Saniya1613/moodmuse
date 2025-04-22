import React, { useState, useEffect } from 'react';

// 🌈 List of moods for user to choose from
const moodsList = [
  'Happy 😊', 'Sad 😢', 'Chill 😎', 'Romantic ❤️', 'Energetic ⚡', 'Angry 😠',
  'Melancholy 🌧️', 'Excited 🤩', 'Hopeful 🌟', 'Peaceful 🧘‍♀️',
  'Nostalgic 📼', 'Motivational 🚀',
];

const Moods = () => {
  // 🎯 App states
  const [selectedMood, setSelectedMood] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playlists, setPlaylists] = useState({});
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [viewingPlaylist, setViewingPlaylist] = useState(null);

  // ✅ Handle mood selection
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  // ➕ Add a song to a playlist (if not already in it)
  const handleAddToPlaylist = (playlistName, song) => {
    const updated = {
      ...playlists,
      [playlistName]: playlists[playlistName]?.some(s => s.trackId === song.trackId)
        ? playlists[playlistName] // don't add duplicates
        : [...(playlists[playlistName] || []), song],
    };
    setPlaylists(updated);
    localStorage.setItem('playlists', JSON.stringify(updated));
  };

  // ❌ Remove a song from a playlist
  const handleRemoveSong = (playlistName, trackId) => {
    const updated = {
      ...playlists,
      [playlistName]: playlists[playlistName].filter((s) => s.trackId !== trackId),
    };
    setPlaylists(updated);
    localStorage.setItem('playlists', JSON.stringify(updated));
  };

  // 🆕 Create a new playlist (if name is valid and doesn't exist already)
  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    if (playlists[newPlaylistName]) {
      alert('Playlist already exists!');
      return;
    }
    const updated = { ...playlists, [newPlaylistName]: [] };
    setPlaylists(updated);
    setNewPlaylistName('');
    localStorage.setItem('playlists', JSON.stringify(updated));
  };

  // 🗑️ Delete an entire playlist
  const handleDeletePlaylist = (playlistName) => {
    const updated = { ...playlists };
    delete updated[playlistName];
    setPlaylists(updated);
    setViewingPlaylist(null);
    localStorage.setItem('playlists', JSON.stringify(updated));
  };

  // 🎵 Fetch songs from iTunes API whenever mood is selected
  useEffect(() => {
    const fetchSongs = async () => {
      if (!selectedMood) return;
      setLoading(true);
      try {
        const response = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(selectedMood)}+music&media=music&limit=30`
        );
        const data = await response.json();
        setSongs(data.results);
      } catch (error) {
        console.error('Error fetching songs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [selectedMood]);

  // 🔁 Load playlists from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem('playlists');
    if (stored) {
      setPlaylists(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="card">

      {/* 🎉 Intro section */}
      <div className="intro-banner">
        <h1>🎶 MoodMuse: Discover Your Vibe</h1>
        <p>
          Pick a mood, explore curated songs, and craft your own custom playlists. 
          Let your feelings guide the beats. Start your musical journey now ✨
        </p>
      </div>

      {/* 🌈 Mood selection */}
      <h2>Select Your Mood</h2>
      <div className="mood-buttons">
        {moodsList.map((mood) => (
          <button
            key={mood}
            onClick={() => handleMoodSelect(mood)}
            className={selectedMood === mood ? 'selected' : ''}
          >
            {mood}
          </button>
        ))}
      </div>

      {/* ⏳ Loading indicator */}
      {loading && <p>Loading songs...</p>}

      {/* 🎧 Display fetched songs */}
      {!loading && songs.length > 0 && (
        <div>
          <h3>Top {selectedMood} Songs</h3>
          <div className="scroll-container grid-layout">
            {songs.map((song) => (
              <div key={song.trackId} className="card song-card">
                <img src={song.artworkUrl100} alt={song.trackName} />
                <h4>{song.trackName}</h4>
                <p>{song.artistName}</p>
                <audio controls src={song.previewUrl} />
                {/* Add to existing playlists */}
                {Object.keys(playlists).map((name) => (
                  <button
                    key={name}
                    onClick={() => handleAddToPlaylist(name, song)}
                    className="add-button"
                  >
                    Add to {name}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ➕ Create new playlist UI */}
      <div style={{ marginTop: '2rem' }}>
        <h3>Create New Playlist</h3>
        <input
          type="text"
          placeholder="Playlist name"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
        />
        <button onClick={handleCreatePlaylist}>Create</button>
      </div>

      {/* 📁 Display all user playlists */}
      {Object.keys(playlists).length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Your Playlists</h3>
          <ul>
            {Object.keys(playlists).map((name) => (
              <li key={name}>
                <strong>{name}</strong>
                <button onClick={() => setViewingPlaylist(name)}>View</button>
                <button onClick={() => handleDeletePlaylist(name)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🎼 View selected playlist songs */}
      {viewingPlaylist && playlists[viewingPlaylist] && (
        <div style={{ marginTop: '2rem' }}>
          <h3>{viewingPlaylist} Playlist</h3>
          <div className="scroll-container grid-layout">
            {playlists[viewingPlaylist].map((song) => (
              <div key={song.trackId} className="card song-card">
                <img src={song.artworkUrl100} alt={song.trackName} />
                <h4>{song.trackName}</h4>
                <p>{song.artistName}</p>
                <audio controls src={song.previewUrl} />
                <button
                  onClick={() => handleRemoveSong(viewingPlaylist, song.trackId)}
                  className="delete-button"
                >
                  Remove Song
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Moods;
