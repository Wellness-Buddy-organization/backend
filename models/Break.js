const mongoose = require("mongoose");
const breakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: Date, required: true, default: Date.now },
    duration: { type: Number, required: true, min: 1 },
    type: { type: String, enum: ["short", "long"], default: "short" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Break", breakSchema);
