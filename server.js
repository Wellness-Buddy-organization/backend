/**
 * Wellness Buddy Backend Server
 * Main application entry point that sets up Express server, middleware, and routes
 */

// ================ Dependencies ================
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

// ================ Environment Configuration ================
// Load environment variables FIRST, before any other imports
const dotenv = require("dotenv");

// Determine which .env file to use based on NODE_ENV
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: path.resolve(__dirname, ".env.production") });
  console.log("Loading production environment variables");
} else {
  dotenv.config({ path: path.resolve(__dirname, ".env.development") });
  console.log("Loading development environment variables");
}

// Log important environment variables for debugging
console.log("Environment:", process.env.NODE_ENV || "development");
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log("Google Client ID exists:", !!process.env.GOOGLE_CLIENT_ID);

// Now import modules that depend on environment variables
const connectDB = require("./config/db");
const passport = require("./config/passport");

// ================ Route Imports ================
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
const settingsRoutes = require("./routes/settingsRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const calendarEventRoutes = require("./routes/calendarEventRoutes");

// ================ App Configuration ================
const app = express();

// Connect to MongoDB database
connectDB();

// ================ Middleware Setup ================
// Initialize Passport for authentication
app.use(passport.initialize());

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Rate limiting configuration for API protection
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", apiLimiter);

// ================ Route Configuration ================
// Mount all API routes
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
app.use("/api/settings", settingsRoutes);
app.use("/api/challenge", challengeRoutes);
app.use("/api/achievement", achievementRoutes);
app.use("/api/calendar", calendarEventRoutes);

// ================ Health Check ================
// Basic health check endpoint to verify server status
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// ================ Error Handling ================
// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

// ================ Server Initialization ================
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Display database connection details after connection is established
  mongoose.connection.on("connected", () => {
    const db = mongoose.connection;
    console.log("\n=== Database Connection ===");
    console.log(`Database: ${db.name}`);
    console.log(`Host: ${db.host}`);
    console.log(`Port: ${db.port}`);
  });
});
