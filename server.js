const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const passport = require("./config/passport");
const rateLimit = require("express-rate-limit");

// Import routes
const userRoutes = require("./routes/userRoutes");
const statRoutes = require("./routes/statRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const moodRoutes = require("./routes/moodRoutes");
const sleepRoutes = require("./routes/sleepRoutes");
const workRoutes = require("./routes/workRoutes");
const hydrationRoutes = require("./routes/hydrationRoutes");
const breakRoutes = require("./routes/breakRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Initialize Passport
app.use(passport.initialize());

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting for all API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use("/api/", apiLimiter);

// Route mounting
app.use("/api/users", userRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/sleep", sleepRoutes);
app.use("/api/work", workRoutes);
app.use("/api/hydration", hydrationRoutes);
app.use("/api/break", breakRoutes);
app.use("/api/reminder", reminderRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
