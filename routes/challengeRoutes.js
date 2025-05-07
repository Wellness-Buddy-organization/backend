const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const auth = require('../middleware/auth');

router.get('/', auth, challengeController.getActiveChallenges);
router.post('/', auth, challengeController.createChallenge);
router.put('/:id/progress', auth, challengeController.updateProgress);

module.exports = router;