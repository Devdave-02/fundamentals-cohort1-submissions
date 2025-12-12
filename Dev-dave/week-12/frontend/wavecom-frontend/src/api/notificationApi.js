const BASE = 'http://localhost:3000/api/notifications';


export const createJob = (data) =>
fetch(BASE, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(data)
}).then(r => r.json());


export const fetchJobs = () => fetch(BASE).then(r => r.json());