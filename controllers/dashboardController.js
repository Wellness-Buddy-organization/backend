// controllers/dashboardController.js

const Mood = require('../models/Mood');
const Sleep = require('../models/Sleep');
const Hydration = require('../models/Hydration');
const Work = require('../models/Work');
const Break = require('../models/Break');
const Reminder = require('../models/Reminder');
const User = require('../models/User');

/**
 * Get dashboard data for the authenticated user
 * Fetches all wellness metrics and aggregates them for dashboard display
 */
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Get data for the last 7 days

    // Fetch user data
    const user = await User.findById(userId).select('fullName email');

    // Fetch all wellness data for the last 7 days
    const [moodData, sleepData, hydrationData, workData, breakData, reminders] = await Promise.all([
      Mood.find({
        userId,
        date: { $gte: startDate },
      }).sort({ date: 1 }),
      
      Sleep.find({
        userId,
        date: { $gte: startDate },
      }).sort({ date: 1 }),
      
      Hydration.find({
        userId,
        date: { $gte: startDate },
      }).sort({ date: 1 }),
      
      Work.find({
        userId,
        date: { $gte: startDate },
      }).sort({ date: 1 }),
      
      Break.find({
        userId,
        date: { $gte: startDate },
      }).sort({ date: 1 }),
      
      Reminder.find({
        userId,
        enabled: true
      }).sort({ time: 1 }).limit(3) // Get top 3 upcoming reminders
    ]);

    // Calculate wellness score
    const wellnessScore = calculateWellnessScore(moodData, sleepData, hydrationData, workData);

    res.status(200).json({
      user: {
        fullName: user.fullName,
        email: user.email
      },
      wellness: {
        mood: moodData,
        sleep: sleepData,
        hydration: hydrationData,
        work: workData,
        breaks: breakData,
        score: wellnessScore
      },
      reminders: reminders.map(reminder => ({
        id: reminder._id,
        type: reminder.type,
        time: reminder.time,
        message: reminder.message || getDefaultMessage(reminder.type),
      }))
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ 
      message: 'Error fetching dashboard data', 
      error: error.message 
    });
  }
};

/**
 * Helper function to calculate wellness score based on all metrics
 * @param {Array} moodData - Mood entries
 * @param {Array} sleepData - Sleep entries
 * @param {Array} hydrationData - Hydration entries
 * @param {Array} workData - Work entries
 * @returns {Number} Wellness score (0-100)
 */
function calculateWellnessScore(moodData, sleepData, hydrationData, workData) {
  let score = 0;
  let factors = 0;
  
  // Add mood score (1-5 scale to 0-20 scale)
  if (moodData && moodData.length > 0) {
    const moodMap = { 'happy': 5, 'neutral': 4, 'anxious': 3, 'sad': 2, 'angry': 1 };
    const sum = moodData.reduce((acc, entry) => {
      return acc + (moodMap[entry.mood] || 3);
    }, 0);
    
    score += (sum / moodData.length) * 4;
    factors++;
  }
  
  // Add sleep score (compare to ideal 7-9 hours)
  if (sleepData && sleepData.length > 0) {
    const avgSleep = sleepData.reduce((acc, entry) => acc + entry.hours, 0) / sleepData.length;
    // 8 hours is optimal (20 points), less than 6 or more than 10 is poor (5 points)
    const sleepScore = avgSleep >= 7 && avgSleep <= 9 
      ? 20 
      : (avgSleep >= 6 && avgSleep <= 10 ? 15 : 5);
    score += sleepScore;
    factors++;
  }
  
  // Add hydration score (ideal is 2-3L)
  if (hydrationData && hydrationData.length > 0) {
    const avgGlasses = hydrationData.reduce((acc, entry) => acc + entry.glasses, 0) / hydrationData.length;
    // Convert glasses to liters (1 glass = 0.25L)
    const liters = avgGlasses * 0.25;
    const hydrationScore = liters >= 2 ? 20 : (liters >= 1 ? 15 : 5);
    score += hydrationScore;
    factors++;
  }
  
  // Add work balance score (ideal is 7-8 hours)
  if (workData && workData.length > 0) {
    const avgWork = workData.reduce((acc, entry) => acc + entry.hours, 0) / workData.length;
    // Work balance: 7-8 hours is optimal, >10 or <4 is poor
    const workScore = (avgWork >= 7 && avgWork <= 8) 
      ? 20 
      : (avgWork > 10 || avgWork < 4) ? 5 : 15;
    score += workScore;
    factors++;
  }
  
  // Calculate average and round to nearest whole number
  return Math.round(factors > 0 ? score / factors : 0);
}

/**
 * Helper function to get default reminder messages based on type
 * @param {String} type - Reminder type
 * @returns {String} Default message for that reminder type
 */
function getDefaultMessage(type) {
  const messages = {
    'water': 'Time to hydrate!',
    'meal': 'Time for a healthy meal',
    'eye_rest': 'Take a break and rest your eyes',
    'stretch': 'Time for a quick stretch',
    'posture': 'Check your posture',
    'meditation': 'Take a moment to meditate'
  };
  
  return messages[type] || 'Wellness reminder';
}