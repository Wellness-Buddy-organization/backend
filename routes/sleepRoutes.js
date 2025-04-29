const express = require('express');
const router = express.Router();
const sleepController = require('../controllers/sleepController');
const auth = require('../middleware/auth');

router.post('/', auth, sleepController.logSleep);
router.get('/', auth, sleepController.getSleepHistory);

module.exports = router;
