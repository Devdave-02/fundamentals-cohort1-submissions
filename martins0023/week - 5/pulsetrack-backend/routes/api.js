const express = require('express');
const router = express.Router();

// Import controllers
const userController = require('../controllers/userController');
const activityController = require('../controllers/activityController');
const mealController = require('../controllers/mealController');
const doctorController = require('../controllers/doctorController');
const appointmentController = require('../controllers/appointmentController');
const reportController = require('../controllers/reportController');

// === User Routes ===
router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);

// === Doctor Routes ===
router.post('/doctors', doctorController.createDoctor);
router.get('/doctors', doctorController.getAllDoctors);

// === Activity Routes ===
router.post('/activities', activityController.createActivity);
router.get('/activities/user/:userId', activityController.getActivitiesByUser);

// === Meal Routes ===
router.post('/meals', mealController.createMeal);
router.get('/meals/user/:userId', mealController.getMealsByUser);

// === Appointment Routes ===
router.post('/appointments', appointmentController.createAppointment);
router.get('/appointments/user/:userId', appointmentController.getAppointmentsByUser);

// === Report Routes ===
router.post('/reports', reportController.generateReport);
router.get('/reports/user/:userId', reportController.getReportsByUser);
router.get('/reports/:id', reportController.getReportById); // <-- ADD THIS LINE

module.exports = router;