const moodController = require('../../../controllers/moodController');
const Mood = require('../../../models/Mood');

// Mock the Mood model module
jest.mock('../../../models/Mood');

describe('Mood Controller Tests', () => {
  let req, res;
  let mockMoodInstance; // Variable to hold the mocked instance

  beforeEach(() => {
    // Reset the mock before each test to ensure isolation
    Mood.mockClear();

    req = {
      user: { _id: 'user123' },
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Create a mock instance with a mock save method
    mockMoodInstance = {
      _id: 'mood123',
      mood: 'happy',
      save: jest.fn().mockResolvedValue({
        _id: 'mood123',
        userId: 'user123',
        mood: 'happy',
        notes: 'Test notes',
        stress: 2,
        date: new Date(), // Mock the date as well
      }),
    };

    // Make the Mood constructor return the mock instance when called
    Mood.mockImplementation(() => mockMoodInstance);
  });

  test('createMood should create a mood entry', async () => {
    // Setup request body
    req.body = {
      mood: 'happy',
      notes: 'Test notes',
      stress: 2,
    };

    // Execute the controller function
    await moodController.createMood(req, res);

    // Assertions
    // Check if the Mood constructor was called with the correct arguments
    expect(Mood).toHaveBeenCalledWith({
      userId: 'user123',
      mood: 'happy',
      notes: 'Test notes',
      stress: 2,
      // Use expect.any(Date) to check if a Date object is provided,
      // as the default date is set by the model/controller logic.
      date: expect.any(Date),
    });
    // Check if the save method on the created instance was called
    expect(mockMoodInstance.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      _id: 'mood123',
      mood: 'happy',
    }));
  });

  test('getMoodHistory should return mood entries', async () => {
    // Setup mock data for find, sort, and limit chain
    const mockMoodData = [
      { _id: 'mood1', mood: 'happy', date: new Date() },
      { _id: 'mood2', mood: 'sad', date: new Date() },
    ];

    // Mock the static methods Mood.find, Mood.sort, Mood.limit
    Mood.find = jest.fn().mockReturnThis(); // find returns the query object
    Mood.sort = jest.fn().mockReturnThis(); // sort returns the query object
    Mood.limit = jest.fn().mockResolvedValue(mockMoodData); // limit resolves the query

    // Execute the controller function
    await moodController.getMoodHistory(req, res);

    // Assertions
    expect(Mood.find).toHaveBeenCalledWith({ userId: 'user123' });
    expect(Mood.sort).toHaveBeenCalledWith({ date: -1 });
    expect(Mood.limit).toHaveBeenCalledWith(7);
    expect(res.json).toHaveBeenCalledWith(mockMoodData);
  });

  test('getMoodHistory should handle errors', async () => {
    // Setup mock to reject the query chain
    const errorMessage = 'Database error';
    Mood.find = jest.fn().mockReturnThis();
    Mood.sort = jest.fn().mockReturnThis();
    Mood.limit = jest.fn().mockRejectedValue(new Error(errorMessage));

    // Execute the controller function
    await moodController.getMoodHistory(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error fetching mood history',
      error: errorMessage,
    });
  });
});