import jwt from "jsonwebtoken"
import User from "../models/Users.js";
import Classroom from "../models/Classroom.js";
import Subject from "../models/Subject.js";
import bcrypt from 'bcryptjs'


export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing email or password",
            });
        }

        // 2. Compare with .env credentials
        const isEmailMatch = email === process.env.ADMIN_EMAIL;
        const isPasswordMatch = password === process.env.ADMIN_PASSWORD;

        if (!isEmailMatch || !isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin credentials",
            });
        }

        // 3. Create JWT token
        const token = jwt.sign(
            { id: "admin", email, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 4. Send response
        res.status(200).json({
            success: true,
            user: {
                id: "admin",
                email,
                role: "admin",
            },
            token,
        });
    } catch (error) {
        console.error("Admin Login Error", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong during admin login",
        });
    }
};

export const adminAuth = async (req, res) => {
    try {
        // The 'req.user' object is populated by the authentication middleware (e.g., authUser).
        // It contains the decoded JWT payload: { id: "admin", email: "admin@example.com", role: "admin" }
        if (req.user && req.user.role === 'admin') {
            res.status(200).json({
                success: true,
                message: "Admin data fetched successfully.",
                user: {
                    id: req.user.id,
                    email: req.user.email,
                    role: req.user.role,
                },
            });
        } else {
            
            res.status(401).json({ success: false, message: "Not authorized as admin." });
        }
    } catch (error) {
        console.error("Admin Me Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch admin data." });
    }
};

export const addStudent = async (req, res) => {
    try {
        if (req.user && req.user.role === 'admin') {
            const { name, email, password, rollNumber } = req.body
            if (!name || !email || !password || !rollNumber) {
                return res.status(400).json({ success: false, message: "Please provide name, email, password, and roll number." })
            }

            // Check Is User Is Already Exist Or Not
            const existing = await User.findOne({ email })
            if (existing) {
                return res.status(400).json({ success: false, message: "User Already Exists" })
            }

            // Hasing Password
            const hashedPassword = await bcrypt.hash(password, 10)

            const newStudent = await User.create({
                name,
                email,
                password: hashedPassword,
                role: 'student',
                rollNumber,
            })

            res.status(201).json({
                success: true,
                message: "Student Added successfully",
                student: {
                    id: newStudent._id,
                    name: newStudent.name,
                    email: newStudent.email,
                    role: newStudent.role,
                }
            })
        } else {
            res.status(401).json({ success: false, message: "Not authorized as admin." });
        }
    } catch (error) {
        console.error("Add Student By Admin Error:", error);
        res.status(500).json({ success: false, message: "Failed to Add Student." });
    }
}

export const addTeacher = async (req, res) => {
    try {
        if (req.user && req.user.role === 'admin') {
            const { name, email, password, department } = req.body
            if (!name || !email || !password || !department) {
                return res.status(400).json({ success: false, message: "Please provide name, email, password, and department." })
            }

            // Check Is User Is Already Exist Or Not
            const existing = await User.findOne({ email })
            if (existing) {
                return res.status(400).json({ success: false, message: "User Already Exists" })
            }

            // Hasing Password
            const hashedPassword = await bcrypt.hash(password, 10)

            const newTeacher = await User.create({
                name,
                email,
                password: hashedPassword,
                role: 'teacher',
                department,
            })

            res.status(201).json({
                success: true,
                message: "Teacher Added successfully",
                teacher: {
                    id: newTeacher._id,
                    name: newTeacher.name,
                    email: newTeacher.email,
                    role: newTeacher.role,
                    department: newTeacher.department
                }
            })
        } else {
            res.status(401).json({ success: false, message: "Not authorized as admin." });
        }
    } catch (error) {
        console.error("Add Teacher By Admin Error:", error);
        res.status(500).json({ success: false, message: "Failed to Add Teacher." });
    }
}

// Creating ClassRoom Only Admin Can Create : /api/admin/add-classroom
export const addClassroom = async (req, res) => {
    try {
        const name = req.body.classroom?.trim().toUpperCase();

        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Not Authorized" })
        }

        // Check if classroom already exists
        const existingClassroom = await Classroom.findOne({ name });
        if (existingClassroom) {
            return res.status(400).json({ success: false, message: "Classroom already exists" });
        }

        await Classroom.create({ name })

        res.status(201).json({
            success: true,
            message: "Classroom Created successfully",
        })
    } catch (error) {
        console.error("Adding Classroom Error", error)
        res.status(500).json({ success: false, message: "Failed to create classroom." })
    }
}

// Adding Subject By Only admin /api/admin/add-subject
export const addSubject = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const name = req.body.name?.trim();
        const code = req.body.code?.trim().toUpperCase();
        

        if (!name || !code) {
            return res.status(400).json({ success: false, message: "Please provide name, code." });
        }

        // Prevent duplicate subject codes
        const existing = await Subject.findOne({ code });
        if (existing) {
            return res.status(400).json({ success: false, message: "Subject with this code already exists" });
        }

        const subject = await Subject.create({
            name,
            code
        });

        res.status(201).json({
            success: true,
            message: "Subject created successfully",
            subject
        });
    } catch (error) {
        console.error("Adding Subject Error", error.message)
        res.status(500).json({ success: false, message: "Failed to create subject." })
    }
}
