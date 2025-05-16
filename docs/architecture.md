# MVC Architecture Documentation for Wellness Buddy

## Overview

Wellness Buddy implements the Model-View-Controller (MVC) architectural pattern to structure the application, ensuring separation of concerns, maintainable code, and scalable development. This document explains how MVC is implemented in the Wellness Buddy backend.

## MVC Implementation

### 1. Model Layer

The Model layer represents the application's data structures and business logic. In Wellness Buddy, this is implemented using Mongoose schemas and models.

#### Implementation Details:

- **Location**: `models/` directory
- **Key Files**: `User.js`, `Mood.js`, `Sleep.js`, `Hydration.js`, etc.
- **Responsibility**: Defining data structures, validation rules, and data manipulation methods

#### Example Model (Mood.js):

```javascript
const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'neutral', 'angry', 'anxious'],
    required: true,
  },
  stress: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  notes: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Mood', moodSchema);
```

#### Key Model Components:

1. **Schemas**: Define the structure and validation rules for each data type
2. **Relationships**: Establish connections between different models (e.g., userId reference)
3. **Validation**: Enforce data integrity through schema validation
4. **Timestamps**: Automatic tracking of creation and update times

### 2. View Layer

In a traditional web application, the View layer would handle the presentation logic. However, in our REST API architecture, the "View" is represented by the JSON responses returned to the client.

#### Implementation Details:

- **Location**: Implicit in controller responses
- **Responsibility**: Formatting data for client consumption

#### Example "View" (from moodController.js):

```javascript
// The "View" is implicitly defined through the response format
res.status(201).json(entry);
```

### 3. Controller Layer

The Controller layer handles the application logic, processing requests, interacting with models, and returning appropriate responses.

#### Implementation Details:

- **Location**: `controllers/` directory
- **Key Files**: `userController.js`, `moodController.js`, `sleepController.js`, etc.
- **Responsibility**: Processing client requests, interacting with models, and returning responses

#### Example Controller (moodController.js):

```javascript
const Mood = require('../models/Mood');

exports.createMood = async (req, res) => {
  try {
    const { mood, notes, stress } = req.body;
    const entry = new Mood({ 
      userId: req.user._id,
      mood,
      notes,
      stress: stress || 3,
      date: new Date()
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new function to get mood history
exports.getMoodHistory = async (req, res) => {
  try {
    const history = await Mood.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(7);
    res.json(history);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching mood history',
      error: error.message 
    });
  }
};
```

#### Key Controller Components:

1. **Request Processing**: Extract and validate data from client requests
2. **Business Logic**: Implement application-specific logic
3. **Model Interaction**: Create, read, update, and delete data using models
4. **Response Formatting**: Send appropriately formatted responses to clients
5. **Error Handling**: Catch and handle exceptions, returning appropriate error responses

### 4. Routes Layer

While not part of the traditional MVC pattern, the Routes layer acts as a mediator between client requests and controllers.

#### Implementation Details:

- **Location**: `routes/` directory
- **Key Files**: `userRoutes.js`, `moodRoutes.js`, `sleepRoutes.js`, etc.
- **Responsibility**: Defining API endpoints and mapping them to controller methods

#### Example Route (moodRoutes.js):

```javascript
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const moodController = require('../controllers/moodController');

router.post('/', auth, moodController.createMood);
router.get('/', auth, moodController.getMoodHistory);

module.exports = router;
```

## Data Flow in MVC

The diagram below illustrates the data flow in our MVC implementation:

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│             │       │             │       │             │       │             │
│   Client    │───►   │   Routes    │───►   │ Controllers │───►   │   Models    │
│             │       │             │       │             │       │             │
└─────────────┘       └─────────────┘       └─────────────┘       └─────────────┘
       ▲                                           │                     │
       │                                           │                     │
       │                                           │                     ▼
       │                                           │              ┌─────────────┐
       │                                           │              │             │
       └───────────────────────────────────────────┘◄─────────────│  Database   │
                                                                  │             │
                                                                  └─────────────┘
```

1. Client sends a request to a specific endpoint
2. Routes direct the request to the appropriate controller method
3. Controller processes the request and interacts with the model as needed
4. Model performs data operations (validation, database interaction)
5. Controller formats the response (implicit view) and sends it back to the client

## Benefits of MVC in Wellness Buddy

1. **Separation of Concerns**: Each component has a distinct responsibility, making the codebase more maintainable
2. **Code Reusability**: Models can be used by multiple controllers, reducing duplication
3. **Parallel Development**: Different team members can work on models, controllers, and routes simultaneously
4. **Testability**: Components can be tested in isolation, improving test coverage
5. **Scalability**: New features can be added by creating new models, controllers, and routes without modifying existing code

## MVC Extensions and Middleware

While the core application follows the MVC pattern, we've extended it with middleware components to handle cross-cutting concerns:

### Authentication Middleware:

```javascript
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(419).json({ message: 'Session expired', error: 'Session timeout' });
      }
      throw error;
    }
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate', error: error.message });
  }
};
```

### Validation Middleware:

```javascript
const { body, validationResult } = require("express-validator");

exports.reminderValidation = [
  body("type")
    .isIn(["water", "meal", "eye_rest", "stretch", "posture", "meditation"])
    .withMessage("Type must be a valid reminder type"),
  body("time")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Time must be in HH:MM format"),
  // Additional validations...
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
```

## Conclusion

The MVC architecture in Wellness Buddy provides a clear, maintainable structure for the application. By separating concerns into models (data), controllers (logic), and implicit views (JSON responses), the application is more modular, testable, and scalable. The addition of routes and middleware extends the pattern to create a robust, well-organized backend system.
