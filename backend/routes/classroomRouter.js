import express from 'express'
import { authUser } from '../middlewares/authUser.js'
import { addStudentsToClassroom, getAllClassrooms, getClassroomByClassroomId, getClassroomByStudentId } from '../controllers/classroomControlles.js'
import { authAdmin } from '../middlewares/authAdmin.js'

const classroomRouter = express.Router()


classroomRouter.put('/add-students/:classId', authAdmin, addStudentsToClassroom)
classroomRouter.get('/getAllClassrooms', getAllClassrooms)
classroomRouter.get('/student/:studentId',getClassroomByStudentId)
classroomRouter.get('/get/:classroomId',getClassroomByClassroomId)

export default classroomRouter;