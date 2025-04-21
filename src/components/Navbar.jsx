
import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <h1>MoodMuse</h1>
      <div>
        <Link to="/">Home</Link>
        <Link to="/moods">Moods</Link>
        <Link to="/submit">Submit</Link>
      </div>
    </nav>
  )
}

export default Navbar
