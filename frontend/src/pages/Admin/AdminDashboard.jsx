import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { CSVLink } from "react-csv";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const { students, teachres, classrooms, subjects, navigate, axios } =
    useAppContext();
  const COLORS = ["#3b82f6", "#ef4444"]; // Blue, Red
  const [selectedDate, setSelectedDate] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [barData, setBarData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [viewMode, setViewMode] = useState("chart");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const uniqueSubjects = [
    "All",
    ...new Set(attendance.map((rec) => rec.subject?.name).filter(Boolean)),
  ];
  const filteredAttendance =
    selectedSubject === "All"
      ? attendance
      : attendance.filter((rec) => rec.subject?.name === selectedSubject);

  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedData = filteredAttendance.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classrooms: 0,
    subjects: 0,
  });

  useEffect(() => {
    setStats({
      students: students.length,
      teachers: teachres.length,
      classrooms: classrooms.length,
      subjects: subjects.length,
    });
  }, [students, teachres, classrooms, subjects]);

  //   Fetching All Attendence...
  const fetchAllAttendance = async () => {
    const adminToken = localStorage.getItem("adminToken");
    axios.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
    try {
      let url = "/api/attendance/all";
      if (selectedDate) {
        url += `?date=${selectedDate}`;
      }
      const res = await axios.get(url);
      if (res.data.success) {
        setAttendance(res.data.records);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch attendance");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllAttendance();
  }, [selectedDate]);

  // Group attendance by status
  const data = [
    {
      name: "Present",
      value: attendance.filter((a) => a.status === "Present").length,
    },
    {
      name: "Absent",
      value: attendance.filter((a) => a.status === "Absent").length,
    },
  ];

  //   Process For Organizing data for bar chart...
  useEffect(() => {
    const subjectWise = {};

    attendance.forEach((record) => {
      const subjectName = record.subject?.name || "Unknown";
      if (!subjectWise[subjectName]) {
        subjectWise[subjectName] = {
          subject: subjectName,
          Present: 0,
          Absent: 0,
        };
      }
      subjectWise[subjectName][record.status]++;
    });

    setBarData(Object.values(subjectWise));
  }, [attendance]);

  const handleFilter = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both From and To dates");
      return;
    }

    const adminToken = localStorage.getItem("adminToken");
    axios.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;

    try {
      const res = await axios.get(
        `/api/attendance/all?from=${fromDate}&to=${toDate}`
      );
      if (res.data.success) {
        setAttendance(res.data.records);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to filter attendance");
      console.error(error);
    }
  };

  // Clear Filter
  const handleClearFilter = () => {
    setSelectedDate("");
    setFromDate("");
    setToDate("");
    fetchAllAttendance(); // Re-fetch all data with no filters
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {/* Cards... */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
        {/* Student Card */}
        <div
          className="bg-blue-100 text-blue-800 p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/admin/students")}
        >
          <p className="text-sm font-medium">Total Students</p>
          <p className="text-2xl font-bold mt-2">{stats.students}</p>
        </div>

        {/* Teacher Card */}
        <div
          className="bg-green-100 text-green-800 p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/admin/teachers")}
        >
          <p className="text-sm font-medium">Total Teachers</p>
          <p className="text-2xl font-bold mt-2">{stats.teachers}</p>
        </div>

        {/* Subject Card */}
        <div
          className="bg-purple-100 text-purple-800 p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/admin/subjects")}
        >
          <p className="text-sm font-medium">Total Subjects</p>
          <p className="text-2xl font-bold mt-2">{stats.subjects}</p>
        </div>

        {/* Classroom Card */}
        <div
          className="bg-yellow-100 text-yellow-800 p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/admin/class")}
        >
          <p className="text-sm font-medium">Total Classrooms</p>
          <p className="text-2xl font-bold mt-2">{stats.classrooms}</p>
        </div>
      </div>

      <div className="mt-5">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6">
          {/* Filter by Specific Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-700">
              Filter by Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* From Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-700">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-700">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Filter Button [Apply and Clear*/}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 invisible">
              Apply Filter
            </label>
            <button
              onClick={handleFilter}
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition shadow cursor-pointer"
            >
              Apply Filter
            </button>
            <button
              onClick={handleClearFilter}
              className="bg-gray-300 text-gray-800 py-2 mt-2 rounded hover:bg-gray-400 transition shadow cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Overall Attendance Report</h2>
        {/* View Filter [chart Or Table] */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="viewMode"
            className="text-sm font-medium text-gray-600"
          >
            View as:
          </label>
          <select
            id="viewMode"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="chart">Chart</option>
            <option value="table">Table</option>
          </select>

          {/* CSV Button And Filter Only For Table View */}
          {viewMode === "table" && attendance.length > 0 && (
            <>
              <CSVLink
                data={attendance.map((rec) => ({
                  Student: rec.student?.name,
                  Subject: rec.subject?.name,
                  Status: rec.status,
                  Date: new Date(rec.date).toLocaleDateString(),
                }))}
                filename={"attendance-report.csv"}
                className="bg-green-600 text-white px-3 py-1 rounded shadow hover:bg-green-700 transition text-sm"
              >
                Export CSV
              </CSVLink>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="subjectFilter"
                  className="text-sm font-medium text-gray-600"
                >
                  Filter by Subject:
                </label>
                <select
                  id="subjectFilter"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {uniqueSubjects.map((subject, i) => (
                    <option key={i} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        {attendance.length > 0 ? (
          viewMode === "chart" ? (
            <>
              {/* Pie Chart */}
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart width={400} height={300}>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="bg-white p-4 rounded-xl shadow mt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Subject-wise Attendance
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={barData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Present" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="Absent" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            // Table View
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full text-sm text-left bg-white rounded shadow">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 border-b">Student</th>
                    <th className="px-4 py-2 border-b">Subject</th>
                    <th className="px-4 py-2 border-b">Status</th>
                    <th className="px-4 py-2 border-b">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((rec, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-2 border-b">
                        {rec.student?.name}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {rec.subject?.name}
                      </td>
                      <td
                        className={`px-4 py-2 border-b font-medium ${
                          rec.status === "Present"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {rec.status}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {new Date(rec.date).toLocaleDateString()}
                      </td>
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
                <span className="px-3 py-1 text-gray-700">
                  Page {currentPage}
                </span>
                <button
                  disabled={
                    currentPage * recordsPerPage >= filteredAttendance.length
                  }
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-400 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )
        ) : (
          <p className="text-center text-2xl text-red-700 mt-10">No data</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
