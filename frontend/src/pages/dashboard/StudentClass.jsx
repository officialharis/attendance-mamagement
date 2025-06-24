import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { assest } from "../../assets/assest";

const StudentClass = () => {
  const { user, axios } = useAppContext();
  const [classroom, setClassroom] = useState(null);
  const[message,setMessage]=useState('')
  

  useEffect(() => {
    const fetchClassroom = async () => {
      try {
        const res = await axios.get(`/api/classroom/student/${user.id}`);
        if (res.data.success) {
          setClassroom(res.data.classroom);
        } else {
          setClassroom(null); // No class found
          setMessage(res.data.message)
        }
      } catch (error) {
        console.error("Error fetching classroom:", error);
      }
    };

    if (user?.id) fetchClassroom();
  }, [user]);

  if (!classroom) return <p>{message}</p>;
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3 text-black uppercase">
        Classroom : <span className="text-primary">{classroom.name}</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {classroom.students.map((student) => (
          <div
            key={student._id}
            className="p-4 border rounded shadow bg-white flex flex-col items-center"
          >
            <img
              src={student.profileImage || assest.profile_icon}
              alt="Student"
              className="h-16 w-16 rounded-full object-cover mb-2"
            />
            <h3 className="text-md font-medium">{student.name}</h3>
            <p className="text-sm text-gray-500">{student.email}</p>
            <p className="text-xs text-gray-500">
              Rollnumber : {student.rollNumber}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentClass;
