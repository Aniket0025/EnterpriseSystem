import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB, dbConnected, dbConnectionError } from './src/config/db.js';

// Load environment variables from explicit path
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Fallback environment variables for Render
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

// Set default super admin key
if (!process.env.SUPER_ADMIN_KEY) {
  process.env.SUPER_ADMIN_KEY = 'hrportal-super-admin-2024';
}

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  console.error('Please set these in your Render dashboard:');
  missingVars.forEach(varName => console.error(`- ${varName}`));
  process.exit(1);
}

import authRoutes from './src/routes/authRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import attendanceRoutes from './src/routes/attendanceRoutes.js';
import studentRoutes from './src/routes/studentRoutes.js';
import internRoutes from './src/routes/internRoutes.js';
import { employeeRoutes, trainerRoutes, batchRoutes, payrollRoutes, taskRoutes, leaveRoutes, dailyReportRoutes, dashboardRoutes, candidateRoutes, interviewRoutes, performanceRoutes, analyticsRoutes } from './src/routes/index.js';

// Debug: Log environment variables (remove in production)
console.log('Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

const app = express();

// 1. Helmet security headers (protects against Clickjacking, basic XSS, mime-sniffing)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.google.com/recaptcha/", "https://www.gstatic.com/recaptcha/"],
      frameSrc: ["'self'", "https://www.google.com/recaptcha/", "https://recaptcha.google.com/"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      objectSrc: ["'none'"]
    }
  }
}));

// 2. Rate Limiting Middleware (prevents brute-force on API routes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 150, // Limit each IP to 150 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP. Please try again in 15 minutes.' }
});
app.use('/api/', apiLimiter);

// 3. Robust CORS configuration supporting multiple origins
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://hr-portol-white-david23.vercel.app'
];

if (process.env.CLIENT_URL) {
  // Support comma-separated list of origins
  const envOrigins = process.env.CLIENT_URL.split(',').map(item => item.trim());
  envOrigins.forEach(origin => {
    if (origin && !allowedOrigins.includes(origin)) {
      allowedOrigins.push(origin);
    }
  });
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman, server-to-server)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.vercel.app') ||
                      origin.startsWith('http://localhost:');
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Max payload limit to prevent DoS via payload exhaustion

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

// Debug endpoint to diagnose DB issues
app.get('/api/debug', (req, res) => {
  const mongoUri = process.env.MONGO_URI || '';
  // Extract cluster name for diagnostics (hide password)
  const clusterMatch = mongoUri.match(/@([^/\?]+)/);
  const clusterName = clusterMatch ? clusterMatch[1] : 'not found';

  res.json({
    dbConnected: dbConnected,
    dbConnectionError: dbConnectionError,
    env: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      PORT: process.env.PORT || 'not set',
      MONGO_URI_SET: !!process.env.MONGO_URI,
      MONGO_CLUSTER: clusterName,
      JWT_SECRET_SET: !!process.env.JWT_SECRET,
      CLIENT_URL: process.env.CLIENT_URL || 'not set',
      SUPER_ADMIN_KEY_SET: !!process.env.SUPER_ADMIN_KEY,
    },
    timestamp: new Date().toISOString(),
    instructions: 'If dbConnected is false, check: 1) MONGO_URI cluster name is correct, 2) MongoDB Atlas IP whitelist includes 0.0.0.0/0, 3) Database user password is correct.'
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error.message);
    // Don't exit - keep server running even if DB fails initially
    console.log('Starting server without database connection...');
    app.listen(PORT, () => console.log(`Server running on port ${PORT} (DB connection failed)`));
  }
}

startServer();
