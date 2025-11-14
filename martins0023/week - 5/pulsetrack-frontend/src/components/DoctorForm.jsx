import React, { useState } from 'react';
import apiService from '../api/apiService';

// Note: No `userId` prop needed
const DoctorForm = ({ onNewDoctor }) => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const doctorData = { name, specialty, clinicAddress };
      await apiService.createDoctor(doctorData);
      
      onNewDoctor(); // Trigger refresh
      
      // Clear form
      setName('');
      setSpecialty('');
      setClinicAddress('');
    } catch (err) {
      setError('Failed to create doctor.');
    }
  };

  return (
    <div className="form-container">
      <h3>Add New Doctor</h3>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Doctor's Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Specialty (e.g., Cardiologist)" 
          value={specialty} 
          onChange={(e) => setSpecialty(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Clinic Address" 
          value={clinicAddress} 
          onChange={(e) => setClinicAddress(e.target.value)} 
        />
        <button type="submit">Add Doctor</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};
export default DoctorForm;