const Report = require('../models/Report');
const Activity = require('../models/Activity');
const Meal = require('../models/Meal');
const Appointment = require('../models/Appointment');

// @desc    Generate a new report for a user
// @route   POST /api/reports
exports.generateReport = async (req, res) => {
  try {
    const { user, title, startDate, endDate } = req.body;
    
    // 1. Find all related data within the date range
    const query = { user, date: { $gte: new Date(startDate), $lte: new Date(endDate) } };

    const activities = await Activity.find(query);
    const meals = await Meal.find(query);
    const appointments = await Appointment.find({ 
      user, 
      date: { $gte: new Date(startDate), $lte: new Date(endDate) } 
    });

    // 2. Perform aggregation
    const totalCaloriesBurned = activities.reduce((acc, act) => acc + act.caloriesBurned, 0);
    
    const totalCaloriesConsumed = meals.reduce((acc, meal) => acc + meal.totalCalories, 0);
    const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
    const averageDailyCalories = totalCaloriesConsumed / days;

    // 3. Create the summary object
    const summary = {
      totalCaloriesBurned: totalCaloriesBurned,
      averageDailyCalories: averageDailyCalories.toFixed(0),
      notes: `Report from ${startDate} to ${endDate}.`
    };

    // 4. Create and save the new report
    const newReport = new Report({
      user,
      title,
      startDate,
      endDate,
      activities: activities.map(a => a._id), // Store references
      meals: meals.map(m => m._id),
      appointments: appointments.map(a => a._id),
      summary
    });

    const savedReport = await newReport.save();
    
    // 5. Populate the report before sending it back
    const populatedReport = await Report.findById(savedReport._id)
      .populate('activities')
      .populate('meals')
      .populate('appointments');
      
    res.status(201).json(populatedReport);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get all reports for a user
// @route   GET /api/reports/user/:userId
exports.getReportsByUser = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.params.userId })
      .sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('user', 'username email') // Populate user details
      .populate('activities') // Populate all activities in the report
      .populate('meals')      // Populate all meals
      .populate('appointments'); // Populate all appointments

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};