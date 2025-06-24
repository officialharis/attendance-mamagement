// models/Attendance.js
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subject',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Leave'],
    required: true,
  },
}, {
  timestamps: true,
});

attendanceSchema.index({ student: 1, subject: 1, date: 1 }, { unique: true });

const Attendance = mongoose.models.attendance || mongoose.model('attendance', attendanceSchema)
export default Attendance;