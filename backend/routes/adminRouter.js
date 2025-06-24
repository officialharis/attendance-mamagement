import express from 'express'
import { addClassroom, addStudent, addSubject, addTeacher, adminAuth, adminLogin } from '../controllers/adminControllers.js';
import { authAdmin } from '../middlewares/authAdmin.js'
const adminRouter = express.Router()

adminRouter.post('/login', adminLogin)
adminRouter.get('/auth', authAdmin, adminAuth)
adminRouter.post('/add-student',authAdmin,addStudent)
adminRouter.post('/add-teacher',authAdmin,addTeacher)
adminRouter.post('/add-classroom',authAdmin,addClassroom)
adminRouter.post('/add-subject',authAdmin,addSubject)


export default adminRouter;