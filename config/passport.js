const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const path = require('path');

// Load environment variables based on NODE_ENV
const dotenv = require('dotenv');
const envPath = process.env.NODE_ENV === 'production' 
  ? path.resolve(__dirname, '../.env.production')
  : path.resolve(__dirname, '../.env.development');

dotenv.config({ path: envPath });

// Debug: Add these console logs to verify env variables are loaded
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Google Client ID exists:', !!process.env.GOOGLE_CLIENT_ID);
console.log('Google Callback URL:', process.env.GOOGLE_CALLBACK_URL);

// Check if required variables exist
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Missing required Google OAuth environment variables!');
  throw new Error('Missing required Google OAuth environment variables!');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'] // Add required scopes
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists by Google ID or email
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            // Link Google ID to existing user
            user.googleId = profile.id;
            await user.save();
          }
        }

        if (!user) {
          // Create new user if none exists
          user = new User({
            googleId: profile.id,
            fullName: profile.displayName,
            email: profile.emails[0].value,
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Add these serialization methods which are necessary for passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;