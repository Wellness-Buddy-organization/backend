const express = require('express');
const router = express.Router();
const statController = require('../controllers/statController');

// Get Stats Route
router.get('/', statController.getStats);

module.exports = router;