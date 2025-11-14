import React, { useState } from 'react'

export default function Login({ setAccessToken }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function submit(e) {
    e.preventDefault()
    setMsg('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) return setMsg(data.error || JSON.stringify(data))
      setAccessToken(data.accessToken)
      setMsg('Logged in — access token stored in memory. Refresh token is stored in HttpOnly cookie.')
    } catch (err) {
      setMsg('Network error')
    }
  }

  return (
    <form onSubmit={submit}>
      <div>
        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
      <div>{msg}</div>
    </form>
  )
}
