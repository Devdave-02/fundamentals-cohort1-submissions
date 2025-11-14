const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getUpcomingAppointments
} = require('../controllers/appointmentController');

// Appointment routes
router.route('/')
  .get(getAllAppointments)
  .post(createAppointment);

router.route('/:id')
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment);

router.route('/upcoming/:userId')
  .get(getUpcomingAppointments);

module.exports = router;
