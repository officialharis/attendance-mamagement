import express from 'express'
import { authUser } from '../middlewares/authUser.js';
import { changeSubjectTeacher, getAllSubjects, getSubjectByTeacherId } from '../controllers/subjectController.js';
import { authAdmin } from '../middlewares/authAdmin.js';
const subjectRouter=express.Router()

subjectRouter.get('/get',getAllSubjects)
subjectRouter.put('/assign/:subjectId',authAdmin,changeSubjectTeacher)
subjectRouter.get('/get/:teacherId',getSubjectByTeacherId)

export default subjectRouter;