# API Documentation for Wellness Buddy (Continued)

#### Work Tracking (continued)

##### Log Work
Create a new work entry.

- **URL**: `/api/work`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "hours": 8,
    "tasksCompleted": 5
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: Returns the created work entry
- **Error Response**:
  - **Code**: 500
  - **Content**:
    ```json
    {
      "message": "Error logging work hours",
      "error": "Error message"
    }
    ```

##### Get Work History
Get user's work entries.

- **URL**: `/api/work`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of work entries
- **Error Response**:
  - **Code**: 500
  - **Content**:
    ```json
    {
      "message": "Error fetching work history",
      "error": "Error message"
    }
    ```

#### Break Management

##### Log Break
Create a new break entry.

- **URL**: `/api/break`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "duration": 15,
    "type": "short"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: Returns the created break entry
- **Error Response**:
  - **Code**: 500
  - **Content**:
    ```json
    {
      "message": "Error logging break",
      "error": "Error message"
    }
    ```

##### Get Break History
Get user's break entries.

- **URL**: `/api/break`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of break entries
- **Error Response**:
  - **Code**: 500
  - **Content**:
    ```json
    {
      "message": "Error fetching break history",
      "error": "Error message"
    }
    ```

#### Reminders

##### Create Reminder
Create a new reminder.

- **URL**: `/api/reminder`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "type": "water",
    "time": "14:30",
    "enabled": true,
    "days": ["mon", "tue", "wed", "thu", "fri"],
    "message": "Time to hydrate!",
    "sound": "chime"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: Returns the created reminder
- **Error Response**:
  - **Code**: 400
  - **Content**:
    ```json
    {
      "errors": [
        {
          "param": "type",
          "msg": "Type must be a valid reminder type"
        }
      ]
    }
    ```

##### Get Reminders
Get user's reminders.

- **URL**: `/api/reminder`
- **Method**: `GET`
- **Auth required**: Yes
- **Query Parameters**:
  - `page` (optional): Page number for pagination
  - `limit` (optional): Number of reminders per page
  - `upcoming` (optional): Set to 'true' to get only upcoming reminders
  - `onlyFuture` (optional): Set to 'true' to get only future reminders for today
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of reminders
- **Error Response**:
  - **Code**: 500
  - **Content**:
    ```json
    {
      "message": "Error fetching reminders",
      "error": "Error message"
    }
    ```

##### Update Reminder
Update an existing reminder.

- **URL**: `/api/reminder/:id`
- **Method**: `PUT`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "type": "water",
    "time": "15:00",
    "enabled": true
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: Returns the updated reminder
- **Error Response**:
  - **Code**: 404
  - **Content**:
    ```json
    {
      "message": "Reminder not found"
    }
    ```

##### Delete Reminder
Delete a reminder.

- **URL**: `/api/reminder/:id`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "message": "Reminder deleted"
    }
    ```
- **Error Response**:
  - **Code**: 404
  - **Content**:
    ```json
    {
      "message": "Reminder not found"
    }
    ```

#### User Settings

##### Get Settings
Get user settings.

- **URL**: `/api/settings`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "animationsEnabled": true,
      "notificationsEnabled": true,
      "darkMode": false
    }
    ```
- **Error Response**:
  - **Code**: 500
  - **Content**:
    ```json
    {
      "message": "Error fetching settings",
      "error": "Error message"
    }
    ```

##### Update Settings
Update user settings.

- **URL**: `/api/settings`
- **Method**: `PUT`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "animationsEnabled": false,
    "notificationsEnabled": true,
    "darkMode": true
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: Returns the updated settings
- **Error Response**:
  - **Code**: 500
  - **Content**:
    ```json
    {
      "message": "Error updating settings",
      "error": "Error message"
    }
    ```

#### Challenges

##### Get Active Challenges
Get user's active challenges.

- **URL**: `/api/challenge`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of active challenges
- **Error Response**:
  - **Code**: 500
  - **Content**:
    ```json
    {
      "message": "Error fetching challenges",
      "error": "Error message"
    }
    ```

##### Create Challenge
Create a new challenge.

- **URL**: `/api/challenge`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "title": "Drink More Water",
    "description": "Drink 8 glasses of water daily for a week",
    "category": "personal",
    "total": 7,
    "reward": "Improved hydration habits"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: Returns the created challenge
- **Error Response**:
  - **Code**: 500
  - **Content**:
    ```json
    {
      "message": "Error creating challenge",
      "error": "Error message"
    }
    ```

##### Update Challenge Progress
Update challenge progress.

- **URL**: `/api/challenge/:id/progress`
- **Method**: `PUT`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "progress": 3
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: Returns the updated challenge
- **Error Response**:
  - **Code**: 404
  - **Content**:
    ```json
    {
      "message": "Challenge not found"
    }
    ```

#### Achievements

##### Get Achievements
Get user's achievements.

