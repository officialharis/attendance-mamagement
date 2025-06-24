import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";

const ViewTeachers = () => {
  const { teachres, navigate, teacherUpdated, fetchAllTeachres } =
    useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const startIndex = (currentPage - 1) * recordsPerPage;

  useEffect(() => {
    fetchAllTeachres();
  }, [teacherUpdated]);

  const filteredTeachres = teachres.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.name.toLowerCase().includes(term) ||
      t.email.toLowerCase().includes(term) ||
      t.department.toLowerCase().includes(term)
    );
  });

  const paginatedData = filteredTeachres.slice(
    startIndex,
    startIndex + recordsPerPage
  );
  // console.log(teachres)

  return (
    <div className="p-6 w-full">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex flex-col items-end w-max mb-4">
          <h2 className="text-2xl font-semibold">Teachers List</h2>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>

        <button
          onClick={() => navigate("/admin/add-teacher")}
          className="px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary-dull transition cursor-pointer"
        >
          + Add Teacher
        </button>
      </div>

      {teachres.length === 0 ? (
        <p className="text-gray-500">No Teachers found.</p>
      ) : (
        <div className="w-full overflow-x-auto rounded-lg">
          <div className="mb-4 w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search by Name, Email, or Department"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 border-b">#</th>
                <th className="py-2 px-3 md:py-3 md:px-4 border-b text-sm md:text-base">
                  Name
                </th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Department</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((teachres, index) => (
                <tr key={teachres._id} className="text-center">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{teachres.name}</td>
                  <td className="py-2 px-3 border-b break-words max-w-xs">
                    {teachres.email}
                  </td>
                  <td className="py-2 px-4 border-b">{teachres.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Controls For Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-400 cursor-pointer"
            >
              Prev
            </button>
            <span className="px-3 py-1 text-gray-700">Page {currentPage}</span>
            <button
              disabled={currentPage * recordsPerPage >= filteredTeachres.length}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-400 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTeachers;
