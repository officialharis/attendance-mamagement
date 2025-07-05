import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors'
import connectDatabase from './config/dbConnect.js';
import userRouter from './routes/userRouter.js'
import classroomRouter from './routes/classroomRouter.js';
import subjectRouter from './routes/subjectRouter.js';
import attendanceRouter from './routes/attendanceRouter.js';
import adminRouter from './routes/adminRouter.js';
import cloudinaryConnect from './config/cloudinary.js';
dotenv.config()

const app = express()
const port = process.env.PORT || 4000

// Alllowed origin
const allowedOrigins = [
  "http://localhost:5173", // development
  "https://attendance-management-frontend-vsnq.onrender.com"  //Production
]

// Allow only your frontend domain
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, Postman)
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


// const allowedOrigin = [
//     'http://localhost:5173',
// ]
app.use(express.json())
// app.use(cors({ origin: allowedOrigin, credentials: true }))

// Connecting With Database..
await connectDatabase();
await cloudinaryConnect();

app.get('/', (req, res) => {
  res.send("Api Is Working..")
})

// Diffrent Routes
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)
app.use('/api/classroom', classroomRouter)
app.use('/api/subject', subjectRouter)
app.use('/api/attendance', attendanceRouter)

// Listining Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, (req, res) => {
  console.log(`Server Is Running On http://localhost:${port}`);
})