- **URL**: `/api/achievement`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of achievements
- **Error Response**:
  - **Code**: 500
  - **Content**:
    ```json
    {
      "message": "Error fetching achievements",
      "error": "Error message"
    }
    ```

#### Calendar Events

##### Get Calendar Events
Get calendar events for a date range.

- **URL**: `/api/calendar`
- **Method**: `GET`
- **Auth required**: Yes
- **Query Parameters**:
  - `startDate`: Start date (YYYY-MM-DD)
  - `endDate`: End date (YYYY-MM-DD)
- **Success Response**:
  - **Code**: 200
  - **Content**: Array of calendar events
- **Error Response**:
  - **Code**: 400
  - **Content**:
    ```json
    {
      "message": "Start date and end date are required"
    }
    ```

##### Create Calendar Event
Create a new calendar event.

- **URL**: `/api/calendar`
- **Method**: `POST`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "title": "Morning Meditation",
    "startDate": "2025-05-20T09:00:00.000Z",
    "endDate": "2025-05-20T09:30:00.000Z",
    "category": "wellness",
    "description": "20-minute guided meditation session"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**: Returns the created event
- **Error Response**:
  - **Code**: 400
  - **Content**:
    ```json
    {
      "message": "Title, start date, and end date are required"
    }
    ```

##### Update Calendar Event
Update an existing calendar event.

- **URL**: `/api/calendar/:id`
- **Method**: `PUT`
- **Auth required**: Yes
- **Request Body**:
  ```json
  {
    "title": "Extended Morning Meditation",
    "startDate": "2025-05-20T09:00:00.000Z",
    "endDate": "2025-05-20T09:45:00.000Z"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**: Returns the updated event
- **Error Response**:
  - **Code**: 404
  - **Content**:
    ```json
    {
      "message": "Event not found"
    }
    ```

##### Delete Calendar Event
Delete a calendar event.

- **URL**: `/api/calendar/:id`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "message": "Event deleted successfully"
    }
    ```
- **Error Response**:
  - **Code**: 404
  - **Content**:
    ```json
    {
      "message": "Event not found"
    }
    ```

## Data Models

### User Model
```javascript
{
  fullName: String,
  email: String,
  password: String,
  googleId: String,
  createdAt: Date
}
```

### Mood Model
```javascript
{
  userId: ObjectId,
  date: Date,
  mood: String, // 'happy', 'sad', 'neutral', 'angry', 'anxious'
  stress: Number, // 1-5
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Sleep Model
```javascript
{
  userId: ObjectId,
  date: Date,
  hours: Number,
  quality: String, // 'poor', 'fair', 'good', 'excellent'
  createdAt: Date,
  updatedAt: Date
}
```

### Hydration Model
```javascript
{
  userId: ObjectId,
  date: Date,
  glasses: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Work Model
```javascript
{
  userId: ObjectId,
  date: Date,
  hours: Number,
  tasksCompleted: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Break Model
```javascript
{
  userId: ObjectId,
  date: Date,
  duration: Number,
  type: String, // 'short', 'long'
  createdAt: Date,
  updatedAt: Date
}
```

### Reminder Model
```javascript
{
  userId: ObjectId,
  type: String, // 'water', 'meal', 'eye_rest', 'stretch', 'posture', 'meditation'
  time: String, // HH:MM format
  enabled: Boolean,
  days: [String], // ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  message: String,
  sound: String, // 'chime', 'bell', 'drop', 'ping', 'soft', 'calm'
  createdAt: Date,
  updatedAt: Date
}
```

### UserSettings Model
```javascript
{
  userId: ObjectId,
  animationsEnabled: Boolean,
  notificationsEnabled: Boolean,
  darkMode: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Challenge Model
```javascript
{
  userId: ObjectId,
  title: String,
  description: String,
  category: String, // 'work', 'family', 'personal', 'learning', 'social', 'rest'
  total: Number,
  progress: Number,
  completed: Boolean,
  reward: String,
  startDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Achievement Model
```javascript
{
  userId: ObjectId,
  title: String,
  description: String,
  icon: String, // 'BriefcaseIcon', 'ClockIcon', 'HomeIcon', 'HeartIcon', 'AcademicCapIcon', 'UserGroupIcon'
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### CalendarEvent Model
```javascript
{
  userId: ObjectId,
  title: String,
  startDate: Date,
  endDate: Date,
  category: String, // 'work', 'personal', 'wellness', 'health'
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid parameters or validation failed |
| 401 | Unauthorized - Authentication required |
| 404 | Not Found - Resource not found |
| 419 | Authentication Timeout - Session expired |
| 500 | Internal Server Error - Server-side error |

## Rate Limiting

API requests are limited to 100 requests per 15-minute window per IP address to prevent abuse.

## Authentication Notes

1. JWT tokens expire after 1 hour
2. Google OAuth authentication tokens last for 24 hours
3. Authentication failures return 401 status code
4. Token expiration returns 419 status code

## Versioning

Current API version: v1 (implicit in routes)
