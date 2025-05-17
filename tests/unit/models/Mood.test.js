// tests/unit/models/Mood.test.js
const Mood = require('../../../models/Mood');

describe('Mood Model Schema', () => {
  test('has correct schema definition', () => {
    // Get the schema from the model
    const schema = Mood.schema.obj;
    
    // Test schema properties
    expect(schema.userId).toBeDefined();
    expect(schema.userId.type).toBe(mongoose.Schema.Types.ObjectId);
    expect(schema.userId.required).toBe(true);
    
    expect(schema.mood).toBeDefined();
    expect(schema.mood.type).toBe(String);
    expect(schema.mood.enum).toContain('happy');
    expect(schema.mood.enum).toContain('sad');
    expect(schema.mood.required).toBe(true);
    
    expect(schema.stress).toBeDefined();
    expect(schema.stress.type).toBe(Number);
    expect(schema.stress.min).toBe(1);
    expect(schema.stress.max).toBe(5);
    
    expect(schema.notes).toBeDefined();
    expect(schema.notes.type).toBe(String);
    
    expect(schema.date).toBeDefined();
    expect(schema.date.type).toBe(Date);
    expect(schema.date.default).toBeDefined(); 
  });
});