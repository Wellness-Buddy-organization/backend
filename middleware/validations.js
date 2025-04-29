const { body, validationResult } = require("express-validator");

exports.reminderValidation = [
  body("type")
    .isIn(["water", "meal", "eye_rest"])
    .withMessage("Type must be water, meal, or eye_rest"),
  body("time")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Time must be in HH:MM format"),
  body("enabled")
    .optional()
    .isBoolean()
    .withMessage("Enabled must be a boolean"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
