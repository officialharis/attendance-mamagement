import { useAppContext } from "../../context/AppContext";
import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { BookOpen } from "lucide-react";

const TeacherSubject = () => {
  const { axios, user ,navigate} = useAppContext();
  const [assignSubject, setAssignSubject] = useState([]);

  const fetchTeacherSubject = async (params) => {
    const userToken = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
    try {
      const { data } = await axios.get(`/api/subject/get/${user.id}`);
      if (data.success) {
        setAssignSubject(data.subject);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchTeacherSubject();
    }
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Assigned Subjects
      </h2>

      {assignSubject.length === 0 ? (
        <p className="text-center text-gray-500">
          You are not assigned to any subject.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {assignSubject.map((subject) => (
            <div
              key={subject._id}
              className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-all duration-300 border"
            >
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="h-8 w-8 text-indigo-600" />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-gray-500">Code: {subject.code}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Assigned Teacher Name: {user.name}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Created At: {new Date(subject.createdAt).toLocaleDateString()}
              </p>
              

              <div className="flex justify-center">
                <button 
                onClick={()=>navigate(`/dashboard/subject-attendence-report/${subject._id}`)}
                className="rounded text-white bg-primary hover:bg-primary-dull cursor-pointer p-2 mt-3">
                 Download Attendence Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherSubject;
