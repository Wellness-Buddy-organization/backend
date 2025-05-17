const mongoose = require('mongoose');
const User = require('../../../models/User');

describe('User Model Tests', () => {
  test('should validate a valid user', async () => {
    const validUser = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const user = new User(validUser);
    const savedUser = await user.save();
    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.fullName).toBe(validUser.fullName);
    expect(savedUser.email).toBe(validUser.email);
  });
  
  test('should fail when required fields are missing', async () => {
    const missingRequired = {
      // missing fullName and email
      password: 'password123'
    };
    
    const user = new User(missingRequired);
    
    await expect(user.save()).rejects.toThrow();
  });
});