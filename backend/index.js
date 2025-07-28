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

// ✅ CORS Fix
const allowedOrigins = [
  "http://localhost:5173", // ✅ Production domain
  "https://attendance-mamagement-frontend.vercel.app", // ✅ frontend domain
  "https://attendance-mamagement-backend.vercel.app"    // ✅ backend domain
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
app.use(express.json());

// Connect to DB and cloud
await connectDatabase();
await cloudinaryConnect();

// Test Route
app.get('/', (req, res) => {
  res.send("API is Working...");
});

// API Routes
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/classroom', classroomRouter);
app.use('/api/subject', subjectRouter);
app.use('/api/attendance', attendanceRouter);

// Server listen
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
