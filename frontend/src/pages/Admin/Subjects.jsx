import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { assest } from "../../assets/assest";

const Subjects = () => {
  const { subjects, navigate, fetchAllSubjects, subjectUpdated, teachres ,axios} =
    useAppContext();
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState("");

  const handleAssignClick = (subjectId) => {
    setSelectedSubjectId(subjectId);
  };

  console.log("Subject Details",subjects)

  const assignTeacher = async () => {
    if (!selectedTeacherId || !selectedSubjectId) return;

    try {
      const adminToken = localStorage.getItem("adminToken");
      axios.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
      const subjectId = selectedSubjectId;
      const { data } = await axios.put(`/api/subject/assign/${subjectId}`, {
        teacherId: selectedTeacherId,
      });

      if (data.success) {
        toast.success("Teacher assigned successfully!");
        await fetchAllSubjects(); // Wait for data update
        setSelectedSubjectId(null);
        setSelectedTeacherId("");
      } else {
        toast.error(data.message || "Assignment failed.");
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Assignment error:", error);
    }
  };

  useEffect(() => {
    fetchAllSubjects();
  }, [subjectUpdated]);

  return (
    <div className="p-6 w-full">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex flex-col items-end w-max mb-4">
          <h2 className="text-2xl font-semibold">Subjects List</h2>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
        <button
          onClick={() => navigate("/admin/add-subject")}
          className="px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary-dull transition cursor-pointer"
        >
          + Add Subject
        </button>
      </div>

      {subjects.length === 0 ? (
        <p className="text-gray-500">No subjects found.</p>
      ) : (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject._id}
              className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center text-center"
            >
              <img
                src={
                  subject.assignedTeacher?.profileImage || assest.profile_icon
                }
                alt="Teacher Avatar"
                className="w-20 h-20 rounded-full mb-4"
              />
              <h3 className="text-lg font-semibold">{subject.name}</h3>
              <p className="text-sm text-gray-500 mb-2">Code: {subject.code}</p>
              <p className="text-sm text-gray-700 mb-4">
                {subject.assignedTeacher?.name} (
                {subject.assignedTeacher?.email})
              </p>
              <div className="flex gap-2">
                {/* <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">
                  Edit
                </button> */}
                <button
                  onClick={() => handleAssignClick(subject._id)}
                  className="px-3 py-2 bg-green-500 text-white rounded-md text-sm cursor-pointer"
                >
                  Assign
                </button>
              </div>
              {selectedSubjectId === subject._id && (
                <div className="mt-3 w-full">
                  <select
                    className="border p-2 w-full rounded"
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                  >
                    <option value="">Select Teacher</option>
                    {teachres.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} ({t.email})
                      </option>
                    ))}
                  </select>
                  <button
                    className="w-full mt-2 bg-primary text-white py-1 rounded cursor-pointer"
                    onClick={assignTeacher}
                  >
                    Confirm Assign
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subjects;
