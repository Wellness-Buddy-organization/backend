const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminderController");
const auth = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");
const { reminderValidation } = require("../middleware/validations");

// All routes are protected
router.post("/", auth, reminderValidation, asyncHandler(reminderController.createReminder));
router.get("/", auth, asyncHandler(reminderController.getReminders));
router.put("/:id", auth, reminderValidation, asyncHandler(reminderController.updateReminder));
router.delete("/:id", auth, asyncHandler(reminderController.deleteReminder));

module.exports = router;
