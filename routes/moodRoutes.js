const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const moodController = require('../controllers/moodController');

router.post('/', auth, moodController.createMood);
router.get('/', auth, moodController.getMoodHistory);

module.exports = router;

