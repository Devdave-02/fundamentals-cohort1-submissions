import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// === User ===
export const getUsers = () => API.get('/users');
export const createUser = (userData) => API.post('/users', userData);

// === Doctor ===
export const getDoctors = () => API.get('/doctors');
export const createDoctor = (doctorData) => API.post('/doctors', doctorData);

// === Activity ===
export const getActivitiesByUser = (userId) => API.get(`/activities/user/${userId}`);
export const createActivity = (activityData) => API.post('/activities', activityData);

// === Meal ===
export const getMealsByUser = (userId) => API.get(`/meals/user/${userId}`);
export const createMeal = (mealData) => API.post('/meals', mealData);

// === Appointment ===
export const getAppointmentsByUser = (userId) => API.get(`/appointments/user/${userId}`);
export const createAppointment = (appointmentData) => API.post('/appointments', appointmentData);

// === Report ===
export const getReportsByUser = (userId) => API.get(`/reports/user/${userId}`);
export const generateReport = (reportData) => API.post('/reports', reportData);

export const getReportById = (reportId) => API.get(`/reports/${reportId}`);

export const getAppointmentsForUser = (userId) =>
  API.get(`/appointments/user/${userId}`);

// Export all as a default object
const apiService = {
  getUsers,
  getAppointmentsForUser,
  createUser,
  getDoctors,
  createDoctor,
  getActivitiesByUser,
  createActivity,
  getMealsByUser,
  createMeal,
  getAppointmentsByUser,
  createAppointment,
  getReportsByUser,
  generateReport,
  getReportById
};

export default apiService;