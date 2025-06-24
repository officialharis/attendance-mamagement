import Classroom from "../models/Classroom.js"
import User from "../models/Users.js"



// Addng Students In The Classroom Only admin or teacher can add Students In Classroom
// /api/classroom/add-studenst/:classId
export const addStudentsToClassroom = async (req, res) => {
    try {
        const { studentIds } = req.body
        const { classId } = req.params

        // console.log("Role:", req.user.role);
        // console.log("classId:", classId);
        // console.log("studentIds:", studentIds);

        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Not Authorized" })
        }

        // Checking Classroom Is There Or Not
        const classroom = await Classroom.findById(classId)
        if (!classroom) {
            return res.status(404).json({ success: false, message: "Classroom not found" });
        }

        // Check Is The Students Are Actually Students
        const students = await User.find({
            _id: { $in: studentIds },
            role: "student"
        }).select('_id')

        const validStudentIds = students.map(s => s._id)

        await Classroom.findByIdAndUpdate(classId, {
            $addToSet: { students: { $each: validStudentIds } }
        });

        res.status(200).json({
            success: true,
            message: "Students added to classroom successfully"
        });

    } catch (error) {
        console.error("Adding Students To Classroom Error", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find().populate("students", "name")
        res.status(200).json({
            success: true,
            message: "Classrooms retrieved successfully",
            classrooms,
        });
    } catch (error) {
        console.error("Fetching All Classroom Error", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getClassroomByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Find the classroom that includes this student
        const classroom = await Classroom.findOne({ students: studentId })
            .populate('students', 'name email rollNumber profileImage') // populate student fields

        if (!classroom) {
            return res.status(404).json({ success: false, message: "Classroom not found for this student" });
        }

        res.status(200).json({
            success: true,
            message: "Classroom details fetched successfully",
            classroom,
        });
    } catch (error) {
        console.error("Error fetching classroom by studentId:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getClassroomByClassroomId = async (req, res) => {
    try {
        const { classroomId } = req.params;

        const classroom = await Classroom.findById(classroomId)
            .populate("students", "name email rollNumber profileImage");

        if (!classroom) {
            return res.status(404).json({ success: false, message: "Classroom not found" });
        }

        res.status(200).json({
            success: true,
            message: "Classroom details fetched successfully",
            students: classroom.students,
        });
    } catch (error) {
        console.error("Error fetching classroom by classroomId:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
