const { body, validationResult } = require("express-validator");

exports.reminderValidation = [
  body("type")
    .isIn(["water", "meal", "eye_rest", "stretch", "posture", "meditation"])
    .withMessage("Type must be a valid reminder type"),
  body("time")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Time must be in HH:MM format"),
  body("enabled")
    .optional()
    .isBoolean()
    .withMessage("Enabled must be a boolean"),
  body("days").optional().isArray().withMessage("Days must be an array"),
  body("days.*")
    .optional()
    .isIn(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])
    .withMessage("Days must be valid weekdays"),
  body("message").optional().isString().withMessage("Message must be a string"),
  body("sound")
    .optional()
    .isIn(["chime", "bell", "drop", "ping", "soft", "calm"])
    .withMessage("Sound must be a valid sound type"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
