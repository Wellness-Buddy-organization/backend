const moodController = require('../../../controllers/moodController');
const Mood = require('../../../models/Mood');

// Mock the Mood model
jest.mock('../../../models/Mood');

describe('Mood Controller Tests', () => {
  let req, res;
  
  beforeEach(() => {
    req = {
      user: { _id: 'user123' },
      body: {},
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  
  test('createMood should create a mood entry', async () => {
    // Setup
    req.body = {
      mood: 'happy',
      notes: 'Test notes',
      stress: 2,
    };
    
    const saveMock = jest.fn().mockResolvedValue({
      _id: 'mood123',
      userId: 'user123',
      mood: 'happy',
      notes: 'Test notes',
      stress: 2,
      date: new Date(),
    });
    
    Mood.mockImplementation(() => ({
      save: saveMock,
    }));
    
    // Execute
    await moodController.createMood(req, res);
    
    // Assert
    expect(Mood).toHaveBeenCalledWith({
      userId: 'user123',
      mood: 'happy',
      notes: 'Test notes',
      stress: 2,
      date: expect.any(Date),
    });
    
    expect(saveMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      _id: 'mood123',
      mood: 'happy',
    }));
  });
  
  test('getMoodHistory should return mood entries', async () => {
    // Setup
    const mockMoodData = [
      { _id: 'mood1', mood: 'happy', date: new Date() },
      { _id: 'mood2', mood: 'sad', date: new Date() },
    ];
    
    Mood.find = jest.fn().mockReturnThis();
    Mood.sort = jest.fn().mockReturnThis();
    Mood.limit = jest.fn().mockResolvedValue(mockMoodData);
    
    // Execute
    await moodController.getMoodHistory(req, res);
    
    // Assert
    expect(Mood.find).toHaveBeenCalledWith({ userId: 'user123' });
    expect(Mood.sort).toHaveBeenCalledWith({ date: -1 });
    expect(Mood.limit).toHaveBeenCalledWith(7);
    expect(res.json).toHaveBeenCalledWith(mockMoodData);
  });
  
  test('getMoodHistory should handle errors', async () => {
    // Setup
    const errorMessage = 'Database error';
    Mood.find = jest.fn().mockReturnThis();
    Mood.sort = jest.fn().mockReturnThis();
    Mood.limit = jest.fn().mockRejectedValue(new Error(errorMessage));
    
    // Execute
    await moodController.getMoodHistory(req, res);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error fetching mood history',
      error: errorMessage,
    });
  });
});