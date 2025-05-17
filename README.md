# Wellness Buddy Backend

## Overview
Wellness Buddy is a comprehensive wellness tracking application that helps users monitor various aspects of their wellbeing, including mood patterns, sleep quality, work-life balance, hydration, and break management. The backend is built with Node.js, Express.js, and MongoDB following the MVC (Model-View-Controller) architecture pattern.

## Table of Contents
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Architecture

Wellness Buddy implements the **MVC (Model-View-Controller)** architectural pattern to ensure separation of concerns, maintainability, and scalability.

### MVC Implementation

#### Model Layer
Models represent the application's data structures and business logic:
- Located in the `models/` directory
- Implemented using Mongoose schemas
- Handle data validation and database interactions

Example model (Mood.js):
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
  // Other fields...
}, { timestamps: true });

module.exports = mongoose.model('Mood', moodSchema);
```

#### Controller Layer
Controllers handle the application logic:
- Located in the `controllers/` directory
- Process requests and interact with models
- Format data for responses

Example controller (moodController.js):
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
```

#### View Layer
In our RESTful API, "views" are implemented as JSON responses:
- No explicit view files, as this is an API backend
- JSON responses formatted by controllers
- Client-side will handle presentation

### Architecture Diagram

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

## Features

- **User Authentication**: JWT-based authentication with email/password and Google OAuth support
- **Mood Tracking**: Record and analyze mood patterns
- **Sleep Monitoring**: Track sleep duration and quality
- **Work-Life Balance**: Monitor work hours and productivity
- **Hydration Tracking**: Log daily water intake
- **Break Management**: Schedule and track breaks during work
- **Reminders**: Set custom wellness reminders
- **Dashboard**: Comprehensive overview of wellness metrics
- **Challenges**: Set and complete wellness-focused challenges
- **Achievements**: Unlock achievements based on wellness activities
- **Calendar Integration**: Schedule and manage wellness activities
- **User Settings**: Customize application behavior

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, Passport.js with Google OAuth
- **Validation**: Express Validator
- **Security**: bcrypt for password hashing, rate limiting
- **Development**: Nodemon for hot reloading

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Wellness-Buddy-organization/backend.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env.development` and `.env.production` files with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=your_callback_url
   FRONTEND_URL=your_frontend_url
   PORT=5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **For production**
   ```bash
   npm start
   ```

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/signup` | Register a new user |
| POST | `/api/users/login` | Authenticate user |
| GET | `/api/auth/google` | Google OAuth login |
| GET | `/api/auth/google/callback` | Google OAuth callback |

### Wellness Tracking Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/me` | Get dashboard data |
| POST | `/api/mood` | Log mood entry |
| GET | `/api/mood` | Get mood history |
| POST | `/api/sleep` | Log sleep |
| GET | `/api/sleep` | Get sleep history |
| POST | `/api/hydration` | Log water intake |
| GET | `/api/hydration` | Get hydration history |
| POST | `/api/work` | Log work hours |
| GET | `/api/work` | Get work history |
| POST | `/api/break` | Log a break |
| GET | `/api/break` | Get break history |

### Features Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reminder` | Create reminder |
| GET | `/api/reminder` | Get reminders |
| PUT | `/api/reminder/:id` | Update reminder |
| DELETE | `/api/reminder/:id` | Delete reminder |
| GET | `/api/settings` | Get user settings |
| PUT | `/api/settings` | Update settings |
| GET | `/api/challenge` | Get challenges |
| POST | `/api/challenge` | Create challenge |
| PUT | `/api/challenge/:id/progress` | Update challenge progress |
| GET | `/api/achievement` | Get achievements |
| GET | `/api/calendar` | Get calendar events |
| POST | `/api/calendar` | Create calendar event |
| PUT | `/api/calendar/:id` | Update calendar event |
| DELETE | `/api/calendar/:id` | Delete calendar event |

