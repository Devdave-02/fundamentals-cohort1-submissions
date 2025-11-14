import React, { useState } from 'react'
import Login from './auth/Login'
import Register from './auth/Register'
import Tasks from './tasks/Tasks'

export default function App() {
  const [accessToken, setAccessToken] = useState(null) // memory storage
  const [view, setView] = useState('login')

  return (
    <div style={{ padding: 20 }}>
      <h2>Brave Week3 - Minimal Frontend</h2>
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setView('login')}>Login</button>
        <button onClick={() => setView('register')}>Register</button>
        <button onClick={() => setView('tasks')}>Tasks</button>
      </div>
      {view === 'login' && <Login setAccessToken={setAccessToken} />}
      {view === 'register' && <Register />}
      {view === 'tasks' && <Tasks accessToken={accessToken} setAccessToken={setAccessToken} />}
    </div>
  )
}
