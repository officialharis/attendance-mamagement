import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDatabase from './config/dbConnect.js';
import userRouter from './routes/userRouter.js';
import classroomRouter from './routes/classroomRouter.js';
import subjectRouter from './routes/subjectRouter.js';
import attendanceRouter from './routes/attendanceRouter.js';
import adminRouter from './routes/adminRouter.js';
import cloudinaryConnect from './config/cloudinary.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // ✅ Frontend development
  "http://localhost:3000", // ✅ Alternative frontend port
  "https://attendance-mamagement-frontend.vercel.app", // ✅ Frontend production
  "https://attendance-mamagement-backend.vercel.app"    // ✅ Backend production
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
// Enhanced JSON parsing with error handling
app.use(express.json({
  limit: '10mb',
  verify: (_, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({
        success: false,
        message: "Invalid JSON format in request body"
      });
      throw new Error('Invalid JSON');
    }
  }
}));

// URL encoded data parsing
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware for debugging
app.use((req, _, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body keys:', Object.keys(req.body));
  }
  next();
});;

// Startup function with error handling
const startServer = async () => {
  try {
    // Connect to database
    console.log("🔄 Connecting to database...");
    await connectDatabase();

    // Connect to Cloudinary
    console.log("🔄 Connecting to Cloudinary...");
    await cloudinaryConnect();

    // Test Route
    app.get('/', (_, res) => {
      res.json({
        success: true,
        message: "Attendance Management API is Working!",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
      });
    });

    // API Routes
    app.use('/api/admin', adminRouter);
    app.use('/api/user', userRouter);
    app.use('/api/classroom', classroomRouter);
    app.use('/api/subject', subjectRouter);
    app.use('/api/attendance', attendanceRouter);

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error("Unhandled Error:", err);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
      });
    });

    // Start server
    app.listen(port, () => {
      console.log(`✅ Server is running at http://localhost:${port}`);
      console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✅ Database: Connected`);
      console.log(`✅ Cloudinary: Connected`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
