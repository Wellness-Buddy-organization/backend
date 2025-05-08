// controllers/calendarEventController.js

const CalendarEvent = require('../models/CalendarEvent');

/**
 * Get calendar events for a date range
 */
exports.getEvents = async (req, res) => {
  try {
    // Extract date range from query parameters
    const { startDate, endDate } = req.query;
    
    // Validate date params
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Start date and end date are required'
      });
    }
    
    // Create query for date range and current user
    const query = {
      userId: req.user._id,
      // Get events that fall within the range or overlap with it
      $or: [
        // Events that start within the range
        {
          startDate: { 
            $gte: new Date(startDate), 
            $lte: new Date(endDate) 
          }
        },
        // Events that end within the range
        {
          endDate: { 
            $gte: new Date(startDate), 
            $lte: new Date(endDate) 
          }
        },
        // Events that span over the range
        {
          startDate: { $lte: new Date(startDate) },
          endDate: { $gte: new Date(endDate) }
        }
      ]
    };
    
    // Find events
    const events = await CalendarEvent.find(query).sort({ startDate: 1 });
    
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ 
      message: 'Error fetching calendar events', 
      error: error.message 
    });
  }
};

/**
 * Create new calendar event
 */
exports.createEvent = async (req, res) => {
  try {
    const { title, startDate, endDate, category, description } = req.body;
    
    // Validate required fields
    if (!title || !startDate || !endDate) {
      return res.status(400).json({
        message: 'Title, start date, and end date are required'
      });
    }
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      return res.status(400).json({
        message: 'End date cannot be before start date'
      });
    }
    
    // Create the event
    const event = new CalendarEvent({
      userId: req.user._id,
      title,
      startDate: start,
      endDate: end,
      category: category || 'personal',
      description
    });
    
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({ 
      message: 'Error creating calendar event', 
      error: error.message 
    });
  }
};

/**
 * Update calendar event
 */
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, startDate, endDate, category, description } = req.body;
    
    // Find the event and check ownership
    const event = await CalendarEvent.findOne({ 
      _id: id,
      userId: req.user._id
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (end < start) {
        return res.status(400).json({
          message: 'End date cannot be before start date'
        });
      }
      
      event.startDate = start;
      event.endDate = end;
    } else if (startDate) {
      const start = new Date(startDate);
      const end = new Date(event.endDate);
      
      if (end < start) {
        return res.status(400).json({
          message: 'End date cannot be before start date'
        });
      }
      
      event.startDate = start;
    } else if (endDate) {
      const start = new Date(event.startDate);
      const end = new Date(endDate);
      
      if (end < start) {
        return res.status(400).json({
          message: 'End date cannot be before start date'
        });
      }
      
      event.endDate = end;
    }
    
    // Update other fields if provided
    if (title) event.title = title;
    if (category) event.category = category;
    if (description !== undefined) event.description = description;
    
    // Save the updated event
    await event.save();
    res.status(200).json(event);
  } catch (error) {
    console.error('Error updating calendar event:', error);
    res.status(500).json({ 
      message: 'Error updating calendar event', 
      error: error.message 
    });
  }
};

/**
 * Delete calendar event
 */
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and delete the event, ensuring it belongs to the current user
    const result = await CalendarEvent.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });
    
    if (!result) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    res.status(500).json({ 
      message: 'Error deleting calendar event', 
      error: error.message 
    });
  }
};