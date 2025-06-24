import { useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddStudentsToClassroom = () => {
  const { students, axios, fetchAllStudents } = useAppContext();
  const { classId } = useParams();
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedStudents.length === 0) {
      return toast.error("Please select at least one student");
    }

    try {
      const token = localStorage.getItem("adminToken");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.put(`/api/classroom/add-students/${classId}`, {
        studentIds: selectedStudents,
      });

      if (res.data.success) {
        toast.success("Students added successfully");
        setSelectedStudents([]);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
        Add Students to Classroom
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto border p-4 rounded-lg bg-white shadow-sm">
          {students.map((student) => (
            <label
              key={student._id}
              className={`flex items-start gap-3 p-3 rounded-md border hover:shadow-md transition duration-300 cursor-pointer ${
                selectedStudents.includes(student._id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedStudents.includes(student._id)}
                onChange={() => handleCheckboxChange(student._id)}
                className="mt-1 accent-blue-600 w-4 h-4"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{student.name}</p>
                <p className="text-sm text-gray-500">{student.email}</p>
                <p className="text-sm text-gray-500">
                  Roll: {student.rollNumber}
                </p>
              </div>
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md shadow transition duration-200 cursor-pointer"
        >
          Add Selected Students
        </button>
      </form>
    </div>
  );
};

export default AddStudentsToClassroom;
