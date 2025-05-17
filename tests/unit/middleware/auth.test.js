const jwt = require('jsonwebtoken');
const auth = require('../../../middleware/auth');
const User = require('../../../models/User');

// Mock dependencies
jest.mock('jsonwebtoken');
jest.mock('../../../models/User');

describe('Auth Middleware Tests', () => {
  let req, res, next;
  
  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    next = jest.fn();

    // Mock environment variable
    process.env.JWT_SECRET = 'test-secret';
  });
  
  test('should authenticate with valid token', async () => {
    // Setup
    const token = 'valid-token';
    const decodedToken = { userId: 'user123' };
    const mockUser = { _id: 'user123', email: 'test@example.com' };
    
    req.header.mockReturnValue(`Bearer ${token}`);
    jwt.verify.mockReturnValue(decodedToken);
    User.findById.mockResolvedValue(mockUser);
    
    // Execute
    await auth(req, res, next);
    
    // Assert
    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(User.findById).toHaveBeenCalledWith(decodedToken.userId);
    expect(req.user).toEqual(mockUser);
    expect(req.token).toEqual(token);
    expect(next).toHaveBeenCalled();
  });
  
  test('should reject when no token provided', async () => {
    // Setup
    req.header.mockReturnValue(null);
    
    // Execute
    await auth(req, res, next);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentication required' });
    expect(next).not.toHaveBeenCalled();
  });
});