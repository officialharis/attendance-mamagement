import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], required: true },
    rollNumber: {
        type: String,
        required: function () {
            return this.role === 'student'
        }
    },
    department: {
        type: String,
        enum: ['MCA', 'BCA', 'BBA', 'MBA'], // or dynamic later
        required: function () {
            return this.role === 'teacher';
        },
    },
    profileImage: {
        type: String,
        default: "",
    }
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User;
