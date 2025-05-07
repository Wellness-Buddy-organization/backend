const Challenge = require('../models/Challenge');

// Get user's active challenges
exports.getActiveChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ 
      userId: req.user._id,
      completed: false
    }).sort({ startDate: -1 });
    
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching challenges', error: error.message });
  }
};

// Create a new challenge
exports.createChallenge = async (req, res) => {
  try {
    const { title, description, category, total, reward } = req.body;
    
    const challenge = new Challenge({
      userId: req.user._id,
      title,
      description,
      category,
      total,
      reward,
      progress: 0,
      completed: false,
    });
    
    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Error creating challenge', error: error.message });
  }
};

// Update challenge progress
exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    
    const challenge = await Challenge.findOne({ _id: id, userId: req.user._id });
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    challenge.progress = progress;
    
    // Check if challenge is completed
    if (progress >= challenge.total && !challenge.completed) {
      challenge.completed = true;
      
      // This would be a good place to generate an achievement
      // For now, just mark the challenge as completed
    }
    
    await challenge.save();
    res.status(200).json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Error updating challenge', error: error.message });
  }
};