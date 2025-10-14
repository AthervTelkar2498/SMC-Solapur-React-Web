import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/solapur_municipal';

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI must be set. Did you forget to add it to .env?"
  );
}

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
    console.log(`📦 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 MongoDB connection closed due to app termination');
  process.exit(0);
});

// Test MongoDB connection
async function testDbConnection() {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('✅ Database connection successful!');
    } else {
      console.log('⚠️ Waiting for database connection...');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

// Auto-test connection after connecting
mongoose.connection.once('open', testDbConnection);

export default mongoose;