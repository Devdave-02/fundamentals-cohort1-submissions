import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';

const AppointmentList = ({ userId, refreshKey }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setAppointments([]);
      return;
    }
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        // The API populates the doctor details for us
        const res = await apiService.getAppointmentsByUser(userId);
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchAppointments();
  }, [userId, refreshKey]);

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className="list-container">
      <h3>Upcoming Appointments</h3>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul>
          {appointments.map(apt => (
            <li key={apt._id}>
              <div>
                <strong>{apt.reason}</strong>
                {/* Check if doctor was populated correctly */}
                <small>with {apt.doctor ? `Dr. ${apt.doctor.name}` : 'Unknown Doctor'}</small>
              </div>
              <small>{new Date(apt.date).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default AppointmentList;