import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Home from "./pages/Home";

import AdminLayout from "./pages/Admin/AdminLayout";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ViewStudents from "./pages/Admin/ViewStudents";
import ViewTeachers from "./pages/Admin/ViewTeachers";
import Classroom from "./pages/Admin/Classroom";
import Subjects from "./pages/Admin/Subjects";
import AddStudent from "./pages/Admin/AddStudent";
import AddSubject from "./pages/Admin/AddSubject";
import AddTeacher from "./pages/Admin/AddTeacher";
import AddClassroom from "./pages/Admin/AddClassroom";
import AddStudentsToClassroom from "./pages/Admin/AddStudentsToClassroom";

import Dashboard from "./pages/dashboard/Dashboard";
import TeacherProfile from "./pages/dashboard/TeacherProfile";
import TeacherSubject from "./pages/dashboard/TeacherSubject";
import MarkAttendance from "./pages/dashboard/MarkAttendance";
import StudentProfile from "./pages/dashboard/StudentProfile";
import ViewAttendance from "./pages/dashboard/ViewAttendance";
import StudentClass from "./pages/dashboard/StudentClass";
import AttendenceReportTeacher from "./pages/dashboard/reports/AttendenceReportTeacher";

import { useAppContext } from "./context/AppContext";

function App() {
  const location = useLocation();
  const { user, showUserLogin, isAdmin, role } = useAppContext();

  const isAdminPath = location.pathname.startsWith("/admin");
  const isDashboardPath = location.pathname.startsWith("/dashboard");

  return (
    <div className="text-default text-gray-700 bg-white min-h-screen">
      {/* Navbar (Hidden on Admin pages) */}
      {!isAdminPath && <Navbar />}

      {/* Login popup */}
      {showUserLogin && <Login />}

      {/* Global toaster */}
      <Toaster />

      {/* Conditional Wrapper for Routes */}
      {isDashboardPath ? (
        // Dashboard layout — full height, scroll inside Outlet only
        <div className="h-[calc(100vh-72px)] overflow-hidden">
          <Routes>
            <Route path="/dashboard" element={user ? <Dashboard /> : <Home />}>
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
              <Route
                path="subject-attendence-report/:subId"
                element={<AttendenceReportTeacher />}
              />
            </Route>
          </Routes>
        </div>
      ) : isAdminPath ? (
        // Admin layout
        <Routes>
          <Route
            path="/admin"
            element={isAdmin ? <AdminLayout /> : <AdminLogin />}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<ViewStudents />} />
            <Route path="teachers" element={<ViewTeachers />} />
            <Route path="class" element={<Classroom />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="add-student" element={<AddStudent />} />
            <Route path="add-teacher" element={<AddTeacher />} />
            <Route path="add-subject" element={<AddSubject />} />
            <Route path="add-classroom" element={<AddClassroom />} />
            <Route
              path="add-student-toclass/:classId"
              element={<AddStudentsToClassroom />}
            />
          </Route>
        </Routes>
      ) : (
        // General pages (Home, Auth, etc.)
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Add more public routes if needed */}
          </Routes>
        </div>
      )}

      {/* Footer (Hide on Admin and Dashboard pages) */}
      {!isAdminPath && !isDashboardPath && <Footer />}
    </div>
  );
}

export default App;
