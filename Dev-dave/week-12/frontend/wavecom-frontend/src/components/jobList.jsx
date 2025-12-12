export default function JobList({ jobs }) {
  return (
    <table className="job-table">
      <thead>
        <tr>
          <th>JobId</th>
          <th>Channel</th>
          <th>Recipient</th>
          <th>Status</th>
          <th>Attempts</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map(j => (
          <tr key={j.jobId}>
            <td className="mono">{j.jobId}</td>
            <td>{j.channel}</td>
            <td>{j.recipient}</td>
            <td>{j.status}</td>
            <td>{j.attempts}</td>
            <td>{new Date(j.createdAt).toLocaleTimeString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
