const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor'); // <-- 1. Import Doctor model

// @desc    Create a new appointment for a user
// @route   POST /api/appointments
exports.createAppointment = async (req, res) => {
  try {
    const { user, doctor, date, reason } = req.body;

    // Check if user exists
    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const newAppointment = new Appointment({
      user,
      doctor,
      date,
      reason
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get all appointments for a specific user
// @route   GET /api/appointments/user/:userId
exports.getAppointmentsByUser = async (req, res) => {
  try {
    // 5. Updated this function to correctly populate the doctor's details
    const appointments = await Appointment.find({ user: req.params.userId })
      .populate('user', 'username') // Keep user populate
      .populate('doctor', 'name specialty') // <-- Add doctor populate
      .sort({ date: -1 });

    // This check is fine, find() returns an empty array, not null
    if (!appointments) {
      return res.status(404).json({ message: 'No appointments found for this user' });
    }
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};