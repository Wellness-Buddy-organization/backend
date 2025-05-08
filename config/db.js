const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MongoDB URI exists
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not defined in environment variables');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('MongoDB connected successfully');  
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;