const Stat = require('../models/Stat');

exports.getStats = async (req, res) => {
  try {
    let stats = await Stat.findOne();
    if (!stats) {
      stats = new Stat({
        users: 1000,
        programs: 50,
        reminders: 5000,
      });
      await stats.save();
    }
    res.json({
      users: stats.users,
      programs: stats.programs,
      reminders: stats.reminders,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};