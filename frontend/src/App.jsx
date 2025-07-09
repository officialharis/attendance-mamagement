import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login";
import { Route, useLocation, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { useAppContext } from "./context/AppContext";
import Footer from "./components/Footer";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminLogin from "./components/admin/AdminLogin";
import ViewStudents from "./pages/Admin/ViewStudents";
import ViewTeachers from "./pages/Admin/ViewTeachers";
import Classroom from "./pages/Admin/Classroom";
import Subjects from "./pages/Admin/Subjects";
import AddStudent from "./pages/Admin/AddStudent";
import AddSubject from "./pages/Admin/AddSubject";
import AddTeacher from "./pages/Admin/AddTeacher";
import AddClassroom from "./pages/Admin/AddClassroom";
import Dashboard from "./pages/dashboard/Dashboard";
import TeacherProfile from "./pages/dashboard/TeacherProfile";
import TeacherSubject from "./pages/dashboard/TeacherSubject";
import MarkAttendance from "./pages/dashboard/MarkAttendance";
import StudentProfile from './pages/dashboard/StudentProfile'
import ViewAttendance from './pages/dashboard/ViewAttendance'
import StudentClass from './pages/dashboard/StudentClass'
import AddStudentsToClassroom from "./pages/Admin/AddStudentsToClassroom";
import AttendenceReportTeacher from "./pages/dashboard/reports/AttendenceReportTeacher"
import AdminDashboard from "./pages/Admin/AdminDashboard";

function App() {
  const isAdminPath = useLocation().pathname.includes("admin");
  const isDashboardPath = useLocation().pathname.includes("dashboard");
  const { user,showUserLogin, isAdmin, role ,setShowUserLogin} = useAppContext();
  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {isAdminPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}
      <Toaster />

      <div
        className={`${
          isAdminPath || isDashboardPath
            ? " "
            : "px-6 md:px-16 lg:px-24 xl:px-32"
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={isAdmin ? <AdminLayout /> : <AdminLogin />}
          >
            <Route index element={isAdmin ? <AdminDashboard /> : null} />
            <Route path="students" element={<ViewStudents />} />
            <Route path="teachers" element={<ViewTeachers />} />
            <Route path="class" element={<Classroom />} />
            <Route path="subjects" element={<Subjects />} />

            {/* Add Pages */}
            <Route path="add-student" element={<AddStudent />} />
            <Route path="add-teacher" element={<AddTeacher />} />
            <Route path="add-subject" element={<AddSubject />} />
            <Route path="add-classroom" element={<AddClassroom />} />
            <Route path="add-student-toclass/:classId" element={<AddStudentsToClassroom />} />

          </Route>

          {/* Dashboard For Teacher And Students Routes */}
          <Route path="/dashboard" element={user?<Dashboard />:<Home/>}>
            <Route
              index
              element={
                role === "teacher" ? <TeacherProfile /> : <StudentProfile />
              }
            />
            <Route path="subjects" element={<TeacherSubject />} />
            <Route path="mark-attendance" element={<MarkAttendance />} />

            <Route path="view-attendance" element={<ViewAttendance />} />
            <Route path="student-class" element={<StudentClass />} />
            <Route path="subject-attendence-report/:subId" element={<AttendenceReportTeacher/>}/>


          </Route>
        </Routes>
      </div>

      {!isAdminPath && <Footer />}
    </div>
  );
}

export default App;
