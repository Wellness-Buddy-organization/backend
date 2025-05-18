const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  global.__MONGO_URI__ = uri;
  process.env.MONGODB_URI = uri;
  if (!mongoose.connection.readyState) {
    await mongoose.connect(uri, {
      bufferCommands: false, // Disable buffering for tests
    });
  }
});

afterAll(async () => {
  if (mongod) {
    await mongod.stop();
  }
  await mongoose.disconnect();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}, 30000); // Increase timeout to 30 seconds

// Silences console during tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
};