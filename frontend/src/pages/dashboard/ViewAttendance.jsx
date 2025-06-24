import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { CSVLink } from "react-csv";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ViewAttendance = () => {
  const COLORS = ["#4ade80", "#f87171"]; // Green = Present, Red = Absent
  const { user, attendance, fetchAttendance } = useAppContext();
  const [view, setView] = useState("table");
  const [loading, setLoading] = useState(true);
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
  useEffect(() => {
    if (user && user?.id) {
      setLoading(false);
      fetchAttendance();
    } else {
      setLoading(true);
    }
  }, [user]);

  const subjectStats = {};

  attendance.forEach((record) => {
    const subjectName = record.subject?.name || "Unknown";
    if (!subjectStats[subjectName]) {
      subjectStats[subjectName] = {
        subject: subjectName,
        Present: 0,
        Absent: 0,
      };
    }
    subjectStats[subjectName][record.status]++;
  });

  const chartData = Object.values(subjectStats);
  const paginatedData = filteredAttendance.slice(
    startIndex,
    startIndex + recordsPerPage
  );
  // For Displaying Progress bar
  const progressData = Object.values(subjectStats).map((entry) => {
    const total = entry.Present + entry.Absent;
    const percent = total === 0 ? 0 : Math.round((entry.Present / total) * 100);
    return { ...entry, total, percent };
  });

  // Low Attendance Alert
  const subjectPercentages = Object.entries(subjectStats).map(
    ([subject, stats]) => {
      const total = stats.Present + stats.Absent;
      const percentage = total > 0 ? (stats.Present / total) * 100 : 0;
      return {
        subject,
        ...stats,
        percentage: percentage.toFixed(2),
      };
    }
  );
  const lowAttendanceSubjects = subjectPercentages.filter(
    (subj) => subj.percentage < 75
  );

  if (loading) return <p>Loading attendance...</p>;
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Attendance</h2>
      {lowAttendanceSubjects.length > 0 && (
        <div className="bg-red-50 border border-red-400 text-red-700 p-4 rounded mt-6 mb-6">
          <h3 className="font-semibold mb-2">⚠️ Low Attendance Alert</h3>
          <ul className="list-disc ml-5">
            {lowAttendanceSubjects.map((s, i) => (
              <li key={i}>
                <span className="font-medium">{s.subject}</span> –{" "}
                {s.percentage}% attendance
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Viwe Mode Table Or Chart */}
      <div className="flex mb-4 items-center gap-2 flex-col sm:flex-row">
        <label htmlFor="viewMode" className="text-sm font-medium text-gray-600">
          View as:
        </label>
        <select
          id="viewMode"
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="table">Table</option>
          <option value="chart">Chart</option>
          <option value="calendar">Calendar</option>
        </select>
        {/* Filter Attendance By Subjeact And CSVExport */}
        {view == "table" && (
          <>
            <label
              className="text-sm font-medium text-gray-600"
              htmlFor="filterBySubject"
            >
              Filter By Subject:
            </label>
            <select
              id="filterBySubject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {uniqueSubjects.map((subject, i) => (
                <option value={subject} key={i}>
                  {subject}
                </option>
              ))}
            </select>
            <CSVLink
              data={attendance.map((rec) => ({
                Student: rec.student?.name || "Student Name",
                Subject: rec.subject?.name,
                Status: rec.status,
                Date: new Date(rec.date).toLocaleDateString(),
              }))}
              filename={"attendance-report.csv"}
              className="bg-green-600 text-white px-3 py-1 rounded shadow hover:bg-green-700 transition text-sm"
            >
              Export CSV
            </CSVLink>
          </>
        )}
      </div>
      {/* Chart View */}
      {view == "chart" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {chartData.map((subject, index) => {
            const data = [
              { name: "Present", value: subject.Present },
              { name: "Absent", value: subject.Absent },
            ];
            return (
              <div key={index} className="bg-white p-4 shadow rounded">
                <h3 className="text-center font-semibold mb-2">
                  {subject.subject}
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {data.map((entry, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={COLORS[i % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            );
          })}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">
              Subject-wise Attendance Progress
            </h3>
            {progressData.map((subject, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {subject.subject}
                  </span>
                  <span className="text-sm text-gray-600">
                    {subject.Present}/{subject.total} ({subject.percent}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      subject.percent < 50 ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{ width: `${subject.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Table View */}
      {view == "table" && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow-md text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Subject</th>
                <th className="p-3 border">Code</th>
                <th className="p-3 border">Teacher</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((record) => (
                <tr key={record._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 border">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="p-3 border">{record.subject?.name}</td>
                  <td className="p-3 border">{record.subject?.code}</td>
                  <td className="p-3 border">{record.teacher?.name}</td>
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === "Present"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {record.status}
                    </span>
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
            <span className="px-3 py-1 text-gray-700">Page {currentPage}</span>
            <button
              disabled={currentPage * recordsPerPage >= attendance.length}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="bg-blue-600 text-white px-3 py-1 rounded disabled:bg-gray-400 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
      {/* Calender View */}
      {view === "calendar" && (
        <div className="bg-white p-4 rounded shadow mt-4">
          <Calendar
            tileClassName={({ date }) => {
              const recordsOnDate = attendance.filter(
                (rec) =>
                  new Date(rec.date).toDateString() === date.toDateString()
              );

              if (recordsOnDate.length > 0) {
                const hasPresent = recordsOnDate.some(
                  (r) => r.status === "Present"
                );
                const hasAbsent = recordsOnDate.some(
                  (r) => r.status === "Absent"
                );

                if (hasPresent && hasAbsent) return "mixed-day";
                if (hasPresent) return "present-day";
                if (hasAbsent) return "absent-day";
              }

              return null;
            }}
          />
          <div className="mt-4 text-sm">
            <span className="inline-block w-4 h-4 bg-green-200 mr-2 rounded-sm" />{" "}
            Present
            <span className="inline-block w-4 h-4 bg-red-200 ml-4 mr-2 rounded-sm" />{" "}
            Absent
            <span className="inline-block w-4 h-4 bg-yellow-200 ml-4 mr-2 rounded-sm" />{" "}
            Mixed
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAttendance;
