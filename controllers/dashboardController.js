const Mood = require('../models/Mood');
const Sleep = require('../models/Sleep');
const Hydration = require('../models/Hydration');
const Work = require('../models/Work');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); 

    // Fetch wellness data for the last 7 days
    const moodData = await Mood.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    const sleepData = await Sleep.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    const hydrationData = await Hydration.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    const workData = await Work.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    res.status(200).json({
      user: {
        fullName: req.user.fullName,
      },
      wellness: {
        mood: moodData,
        sleep: sleepData,
        hydration: hydrationData,
        work: workData,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};