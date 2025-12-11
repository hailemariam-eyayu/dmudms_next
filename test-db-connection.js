// Simple test to check MongoDB connection
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://dmudms:dmudms@cluster0.rp9qif7.mongodb.net/dormitory_management?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB');
    
    // Test creating a simple document
    const TestSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', TestSchema);
    
    // Create a test document
    const testDoc = new TestModel({ name: 'Connection Test' });
    await testDoc.save();
    console.log('✅ Successfully created test document');
    
    // Read it back
    const found = await TestModel.findOne({ name: 'Connection Test' });
    console.log('✅ Successfully read test document:', found);
    
    // Clean up
    await TestModel.deleteOne({ name: 'Connection Test' });
    console.log('✅ Successfully cleaned up test document');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}

testConnection();