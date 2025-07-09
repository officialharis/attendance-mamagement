import { useEffect, useState } from "react";
import { assest } from "../../assets/assest";
import { useAppContext } from "../../context/AppContext";
import { NavLink, Outlet } from "react-router-dom";

const Dashboard = () => {
  const { user, setUser, navigate, role } = useAppContext();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const logOut = () => {
    toast.success("Logged out successfully!");
    localStorage.removeItem("token");
    setUser(null);
    setRole("");
    setOpen(false);
    navigate("/");
  };
  const teacherSidebarLinks = [
    { name: "View Profile", path: "/dashboard", icon: assest.teacherProfile },
    {
      name: "Mark Attendance",
      path: "/dashboard/mark-attendance",
      icon: assest.markAttendance,
    },
    {
      name: "View Subjects",
      path: "/dashboard/subjects",
      icon: assest.classroom,
    },
  ];

  const studentSidebarLinks = [
    { name: "View Profile", path: "/dashboard", icon: assest.teacherProfile },
    {
      name: "View Attendance",
      path: "/dashboard/view-attendance",
      icon: assest.markAttendance,
    },
    {
      name: "My Class",
      path: "/dashboard/student-class",
      icon: assest.subject,
    },
  ];
  return (
    <div className="h-screen flex">
      <div className="flex flex-1 overflow-hidden">
        <div className="md:w-64 w-16 bg-white border-r border-gray-300 pt-4 flex-shrink-0">
          {(role === "teacher" ? teacherSidebarLinks : studentSidebarLinks).map(
            (item) => (
              <NavLink
                to={item.path}
                key={item.name}
                end={item.path === "/dashboard"}
                className={({ isActive }) => `flex items-center py-3 px-4 gap-3 
        ${
          isActive
            ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
            : "hover:bg-gray-100/90 border-white"
        }`}
              >
                <img src={item.icon} alt="" className="h-9 w-9" />
                <p className="md:block hidden text-center">{item.name}</p>
              </NavLink>
            )
          )}
        </div>
        {/* Right Outlet (Content Area) */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
