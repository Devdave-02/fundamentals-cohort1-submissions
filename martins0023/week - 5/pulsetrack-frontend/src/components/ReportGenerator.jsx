import React, { useState } from 'react';
import apiService from '../api/apiService';

const ReportGenerator = ({ userId, onReportGenerated }) => {
  const [title, setTitle] = useState('Weekly Report');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('Please select a user.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const reportData = { user: userId, title, startDate, endDate };
      await apiService.generateReport(reportData);
      onReportGenerated(); // Refresh the list
    } catch (err) {
      setError('Failed to generate report.');
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h3>Generate New Report</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Report Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        <button type="submit" disabled={!userId || loading}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};
export default ReportGenerator;