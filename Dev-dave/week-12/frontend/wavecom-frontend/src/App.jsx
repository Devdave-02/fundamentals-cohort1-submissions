import { useEffect, useState } from 'react';
import { createJob, fetchJobs } from './api/notificationApi';
import NotificationForm from './components/notificationForm';
import JobList from './components/jobList';
import { useRef } from 'react';

export default function App() {
  const [jobs, setJobs] = useState([]);
  const pollingRef = useRef(null);

  async function loadJobs() {
    try {
      const data = await fetchJobs();
      setJobs(data);
    } catch (err) {
      console.error('Failed to load jobs', err);
    }
  }

  useEffect(() => {
    loadJobs();
    // Poll every 2 seconds
    pollingRef.current = setInterval(loadJobs, 2000);
    return () => clearInterval(pollingRef.current);
  }, []);

  async function handleSend(payload) {
    try {
      const { jobId } = await createJob(payload);
      // Optimistically add to UI
      setJobs(prev => [{ jobId, ...payload, status: 'queued', attempts: 0, createdAt: new Date().toISOString() }, ...prev]);
    } catch (err) {
      console.error('Send failed', err);
      alert('Failed to send notification');
    }
  }

  return (
    <div className="container">
      <h1>WaveCom Dashboard</h1>
      <NotificationForm onSent={handleSend} />
      <h2>Recent Jobs</h2>
      <JobList jobs={jobs} />
    </div>
  );
}
