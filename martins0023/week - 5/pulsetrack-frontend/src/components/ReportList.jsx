import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';

// `onViewReport` is a function passed from App.jsx to open the modal
const ReportList = ({ userId, refreshKey, onViewReport }) => {
  const [reports, setReports] = useState([]);
  
  useEffect(() => {
    if (!userId) {
      setReports([]);
      return;
    }
    const fetchReports = async () => {
      try {
        const res = await apiService.getReportsByUser(userId);
        setReports(res.data);
      } catch (err) { console.error(err); }
    };
    fetchReports();
  }, [userId, refreshKey]);

  return (
    <div className="list-container">
      <h3>Generated Reports</h3>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <ul>
          {reports.map(report => (
            <li key={report._id} className="report-item">
              <strong>{report.title}</strong>
              <small>{new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}</small>
              <button onClick={() => onViewReport(report._id)}>View Details</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default ReportList;