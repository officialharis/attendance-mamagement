import jwt from "jsonwebtoken"
import User from "../models/Users.js"
import bcrypt from 'bcryptjs'
import { v2 as cloudinary } from 'cloudinary';

// Register User : /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password, role, rollNumber, department } = req.body;

        // Enhanced input validation
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body is required"
            });
        }

        // Check required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password, and role are required"
            });
        }

        // Role-specific validation
        if (role === "student" && !rollNumber) {
            return res.status(400).json({
                success: false,
                message: "Roll number is required for students"
            });
        }

        if (role === "teacher" && !department) {
            return res.status(400).json({
                success: false,
                message: "Department is required for teachers"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        // Check if JWT_SECRET is configured
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured in environment variables");
            return res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
        }

        // Check if user already exists
        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user object
        const userData = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role,
        };

        // Add role-specific fields
        if (role === 'student') {
            userData.rollNumber = rollNumber.trim();
        } else if (role === 'teacher') {
            userData.department = department;
        }

        const user = await User.create(userData);

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                rollNumber: user.rollNumber || null,
                department: user.department || null,
                token: token,
            }
        });

    } catch (error) {
        console.error("Registration Error Details:", {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            requestBody: req.body ? {
                email: req.body.email,
                role: req.body.role,
                passwordLength: req.body.password?.length
            } : null
        });

        // Handle specific error types
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Invalid input data: " + error.message
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        if (error.name === 'MongoError' || error.name === 'MongooseError') {
            return res.status(500).json({
                success: false,
                message: "Database connection error"
            });
        }

        // Generic error response
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred during registration. Please try again."
        });
    }
}

// Login User : /api/user/login
export const login = async (req, res) => {
    try {
        // Enhanced input validation
        const { email, password } = req.body;

        // Check if request body exists
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: "Request body is required"
            });
        }

        // Validate email and password presence
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        // Validate password length
        if (password.length < 1) {
            return res.status(400).json({
                success: false,
                message: "Password cannot be empty"
            });
        }

        // Check if JWT_SECRET is configured
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured in environment variables");
            return res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
        }

        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Verify password
        const isPassCorrect = await bcrypt.compare(password, user.password);
        if (!isPassCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Successful login response
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                rollNumber: user.rollNumber || null,
                token: token,
                profileImage: user.profileImage || "",
                department: user.department || null
            }
        });

    } catch (error) {
        // Enhanced error logging
        console.error("Login Error Details:", {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            requestBody: req.body ? { email: req.body.email, passwordLength: req.body.password?.length } : null
        });

        // Handle specific error types
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Invalid input data"
            });
        }

        if (error.name === 'MongoError' || error.name === 'MongooseError') {
            return res.status(500).json({
                success: false,
                message: "Database connection error"
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(500).json({
                success: false,
                message: "Token generation error"
            });
        }

        // Generic error response
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred during login. Please try again."
        });
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
                    profileImage: user.profileImage
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