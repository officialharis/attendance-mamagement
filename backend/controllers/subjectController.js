import Subject from "../models/Subject.js";


// Get All Subjects /api/subject/get
export const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().populate("assignedTeacher", "name email profileImage")
        res.status(200).json({ success: true, subjects });
    } catch (error) {
        console.error("Getting All Subject Error", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Modify Subject Teacher  /api/subject/assign/:subjectId
// PUT /api/subject/assign/:subjectId
export const changeSubjectTeacher = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const { teacherId } = req.body;

        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const updatedSubject = await Subject.findByIdAndUpdate(
            subjectId,
            { assignedTeacher: teacherId },
            { new: true }
        );

        if (!updatedSubject) {
            return res.status(404).json({ success: false, message: "Subject not found" });
        }

        res.status(200).json({ success: true, message: "Teacher assigned successfully", subject: updatedSubject });
    } catch (error) {
        console.error("Changing Subject Teacher Error", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSubjectByTeacherId = async (req, res) => {
    try {
        const { teacherId } = req.params

        const subject = await Subject.find({ assignedTeacher: teacherId })
        if (!subject) {
            return res.status(404).json({ success: false, message: "subject not found for this teacher" });
        }

        res.status(200).json({
            success: true,
            message: "subject details fetched successfully",
            subject,
        });
    } catch (error) {
        console.error("Error fetching subject by teacherId:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}