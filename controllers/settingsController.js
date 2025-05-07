const UserSettings = require('../models/UserSettings');

// Get user settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await UserSettings.findOne({ userId: req.user._id });
    
    if (!settings) {
      // Create default settings if none exist
      settings = new UserSettings({
        userId: req.user._id,
        animationsEnabled: true,
        notificationsEnabled: true,
        darkMode: false,
      });
      await settings.save();
    }
    
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
};

// Update user settings
exports.updateSettings = async (req, res) => {
  try {
    const { animationsEnabled, notificationsEnabled, darkMode } = req.body;
    
    const settings = await UserSettings.findOneAndUpdate(
      { userId: req.user._id },
      { animationsEnabled, notificationsEnabled, darkMode },
      { new: true, upsert: true }
    );
    
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
};