import React, { useState, useEffect } from 'react';
import apiService from '../api/apiService';

const ActivityList = ({ userId, refreshKey }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setActivities([]);
      return;
    }
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const res = await apiService.getActivitiesByUser(userId);
        setActivities(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchActivities();
  }, [userId, refreshKey]); // `refreshKey` is a simple prop that changes to trigger a refetch

  if (loading) return <p>Loading activities...</p>;

  return (
    <div className="list-container">
      <h3>Activity Log</h3>
      {activities.length === 0 ? (
        <p>No activities found.</p>
      ) : (
        <ul>
          {activities.map(act => (
            <li key={act._id}>
              <strong>{act.type}</strong> - {act.duration} mins ({act.caloriesBurned} kcal)
              <small>{new Date(act.date).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default ActivityList;