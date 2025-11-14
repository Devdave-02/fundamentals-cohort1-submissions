import React, { useState } from 'react';
import apiService from '../api/apiService';

// We pass `userId` and `onNewActivity` (to refresh the list) as props
const ActivityForm = ({ userId, onNewActivity }) => {
  const [type, setType] = useState('Running');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('Please select a user first.');
      return;
    }
    try {
      setError(null);
      const activityData = { user: userId, type, duration, caloriesBurned };
      await apiService.createActivity(activityData);
      onNewActivity(); // Trigger refresh
      // Clear form
      setDuration('');
      setCaloriesBurned('');
    } catch (err) {
      setError('Failed to create activity.');
    }
  };

  return (
    <div className="form-container">
      <h3>Log New Activity</h3>
      <form onSubmit={handleSubmit}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Running</option>
          <option>Cycling</option>
          <option>Weightlifting</option>
          <option>Yoga</option>
          <option>Walking</option>
        </select>
        <input type="number" placeholder="Duration (mins)" value={duration} onChange={(e) => setDuration(e.target.value)} required />
        <input type="number" placeholder="Calories Burned" value={caloriesBurned} onChange={(e) => setCaloriesBurned(e.target.value)} required />
        <button type="submit" disabled={!userId}>Log Activity</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};
export default ActivityForm;