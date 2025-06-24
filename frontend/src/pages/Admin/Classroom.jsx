import React, { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";

const Classroom = () => {
  const { classrooms ,navigate,fetchAllClassrooms,classUpdated} = useAppContext();
  // console.log(classrooms);

  useEffect(()=>{
    fetchAllClassrooms();
  },[classUpdated])
  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col items-end w-max mb-4">
          <h2 className="text-2xl font-semibold">Classroom List</h2>
          <div className="w-16 h-0.5 bg-primary rounded-full "></div>
        </div>
        <button
          onClick={()=>navigate("/admin/add-classroom")}
          className="px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary-dull transition cursor-pointer"
        >
          + Add Classroom
        </button>
      </div>

      {classrooms.length === 0 ? (
        <p className="text-gray-500">No classrooms found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((classroom) => (
            <div
              key={classroom._id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 relative"
            >
              <h3 className="text-lg font-semibold text-primary">
                {classroom.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {classroom.students.length} Student
                {classroom.students.length !== 1 ? "s" : ""}
              </p>

              <ul className="text-sm text-gray-700 list-disc list-inside">
                {classroom.students.map((student) => (
                  <li key={student._id}>{student.name}</li>
                ))}
              </ul>

              <button 
              className="bg-primary rounded p-2 text-white absolute bottom-2 right-2 mt-2 cursor-pointer hover:bg-primary-dull"
              onClick={() => navigate(`/admin/add-student-toclass/${classroom._id}`)}
              >Add Students</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Classroom;
