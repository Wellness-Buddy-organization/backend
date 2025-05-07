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
    
    const breakData = await Break.find({
      userId,
      date: { $gte: startDate },
    }).sort({ date: 1 });

    // Calculate aggregated stats for wellness score
    const wellnessScore = calculateWellnessScore(moodData, sleepData, hydrationData, workData);

    res.status(200).json({
      user: {
        fullName: req.user.fullName,
        email: req.user.email
      },
      wellness: {
        mood: moodData,
        sleep: sleepData,
        hydration: hydrationData,
        work: workData,
        breaks: breakData,
        score: wellnessScore
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};

// Helper function to calculate wellness score based on the Dashboard.jsx logic
function calculateWellnessScore(moodData, sleepData, hydrationData, workData) {
  let score = 0;
  let factors = 0;
  
  // Add mood score (1-5 scale to 0-20 scale)
  if (moodData && moodData.length > 0) {
    const recentMood = moodData[0];
    // Convert mood string to number value
    const moodMap = { happy: 5, neutral: 4, anxious: 3, sad: 2, angry: 1 };
    const moodValue = moodMap[recentMood.mood] || 3;
    score += moodValue * 4; // Scale to 0-20
    factors++;
  }
  
  // Add sleep score (compare to ideal 7-9 hours)
  if (sleepData && sleepData.length > 0) {
    const recentSleep = sleepData[0];
    // 8 hours is optimal (20 points), less than 6 or more than 10 is poor (5 points)
    const sleepScore = recentSleep.hours >= 7 && recentSleep.hours <= 9 
      ? 20 
      : (recentSleep.hours >= 6 && recentSleep.hours <= 10 ? 15 : 5);
    score += sleepScore;
    factors++;
  }
  
  // Add hydration score (ideal is 2-3L)
  if (hydrationData && hydrationData.length > 0) {
    const recentHydration = hydrationData[0];
    // Convert glasses to liters (1 glass = 0.25L)
    const liters = recentHydration.glasses * 0.25;
    const hydrationScore = liters >= 2 ? 20 : (liters >= 1 ? 15 : 5);
    score += hydrationScore;
    factors++;
  }
  
  // Add work balance score (ideal is 7-8 hours)
  if (workData && workData.length > 0) {
    const recentWork = workData[0];
    // Work balance: 7-8 hours is optimal, >10 or <4 is poor
    const workScore = (recentWork.hours >= 7 && recentWork.hours <= 8) 
      ? 20 
      : (recentWork.hours > 10 || recentWork.hours < 4) ? 5 : 15;
    score += workScore;
    factors++;
  }
  
  // Calculate average and round to nearest whole number
  return Math.round(factors > 0 ? score / factors : 0);
}