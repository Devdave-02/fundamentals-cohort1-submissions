import React, { useState, useEffect } from 'react';
import { appointmentAPI, userAPI } from '../services/api';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    userId: '',
    doctorId: '',
    doctorName: '',
    doctorSpecialization: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchUsers();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getAll();
      setAppointments(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch appointments: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // For demo purposes, we'll create a mock doctor ID
      // In a real app, you'd have a doctor selection
      const appointmentData = {
        ...formData,
        doctorId: '507f1f77bcf86cd799439011' // Mock doctor ID
      };
      
      await appointmentAPI.create(appointmentData);
      setSuccess('Appointment created successfully!');
      setFormData({
        userId: '',
        doctorId: '',
        doctorName: '',
        doctorSpecialization: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        notes: ''
      });
      fetchAppointments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create appointment: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentAPI.delete(id);
        setSuccess('Appointment deleted successfully!');
        fetchAppointments();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete appointment: ' + err.message);
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await appointmentAPI.update(id, { status: newStatus });
      setSuccess('Appointment status updated!');
      fetchAppointments();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update appointment: ' + err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return '#646cff';
      case 'completed':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      case 'rescheduled':
        return '#ff9800';
      default:
        return '#888';
    }
  };

  if (loading) return <div className="loading">Loading appointments...</div>;

  return (
    <div>
      <h1 className="page-title">Appointment Management</h1>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="form-container">
        <h2>Schedule New Appointment</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Patient *</label>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
              >
                <option value="">Select Patient</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Doctor Name *</label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                placeholder="Dr. Smith"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Specialization *</label>
              <input
                type="text"
                name="doctorSpecialization"
                value={formData.doctorSpecialization}
                onChange={handleChange}
                placeholder="Cardiologist"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Time *</label>
              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Reason for Visit *</label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Regular checkup"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Additional information..."
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            Schedule Appointment
          </button>
        </form>
      </div>

      <h2>All Appointments ({appointments.length})</h2>
      {appointments.length === 0 ? (
        <div className="empty-state">
          <h3>No appointments found</h3>
          <p>Schedule your first appointment using the form above</p>
        </div>
      ) : (
        <div className="list">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Appointment with {appointment.doctorId?.name || 'Doctor'}</h3>
                <span 
                  style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '4px',
                    backgroundColor: getStatusColor(appointment.status),
                    color: 'white',
                    fontSize: '0.875em'
                  }}
                >
                  {appointment.status.toUpperCase()}
                </span>
              </div>
              <p><strong>Patient:</strong> {appointment.userId?.name || 'Unknown'}</p>
              <p><strong>Specialization:</strong> {appointment.doctorId?.specialization || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {appointment.appointmentTime}</p>
              <p><strong>Reason:</strong> {appointment.reason}</p>
              {appointment.notes && (
                <p><strong>Notes:</strong> {appointment.notes}</p>
              )}
              <p><strong>Created:</strong> {new Date(appointment.createdAt).toLocaleDateString()}</p>
              
              <div className="item-actions">
                {appointment.status === 'scheduled' && (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                      className="btn"
                      style={{ backgroundColor: '#4caf50', color: 'white' }}
                    >
                      Complete
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                      className="btn"
                      style={{ backgroundColor: '#ff9800', color: 'white' }}
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button 
                  onClick={() => handleDelete(appointment._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Appointments;
