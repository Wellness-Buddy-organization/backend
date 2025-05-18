const mongoose = require('mongoose');
const User = require('../../../models/User');
const bcrypt = require('bcryptjs');

describe('User Model Tests', () => {
  beforeAll(async () => {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('should validate a valid user', async () => {
    const validUser = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'validPassword123'
    };
    
    const user = new User(validUser);
    const savedUser = await user.save();
    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.fullName).toBe(validUser.fullName);
    expect(savedUser.email).toBe(validUser.email);
  });

  test('should hash password before saving', async () => {
    const password = 'password123';
    const user = new User({
      fullName: 'Test User',
      email: 'test@example.com',
      password: password
    });

    await user.save();
    const savedUser = await User.findById(user._id);
    
    // Ensure the stored password is not the plain text password
    expect(savedUser.password).not.toBe(password);
    
    // Verify the password can be correctly compared
    const isMatch = await bcrypt.compare(password, savedUser.password);
    expect(isMatch).toBe(true);
  });

  test('should validate email format', async () => {
    const invalidUser = {
      fullName: 'Test User',
      email: 'invalid-email',
      password: 'password123'
    };
    
    const user = new User(invalidUser);
    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });

  test('should fail when required fields are missing', async () => {
    const missingRequired = {
      password: 'password123'
    };
    
    const user = new User(missingRequired);
    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });
});