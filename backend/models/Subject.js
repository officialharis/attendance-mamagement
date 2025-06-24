import mongoose from "mongoose";
import User from "./Users.js";

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    assignedTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

const Subject = mongoose.models.subject || mongoose.model('subject', subjectSchema)
export default Subject;
