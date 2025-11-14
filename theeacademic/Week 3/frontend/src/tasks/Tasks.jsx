import React, { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'

function decodeRole(token) {
  if (!token) return null
  try {
    const p = jwtDecode(token)
    return p.role
  } catch (e) {
    return null
  }
}

export default function Tasks({ accessToken, setAccessToken }) {
  const [tasks, setTasks] = useState([])
  const [role, setRole] = useState(null)
  const [title, setTitle] = useState('')

  useEffect(() => {
    setRole(decodeRole(accessToken))
  }, [accessToken])

  async function load() {
    try {
      const res = await fetch('/api/tasks', { headers: { Authorization: 'Bearer ' + accessToken } })
      if (res.status === 401) {
        // try refresh
        const r = await fetch('/api/auth/refresh', { method: 'POST' })
        const d = await r.json()
        if (r.ok) {
          setAccessToken(d.accessToken)
          return
        }
      }
      const data = await res.json()
      setTasks(data.tasks || [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { load() }, [accessToken])

  async function create(e) {
    e.preventDefault()
    try {
      const res = await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + accessToken }, body: JSON.stringify({ title }) })
      if (res.ok) { setTitle(''); load() }
    } catch (e) { console.error(e) }
  }

  async function del(id) {
    try {
      const res = await fetch('/api/tasks/' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + accessToken } })
      if (res.ok) load()
      else alert('Delete failed')
    } catch (e) { console.error(e) }
  }

  return (
    <div>
      <h3>Tasks</h3>
      <form onSubmit={create}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New task title" />
        <button type="submit">Create</button>
      </form>
      <ul>
        {tasks.map(t => (
          <li key={t._id}>
            <strong>{t.title}</strong> - {t.description}
            {role === 'admin' && <button onClick={() => del(t._id)}>Delete</button>}
          </li>
        ))}
      </ul>
    </div>
  )
}
