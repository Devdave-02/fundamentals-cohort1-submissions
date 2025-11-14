import React from 'react';
import './ReportModal.css'; // We'll add CSS for this

const ReportModal = ({ report, onClose }) => {
  if (!report) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>{report.title}</h2>
        <p><i>{new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}</i></p>

        <h3>Summary</h3>
        <div className="summary-grid">
          <div>
            <strong>Avg. Daily Calories</strong>
            <p>{report.summary.averageDailyCalories}</p>
          </div>
          <div>
            <strong>Total Calories Burned</strong>
            <p>{report.summary.totalCaloriesBurned}</p>
          </div>
        </div>

        {/* Note: The 'report' object must be populated from the backend */}
        {/* Our controller already does this, but for list view, we might need a separate GET /reports/:id */}
        
        <h4>Activities Logged ({report.activities.length})</h4>
        {/* // For a fully detailed view, you'd fetch the report by ID
          // For this example, we'll assume the list view is enough.
        */}
        <p>{report.activities.length} activities logged.</p>
        
        <h4>Meals Logged ({report.meals.length})</h4>
        <p>{report.meals.length} meals logged.</p>
        
        <h4>Appointments ({report.appointments.length})</h4>
        <p>{report.appointments.length} appointments.</p>
        
      </div>
    </div>
  );
};
export default ReportModal;