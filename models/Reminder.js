const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["water", "meal", "eye_rest", "stretch", "posture", "meditation"],
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
    days: {
      type: [String],
      enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
      default: ["mon", "tue", "wed", "thu", "fri"],
    },
    message: {
      type: String,
      default: "",
    },
    sound: {
      type: String,
      enum: ["chime", "bell", "drop", "ping", "soft", "calm"],
      default: "chime",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", reminderSchema);
