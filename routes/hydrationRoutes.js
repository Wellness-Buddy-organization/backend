const express = require('express');
const router = express.Router();
const hydrationController = require('../controllers/hydrationController');
const auth = require('../middleware/auth');

router.post('/', auth, hydrationController.logHydration);
router.get('/', auth, hydrationController.getHydrationHistory);

module.exports = router;
