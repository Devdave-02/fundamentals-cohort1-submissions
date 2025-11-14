import React from 'react';

function Home() {
  return (
    <div className="App-header">
      <h1 className="page-title">Welcome to PulseTrack</h1>
      <p className="page-subtitle">
        A comprehensive health monitoring application
      </p>
      
      <div className="grid">
        <div className="card">
          <h2>👥 User Management</h2>
          <p>Manage user profiles with health information including age, weight, height, and more.</p>
        </div>
        
        <div className="card">
          <h2>🏃 Activity Tracking</h2>
          <p>Track fitness activities like running, cycling, swimming with duration, calories, and distance.</p>
        </div>
        
        <div className="card">
          <h2>📅 Appointments</h2>
          <p>Schedule and manage medical appointments with doctors and track their status.</p>
        </div>
      </div>
      
      <div className="card">
        <h3>Features</h3>
        <ul style={{ textAlign: 'left', lineHeight: '2' }}>
          <li>✅ Create and manage user profiles</li>
          <li>✅ Track various fitness activities</li>
          <li>✅ Schedule medical appointments</li>
          <li>✅ View activity statistics</li>
          <li>✅ Real-time data updates</li>
          <li>✅ Responsive design</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
