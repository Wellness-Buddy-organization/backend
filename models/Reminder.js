const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // For faster queries by user
    },
    type: {
      type: String,
      enum: ["water", "meal", "eye_rest"],
      required: true,
    },
    time: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v),
        message: "Invalid time format (use HH:MM)",
      },
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", reminderSchema);