For detailed API documentation, please see [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

## Project Structure

```
wellness-buddy-backend/
├── config/               # Configuration files
│   ├── db.js             # Database connection
│   └── passport.js       # Authentication config
├── controllers/          # Route controllers (MVC Controller layer)
│   ├── userController.js
│   ├── moodController.js
│   ├── sleepController.js
│   └── ...
├── middleware/           # Custom middleware
│   ├── auth.js           # Authentication middleware
│   └── ...
├── models/               # Mongoose models (MVC Model layer)
│   ├── User.js
│   ├── Mood.js
│   ├── Sleep.js
│   └── ...
├── routes/               # API routes
│   ├── userRoutes.js
│   ├── moodRoutes.js
│   ├── sleepRoutes.js
│   └── ...
├── docs/                 # Documentation
│   ├── architecture.md
│   └── API_DOCUMENTATION.md
├── .env.development      # Development environment variables
├── .env.production       # Production environment variables
├── .gitignore            # Git ignore file
├── package.json          # Dependencies and scripts
├── README.md             # Project documentation
└── server.js             # Entry point
```

## Contributing

This project is part of a software architecture course assignment. Contributions are welcome following these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

### Weekly Development Updates

We maintain weekly development updates through:
- [Blog 01: Your Wellness Buddy; A Must-Have App for Sri Lankan Tech Heroes](https://medium.com/@kodithuwakkumadhumini12/your-wellness-buddy-c2d99080a4ef)
- [Blog 02: Wellness Buddy: Revolutionizing Well-Being for Sri Lanka’s Tech Industry](https://medium.com/@hashansooriyage/wellness-buddy-revolutionizing-well-being-for-sri-lankas-tech-industry-738c03a4c84c)
- [Blog 03: Deep Dive into Software Architecture](https://medium.com/@kodithuwakkumadhumini12/deep-dive-into-software-architecture-38dbf2e52145)
- [Blog 04: Why MVC? Unraveling the Magic Behind Modern Web Development](https://medium.com/@kodithuwakkumadhumini12/why-mvc-58f87a673593)
- [Blog 05: Creating User-Friendly Health and Wellness Apps](https://medium.com/@kodithuwakkumadhumini12/creating-user-friendly-health-and-wellness-apps-080f3c307464)
- [Blog 06: Designing Your Wellness Journey; The Power of UI/UX in Wellness Buddy](https://medium.com/@kodithuwakkumadhumini12/designing-your-wellness-journey-dc2038cdb429)
- [Blog 07: Building a Scalable Node.js Backend for Wellness Buddy Application: Architecture Overview](https://medium.com/@hashansooriyage/building-a-scalable-node-js-backend-for-wellness-buddy-application-architecture-overview-7aea26cec113)
- [Blog 08: The Controller-First Architecture; How We Structured Wellness-Buddy’s Frontend](https://medium.com/@kodithuwakkumadhumini12/the-controller-first-architecture-6e80dde97c5a)
- [Blog 09: Authentication Strategies in Wellness Applications: Implementing JWT and OAuth with Passport.js](https://medium.com/@hashansooriyage/authentication-strategies-in-wellness-applications-implementing-jwt-and-oauth-with-passport-js-a737ef44f037)
- [Blog 10: Building a Responsive Dashboard with React and Framer Motion in Wellness-Buddy](https://medium.com/@kodithuwakkumadhumini12/building-a-responsive-dashboard-with-react-and-framer-motion-in-wellness-buddy-32ffb58e962d)
- [Blog 11: State Management and Data Flow in Wellness-Buddy](https://medium.com/@kodithuwakkumadhumini12/state-management-and-data-flow-in-wellness-buddy-e3cce3fe7389)
- [Blog 12: Designing Effective REST APIs for Health Tracking: Lessons from the Wellness-Buddy Project](https://medium.com/@hashansooriyage/designing-effective-rest-apis-for-health-tracking-lessons-from-the-wellness-buddy-project-68d675c44a59)
- [Blog 13: Reusable UI Component Design for Wellness Apps](https://medium.com/@kodithuwakkumadhumini12/reusable-ui-component-design-for-wellness-apps-d0879235739b)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Development Team

- [Hashan Sooriyage](https://github.com/hashan1998-it)
- [Madhumini Kodithuwakku](https://github.com/Madhumini98)

