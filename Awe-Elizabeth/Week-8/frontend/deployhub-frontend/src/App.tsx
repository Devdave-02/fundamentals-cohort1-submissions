import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {

  return (
    <div  className="container">
      <button className="health-btn" onClick={() => fetch("http://localhost:5000/healthCheck")}>Get Health Status</button>
    </div>
  )
}

export default App
