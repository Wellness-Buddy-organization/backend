const Reminder = require("../models/Reminder");

// Create a new reminder
exports.createReminder = async (req, res) => {
  const { type, time, enabled } = req.body;
  const reminder = new Reminder({
    userId: req.user._id,
    type,
    time,
    enabled: enabled !== undefined ? enabled : true,
  });
  await reminder.save();
  res.status(201).json(reminder);
};

// Update controllers/reminderController.js by adding this method

/**
 * Get all reminders for the user (with optional pagination and filtering)
 */
exports.getReminders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Query options
    const query = { userId: req.user._id };
    
    // Filter for upcoming reminders
    if (req.query.upcoming === 'true') {
      // Get current day of week (0 = Sunday, 1 = Monday, etc.)
      const today = new Date();
      const currentDay = today.getDay();
      const currentTime = today.getHours() * 60 + today.getMinutes(); // Current time in minutes
      
      // Convert day index to day string for query
      const dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      const currentDayString = dayMap[currentDay];
      
      // Only include reminders for today that haven't occurred yet,
      // or reminders for future days
      query.enabled = true;
      
      // Filter by day - include current day and future days
      query.days = { $in: [currentDayString] };
      
      // For today's reminders, only include those that haven't occurred yet
      if (req.query.onlyFuture === 'true') {
        // Parse time string to minutes for comparison
        query.$or = [
          {
            days: { $in: [currentDayString] },
            $expr: {
              $gt: [
                {
                  $add: [
                    { $multiply: [{ $toInt: { $substr: ["$time", 0, 2] } }, 60] },
                    { $toInt: { $substr: ["$time", 3, 2] } }
                  ]
                },
                currentTime
              ]
            }
          },
          {
            days: { $nin: [currentDayString] } // Reminders for other days
          }
        ];
      }
    }
    
    // Sort by time
    const reminders = await Reminder.find(query)
      .sort({ time: 1 })
      .skip(skip)
      .limit(limit);

    res.json(reminders);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching reminders', 
      error: error.message 
    });
  }
};

// Get all reminders for the user (with optional pagination)
exports.getReminders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const reminders = await Reminder.find({ userId: req.user._id })
    .sort({ time: 1 })
    .skip(skip)
    .limit(limit);

  res.json(reminders);
};

// Update a reminder
exports.updateReminder = async (req, res) => {
  const { id } = req.params;
  const { type, time, enabled } = req.body;
  const updated = await Reminder.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { type, time, enabled },
    { new: true }
  );
  if (!updated) {
    return res.status(404).json({ message: "Reminder not found" });
  }
  res.json(updated);
};

// Delete a reminder
exports.deleteReminder = async (req, res) => {
  const { id } = req.params;
  const deleted = await Reminder.findOneAndDelete({
    _id: id,
    userId: req.user._id,
  });
  if (!deleted) {
    return res.status(404).json({ message: "Reminder not found" });
  }
  res.json({ message: "Reminder deleted" });
};
