import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <h1>MoodMuse</h1>
      <div>
        <Link to="/">Home</Link>
        <Link to="/moods">Mood tunes</Link>
        <Link to="/journal">Journaling</Link> {/* Changed /submit to /journal */}
      </div>
    </nav>
  )
}

export default Navbar
