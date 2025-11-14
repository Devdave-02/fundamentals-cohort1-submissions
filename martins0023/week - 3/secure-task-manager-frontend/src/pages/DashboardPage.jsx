import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const isAdmin = user && user.role === 'admin';

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks.');
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle) {
      setError('Task title cannot be empty.');
      return;
    }
    try {
      await api.post('/tasks', { title: newTaskTitle });
      setNewTaskTitle('');
      setError('');
      setMessage('Task created successfully!');
      setTimeout(() => setMessage(''), 3000);
      fetchTasks(); // Refresh list
    } catch (err) {
      setError('Failed to create task.');
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!isAdmin) {
      setError('You are not authorized to delete tasks.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        setMessage('Task deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
        fetchTasks(); // Refresh list
      } catch (err) {
        setError('Failed to delete task. You may not have permission.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.username}! (Role: {user?.role})</p>
      <button onClick={logout}>Logout</button>
      <hr />

      <h3>Create New Task</h3>
      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter task title"
        />
        <button type="submit">Add Task</button>
      </form>
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}

      <h3>Your Tasks</h3>
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task._id}>
              {task.title} (Status: {task.status})
              {isAdmin && <p><small>Created by: {task.user.username}</small></p>}
              {isAdmin && (
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              )}
            </li>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </ul>
    </div>
  );
};

export default DashboardPage;