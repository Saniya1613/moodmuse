import React from 'react';

// ❌ NotFound component for handling undefined routes (404 error)
function NotFound() {
  return (
    <div className="card">
      {/* 🛑 Display 404 message */}
      <h2>404 - Page Not Found</h2>
    </div>
  );
}

export default NotFound; // 📤 Exporting the component for use in routing
