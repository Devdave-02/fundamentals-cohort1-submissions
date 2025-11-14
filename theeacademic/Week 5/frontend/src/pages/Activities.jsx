import React, { useState, useEffect } from 'react';
import { activityAPI, userAPI } from '../services/api';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    userId: '',
    activityType: 'running',
    duration: '',
    caloriesBurned: '',
    distance: '',
    notes: ''
  });

  useEffect(() => {
    fetchActivities();
    fetchUsers();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await activityAPI.getAll();
      setActivities(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch activities: ' + err.message);
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
      await activityAPI.create(formData);
      setSuccess('Activity created successfully!');
      setFormData({
        userId: '',
        activityType: 'running',
        duration: '',
        caloriesBurned: '',
        distance: '',
        notes: ''
      });
      fetchActivities();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create activity: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activityAPI.delete(id);
        setSuccess('Activity deleted successfully!');
        fetchActivities();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete activity: ' + err.message);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <div className="loading">Loading activities...</div>;

  return (
    <div>
      <h1 className="page-title">Activity Tracking</h1>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="form-container">
        <h2>Log New Activity</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>User *</label>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Activity Type *</label>
              <select
                name="activityType"
                value={formData.activityType}
                onChange={handleChange}
                required
              >
                <option value="running">Running</option>
                <option value="walking">Walking</option>
                <option value="cycling">Cycling</option>
                <option value="swimming">Swimming</option>
                <option value="gym">Gym</option>
                <option value="yoga">Yoga</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Duration (minutes) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label>Calories Burned</label>
              <input
                type="number"
                name="caloriesBurned"
                value={formData.caloriesBurned}
                onChange={handleChange}
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label>Distance (km)</label>
              <input
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                min="0"
                step="0.1"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <button type="submit" className="btn btn-primary">
            Log Activity
          </button>
        </form>
      </div>

      <h2>All Activities ({activities.length})</h2>
      {activities.length === 0 ? (
        <div className="empty-state">
          <h3>No activities found</h3>
          <p>Log your first activity using the form above</p>
        </div>
      ) : (
        <div className="list">
          {activities.map((activity) => (
            <div key={activity._id} className="item">
              <h3>
                {activity.activityType.charAt(0).toUpperCase() + activity.activityType.slice(1)}
              </h3>
              <p><strong>User:</strong> {activity.userId?.name || 'Unknown'}</p>
              <p><strong>Duration:</strong> {activity.duration} minutes</p>
              {activity.caloriesBurned && (
                <p><strong>Calories:</strong> {activity.caloriesBurned} kcal</p>
              )}
              {activity.distance && (
                <p><strong>Distance:</strong> {activity.distance} km</p>
              )}
              {activity.notes && (
                <p><strong>Notes:</strong> {activity.notes}</p>
              )}
              <p><strong>Date:</strong> {new Date(activity.date).toLocaleString()}</p>
              <div className="item-actions">
                <button 
                  onClick={() => handleDelete(activity._id)}
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

export default Activities;
