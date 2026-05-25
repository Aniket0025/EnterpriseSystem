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

      // Drop leftover unique index 'user_id_1' in users collection if it exists
      try {
        const db = conn.connection.db;
        const usersCollection = db.collection('users');
        const indexes = await usersCollection.indexes();
        const hasUserIdIndex = indexes.some(idx => idx.name === 'user_id_1');
        if (hasUserIdIndex) {
          console.log("Found leftover unique index 'user_id_1' in 'users' collection. Dropping it...");
          await usersCollection.dropIndex('user_id_1');
          console.log("Index 'user_id_1' successfully dropped on startup.");
        }
      } catch (indexError) {
        console.error("Non-blocking index check error:", indexError.message);
      }

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
