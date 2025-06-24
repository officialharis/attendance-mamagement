import jwt from "jsonwebtoken"
import User from "../models/Users.js"
import bcrypt from 'bcryptjs'
import { v2 as cloudinary } from 'cloudinary';

// Register User : /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password, role, rollNumber, department } = req.body
        if (!name || !email || !password || !role || (role === "student" && !rollNumber) || (role === "teacher" && !department)) {
            return res.status(400).json({ success: false, message: "Missing Data" })
        }

        // Check Is User Is Already Exist Or Not
        const existing = await User.findOne({ email })
        if (existing) {
            return res.status(400).json({ success: false, message: "User Already Exists" })
        }

        // Hasing Password
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            rollNumber: role === 'student' ? rollNumber : undefined,
            department,
        })

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token,
            }
        })
    } catch (error) {
        console.error("register Error", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Login User : /api/user/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Missing email or password" })
        }

        // Check Is User Is Already Exist Or Not
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: "User Does Not Exists" })
        }

        // Compare Password With Hashed Password
        const isPassCorrect = await bcrypt.compare(password, user.password)
        if (!isPassCorrect) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" })
        }

        // Creating JWT Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token
            }
        })
    } catch (error) {
        console.error("Login Error", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Get All Students /api/user/getStudents
export const getAllStudents = async (req, res) => {
    try {
        // Get filter params from query (e.g., department or name)
        const { department, name } = req.query;

        // Base filter: only students
        const filter = { role: 'student' };

        // Add department filter if provided
        if (department) {
            filter.department = department;
        }

        // Add case-insensitive name filter if provided
        if (name) {
            filter.name = { $regex: name, $options: 'i' }; // partial match
        }

        const students = await User.find(filter);

        res.status(200).json({
            success: true,
            message: "Students retrieved successfully",
            students,
        });
    } catch (error) {
        console.error("Error getting students:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllTeachers = async (req, res) => {
    try {
        const { department } = req.query
        // Base filter: only teachers
        const filter = { role: 'teacher' };

        if (department) {
            filter.department = department
        }

        const teachers = await User.find(filter);

        res.status(200).json({
            success: true,
            message: "Teachers retrieved successfully",
            teachers,
        });

    } catch (error) {
        console.error("Error getting Teachers:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Authorized User /api/user/auth
export const getMe = async (req, res) => {
    try {
        // The 'req.user' object is populated by your 'authUser' middleware
        // It contains { id: user._id, role: user.role } from the JWT payload.
        // We need to fetch the full user details from the database.
        const user = await User.findById(req.user.id).select('-password'); // Exclude password

        if (user) {
            res.status(200).json({
                success: true,
                message: "User data fetched successfully.",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    // Conditionally add rollNumber or department based on role
                    ...(user.role === 'student' && { rollNumber: user.rollNumber }),
                    ...(user.role === 'teacher' && { department: user.department }),
                    profileImage:user.profileImage
                }
            });
        } else {
            // User not found in DB, even if token was valid (e.g., user deleted)
            res.status(404).json({ success: false, message: "User data not found." });
        }
    } catch (error) {
        console.error("Error fetching user data in getMe:", error);
        res.status(500).json({ success: false, message: "Failed to fetch user data." });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { id, role } = req.user;
        const { name, email, rollNumber, department } = req.body;
        let profileImageUrl;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' })
            profileImageUrl = result.secure_url;
        }

        const updateFields = {
            ...(name && { name }),
            ...(email && { email }),
            ...(profileImageUrl && { profileImage: profileImageUrl }),
        };

        if (role === 'student') {
            updateFields.rollNumber = rollNumber || "";
        } else if (role === 'teacher') {
            updateFields.department = department || "";
        }
        const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
            new: true,
        });

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}