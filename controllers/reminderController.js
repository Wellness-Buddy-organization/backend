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
