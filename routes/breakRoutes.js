const express = require('express');
const router = express.Router();
const breakController = require('../controllers/breakController');
const auth = require('../middleware/auth');

router.post('/', auth, breakController.logBreak);
router.get('/', auth, breakController.getBreakHistory);

module.exports = router;
