import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/config/db.js';

import authRoutes from './src/routes/authRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import attendanceRoutes from './src/routes/attendanceRoutes.js';
import studentRoutes from './src/routes/studentRoutes.js';
import internRoutes from './src/routes/internRoutes.js';
import { employeeRoutes, trainerRoutes, batchRoutes, payrollRoutes, taskRoutes, leaveRoutes, dailyReportRoutes, dashboardRoutes, candidateRoutes, interviewRoutes, performanceRoutes, analyticsRoutes } from './src/routes/index.js';

// Setup env variables
dotenv.config();

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/interns', internRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/reports', dailyReportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/analytics', analyticsRoutes);

// Main Entry Point
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startServer();
