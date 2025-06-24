import express from 'express'
import { authUser } from '../middlewares/authUser.js';
import { getAllAttendance, getStudentAttendance, getSubjectAttendance, markStudentAttendance } from '../controllers/attendanceController.js';
import { authAdmin } from '../middlewares/authAdmin.js'

const attendanceRouter = express.Router()
attendanceRouter.post('/mark', authUser, markStudentAttendance)
attendanceRouter.get('/student/:studentId', getStudentAttendance)
attendanceRouter.get('/subject/:subjectId', getSubjectAttendance)
attendanceRouter.get('/all', authAdmin, getAllAttendance)

export default attendanceRouter;