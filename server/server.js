import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/config/db.js';

import authRoutes from './src/routes/authRoutes.js';
import { employeeRoutes, trainerRoutes, batchRoutes } from './src/routes/index.js';

// Setup env variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/batches', batchRoutes);

// Main Entry Point
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();
