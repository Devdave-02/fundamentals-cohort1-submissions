import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';

// Note: No `userId` prop needed
const DoctorList = ({ refreshKey }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const res = await apiService.getDoctors();
        setDoctors(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchDoctors();
  }, [refreshKey]); // Only refetches when a new doctor is added

  if (loading) return <p>Loading doctors...</p>;

  return (
    <div className="list-container">
      <h3>Available Doctors</h3>
      {doctors.length === 0 ? (
        <p>No doctors found. Add one using the form.</p>
      ) : (
        <ul>
          {doctors.map(doc => (
            <li key={doc._id}>
              <div>
                <strong>Dr. {doc.name}</strong>
                <small>{doc.specialty}</small>
              </div>
              <small>{doc.clinicAddress}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default DoctorList;