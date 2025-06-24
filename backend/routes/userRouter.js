import express from 'express'
import { getAllStudents, getAllTeachers, getMe, login, register, updateUserProfile } from '../controllers/userControllers.js'
import { authUser } from '../middlewares/authUser.js'
import { upload } from "../config/multer.js"
const userRouter = express.Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/getStudents', getAllStudents)
userRouter.get('/getTeachres', getAllTeachers)
userRouter.get('/auth', authUser, getMe)
userRouter.put('/update-profile', authUser, upload.single('profileImage'), updateUserProfile)

export default userRouter;