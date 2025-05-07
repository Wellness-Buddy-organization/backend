const Achievement = require('../models/Achievement');

// Get user's achievements
exports.getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ 
      userId: req.user._id 
    }).sort({ date: -1 });
    
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching achievements', error: error.message });
  }
};

// Create a new achievement (typically called internally)
exports.createAchievement = async (req, res) => {
  try {
    const { title, description, icon } = req.body;
    
    const achievement = new Achievement({
      userId: req.user._id,
      title,
      description,
      icon,
      date: new Date(),
    });
    
    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ message: 'Error creating achievement', error: error.message });
  }
};