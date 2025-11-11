// 🔐 app.js – secure express configuration
import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import connectDB from './config/db.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import merchantRoutes from './routes/merchantRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from the backend root directory
dotenv.config({ path: join(__dirname, '..', '.env') });

// Verify critical environment variables
if (!process.env.ENCRYPTION_KEY) {
  console.error('❌ ENCRYPTION_KEY is not set in .env file');
  console.error('Please ensure .env file exists in the backend directory with ENCRYPTION_KEY configured');
}

const app = express();

// ------------------- SECURITY MIDDLEWARES -------------------

// Connect DB
connectDB();

// Parse JSON body
app.use(express.json({ limit: '10kb' }));

// Helmet: set secure HTTP headers
app.use(helmet());

// CORS: allow only your frontend domain
const allowedOrigins = [process.env.FRONTEND_URL];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Sanitize request data (prevent NoSQL injection)
app.use(mongoSanitize());

// Global rate limiter (optional)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min window
  max: 100, // 100 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// ------------------- ROUTES -------------------

app.get('/', (req, res) => {
  res.send('🚀 Mini Payment Gateway API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/transaction', transactionRoutes);

// ------------------- ERROR HANDLING -------------------

app.use(errorHandler);

// ------------------- SERVER -------------------

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
