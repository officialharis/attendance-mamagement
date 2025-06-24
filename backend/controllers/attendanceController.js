import Attendance from "../models/Attendance.js";
import Subject from "../models/Subject.js";

// Mark All Students Attendance /api/attendance/mark
export const markStudentAttendance = async (req, res) => {
  if (req.user.role !== 'teacher')
    return res.status(403).json({ message: 'Access denied' });

  const { subjectId, date, records } = req.body;

  if (!Array.isArray(records) || !subjectId || !date)
    return res.status(400).json({ message: 'Invalid data' });

  try {

    const dateObj = new Date(date);
    const newRecords = [];

    // Verify subject assigned to teacher
    const subject = await Subject.findById(subjectId)
    if (!subject) return res.status(404).json({ success: false, message: "Subject not found" });
    if (subject.assignedTeacher.toString() != req.user.id) {
      return res.status(403).json({ success: false, message: "You are not assigned to this subject" });
    }

    for (let record of records) {
      const alreadyExists = await Attendance.findOne({
        student: record.studentId,
        subject: subjectId,
        date: dateObj,
      })

      if (!alreadyExists) {
        newRecords.push({
          student: record.studentId,
          teacher: req.user.id,
          subject: subjectId,
          date: dateObj,
          status: record.status,
        })
      }
    }
    await Attendance.insertMany(newRecords);
    res.status(201).json({ message: 'Attendance submitted successfully' });

  }
  catch (error) {
    console.error("Marking Students Attendance Error", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get Attendance Of students By Their id /api/attendance/student/:studentId
export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params
    const records = await Attendance.find({ student: studentId })
      .populate("subject", "name code")
      .populate("teacher", "name email")

    res.status(200).json({
      success: true,
      message: "Student Attendance Fetch Succesfully",
      records,
    });
  } catch (error) {
    console.error("Fetching Student Attendance Error:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get Attendance By Subject /api/attendance/subject/subjectId
export const getSubjectAttendance = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const records = await Attendance.find({ subject: subjectId })
      .populate("student", "name rollNumber")
      .populate("teacher", "name email");

    res.status(200).json({
      success: true,
      message: "Subject Wise Attendance Fetch Successfully",
      records,
    });
  } catch (error) {
    console.error("Fetching Subject Attendance Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// get All atendence /api/attendance/all
export const getAllAttendance = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: "Not Authorized" });
    }

    const { date, from, to } = req.query;
    let filter = {};

    if (date) {
      // Single date filter
      const selected = new Date(date);
      const nextDay = new Date(selected);
      nextDay.setDate(selected.getDate() + 1);
      filter.date = { $gte: selected, $lt: nextDay };
    }

    if (from && to) {
      // Date range filter
      const fromDate = new Date(from);
      const toDate = new Date(to);
      toDate.setDate(toDate.getDate() + 1); // Include entire last day
      filter.date = { $gte: fromDate, $lt: toDate };
    }

    const records = await Attendance.find(filter)
      .populate("student", "name rollNumber")
      .populate("subject", "name")
      .populate("teacher", "name");

    res.status(200).json({
      success: true,
      message: "All attendance fetched successfully",
      records,
    });
  } catch (error) {
    console.error("Fetching all attendance failed:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
