import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";

const MarkAttendance = () => {
  const { axios, user } = useAppContext();
  const [subjects, setSubjects] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    subjectId: "",
    classroomId: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const [attendance, setAttendance] = useState({}); // {studentId: "present"/"absent"}

  // Fetch assigned subjects
  const fetchSubjects = async () => {
    const res = await axios.get(`/api/subject/get/${user.id}`);
    if (res.data.success) setSubjects(res.data.subject);
  };

  // Fetch all classrooms
  const fetchClassrooms = async () => {
    const res = await axios.get(`/api/classroom/getAllClassrooms`);
    if (res.data.success) setClassrooms(res.data.classrooms);
  };

  // Fetch students in classroom classroomId
  const fetchStudents = async (classroomId) => {
    try {
      const res = await axios.get(`/api/classroom/get/${classroomId}`);

      if (res.data.success && res.data.students) {
        setStudents(res.data.students);
      } else {
        console.log("No students found or response not successful");
        setStudents([]); // fallback if no students
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setStudents([]); // fallback if API fails
    }
  };
  useEffect(() => {
    if (user?.id) {
      fetchSubjects();
      fetchClassrooms();
    }
  }, [user]);

  useEffect(() => {
    if (form.classroomId) fetchStudents(form.classroomId);
  }, [form.classroomId]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const records = students.map((student) => ({
      studentId: student._id,
      status: attendance[student._id] || "absent",
    }));
    const userToken = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
    try {
      await axios.post("/api/attendance/mark", {
        subjectId: form.subjectId,
        date: form.date,
        records,
      });
      toast.success("Attendance submitted successfully");
      //  Clear attendance selection
      setAttendance({});
      //  Optionally reset form
      setForm((prev) => ({
        ...prev,
        subjectId: "",
        classroomId: "",
      }));
      setStudents([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="p-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Mark Attendance
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={form.subjectId}
              onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
              className="border px-3 py-2 rounded"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subj) => (
                <option key={subj._id} value={subj._id}>
                  {subj.name} ({subj.code})
                </option>
              ))}
            </select>

            <select
              value={form.classroomId}
              onChange={(e) =>
                setForm({ ...form, classroomId: e.target.value })
              }
              className="border px-3 py-2 rounded"
              required
            >
              <option value="">Select Classroom</option>
              {classrooms.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="date"
            className="border px-3 py-2 rounded w-full"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />

          {students.length > 0 ? (
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between border p-3 rounded"
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-end">
                    {["Present", "Absent"].map((status) => (
                      <label
                        key={status}
                        className={`px-4 py-1 rounded-full border text-sm sm:text-base cursor-pointer transition
        ${
          attendance[student._id] === status
            ? status === "Present"
              ? "bg-green-100 text-green-700 border-green-500"
              : "bg-red-100 text-red-700 border-red-500"
            : "bg-white text-gray-700 border-gray-300 hover:shadow-sm"
        }`}
                      >
                        <input
                          type="radio"
                          name={`attendance-${student._id}`}
                          value={status}
                          onChange={() =>
                            handleAttendanceChange(student._id, status)
                          }
                          checked={attendance[student._id] === status}
                          className="hidden"
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No students found</p>
          )}

          {students.length > 0 && (
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded cursor-pointer"
            >
              Submit Attendance
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default MarkAttendance;
