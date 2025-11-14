import React, { useState } from 'react'

export default function App() {
  const [n, setN] = useState(45)
  const [lastRes, setLastRes] = useState(null)
  const [loading, setLoading] = useState(false)

  async function sendRequest() {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:3000/api/process-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ n: parseInt(n, 10) || 42 })
      })
      const json = await res.json()
      setLastRes(json)
    } catch (e) {
      setLastRes({ error: String(e) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Latency Detective — Client</h1>
      <p>
        Tune <code>n</code> to control CPU work (naive Fibonacci). Higher values -{'>'} more CPU.
      </p>
      <div>
        <label>n:&nbsp;
          <input value={n} onChange={(e) => setN(e.target.value)} style={{ width: 80 }} />
        </label>
        <button onClick={sendRequest} style={{ marginLeft: 10 }} disabled={loading}>
          {loading ? 'Working...' : 'Send request'}
        </button>
      </div>
      <pre style={{ marginTop: 20, background: '#f7f7f7', padding: 12 }}>
        {JSON.stringify(lastRes, null, 2)}
      </pre>
    </div>
  )
}
