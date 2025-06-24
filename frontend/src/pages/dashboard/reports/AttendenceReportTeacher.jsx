import { useParams } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const AttendenceReportTeacher = () => {
  const { subId } = useParams();
  const { axios } = useAppContext();
  const [subAttendence, setSubAttendence] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const fetchSubjectAttendence = async () => {
    try {
      const res = await axios.get(`/api/attendance/subject/${subId}`);
      if (res.data.success) {
        setSubAttendence(res.data.records);
        setFilteredData(res.data.records);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch attendance");
    }
  };

  useEffect(() => {
    fetchSubjectAttendence();
  }, []);

  // Download CSV logic (see step 2)
  const downloadCSV = () => {
    const csvHeader = ["Date", "Student Name", "Roll Number", "Status"];
    const csvRows = filteredData.map((record) => [
      new Date(record.date).toLocaleDateString(),
      record.student?.name || "",
      record.student?.rollNumber || "",
      record.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [csvHeader, ...csvRows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      return toast.error("Please select both dates");
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    const filtered = subAttendence.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= from && recordDate <= to;
    });

    setFilteredData(filtered);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Attendance Report</h2>
        <button
          onClick={downloadCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer"
        >
          Download CSV
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 rounded cursor-pointer"
          />
        </div>
        <button
          onClick={handleFilter}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-5 cursor-pointer"
        >
          Filter
        </button>

        <button 
        onClick={()=>{
          setFromDate("")
          setToDate("")
          setFilteredData(subAttendence)
        }}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-5 cursor-pointer"
        >Clear Filter</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow-md text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Student Name</th>
              <th className="p-3 border">Roll Number</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record) => (
              <tr key={record._id} className="border-b hover:bg-gray-50">
                <td className="p-3 border">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="p-3 border">{record.student?.name}</td>
                <td className="p-3 border">{record.student?.rollNumber}</td>
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
      </div>
    </div>
  );
};

export default AttendenceReportTeacher;
