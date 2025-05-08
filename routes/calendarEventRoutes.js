// routes/calendarEventRoutes.js

const express = require('express');
const router = express.Router();
const calendarEventController = require('../controllers/calendarEventController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Get events for a date range
router.get('/', calendarEventController.getEvents);

// Create a new event
router.post('/', calendarEventController.createEvent);

// Update an event
router.put('/:id', calendarEventController.updateEvent);

// Delete an event
router.delete('/:id', calendarEventController.deleteEvent);

module.exports = router;