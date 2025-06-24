// models/Classroom.js
import mongoose from 'mongoose';
import User from './Users.js';

const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

const Classroom = mongoose.models.classroom || mongoose.model('classroom', classroomSchema)
export default Classroom;

