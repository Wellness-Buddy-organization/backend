const express = require('express');
const router = express.Router();
const workController = require('../controllers/workController');
const auth  = require('../middleware/auth');

router.post('/', auth, workController.logWork);
router.get('/', auth, workController.getWorkHistory);

module.exports = router;
