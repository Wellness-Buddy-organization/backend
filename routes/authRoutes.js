const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/userController');

// Google Auth Route
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// Google Auth Callback Route
router.get(
  '/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false,
  }),
  userController.googleAuthCallback
);

module.exports = router;