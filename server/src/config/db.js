import mongoose from 'mongoose';

export let dbConnected = false;
export let dbConnectionError = null;

export const connectDB = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      dbConnected = true;
      dbConnectionError = null;
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      dbConnected = false;
      dbConnectionError = error.message;
      console.error(`Database connection attempt ${i + 1}/${retries} failed: ${error.message}`);
      if (i < retries - 1) {
        console.log(`Retrying in 5 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  throw new Error(`Failed to connect to MongoDB after ${retries} attempts: ${dbConnectionError}`);
};
