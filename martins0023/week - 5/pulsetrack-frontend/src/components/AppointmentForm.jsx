import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';

const AppointmentForm = ({ userId, onNewAppointment }) => {
  const [doctors, setDoctors] = useState([]); // To populate dropdown
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState(null);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const res = await apiService.getDoctors();
        setDoctors(res.data);
        if (res.data.length > 0) {
          setSelectedDoctor(res.data[0]._id); // Default to first doctor
        }
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      }
      setLoadingDoctors(false);
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('Please select a user first.');
      return;
    }
    if (!selectedDoctor) {
      setError('Please select a doctor.');
      return;
    }

    try {
      setError(null);
      const appointmentData = {
        user: userId,
        doctor: selectedDoctor,
        date,
        reason,
      };
      await apiService.createAppointment(appointmentData);
      
      onNewAppointment(); // Trigger refresh
      
      // Clear form
      setDate('');
      setReason('');
    } catch (err) {
      setError('Failed to create appointment.');
    }
  };

  return (
    <div className="form-container">
      <h3>Book New Appointment</h3>
      <form onSubmit={handleSubmit}>
        <label>Doctor:</label>
        <select 
          value={selectedDoctor} 
          onChange={(e) => setSelectedDoctor(e.target.value)} 
          disabled={loadingDoctors || doctors.length === 0}
        >
          {loadingDoctors && <option>Loading doctors...</option>}
          {doctors.length === 0 && !loadingDoctors && <option>No doctors available</option>}
          {doctors.map(doc => (
            <option key={doc._id} value={doc._id}>
              Dr. {doc.name} ({doc.specialty})
            </option>
          ))}
        </select>
        
        <label>Date and Time:</label>
        <input 
          type="datetime-local" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
        
        <label>Reason for Visit:</label>
        <input 
          type="text" 
          placeholder="e.g., Annual Checkup" 
          value={reason} 
          onChange={(e) => setReason(e.target.value)} 
          required 
        />
        
        <button type="submit" disabled={!userId || doctors.length === 0}>
          Book Appointment
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};
export default AppointmentForm;