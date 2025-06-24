import { assest } from "../../assets/assest";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AdminLayout = () => {
  const { setIsAdmin, navigate } = useAppContext();

  const sidebarLinks = [
    { name: "Dashboard", path: "/admin", icon: assest.dashbaordIcon },
    { name: "View Students", path: "/admin/students", icon: assest.students },
    { name: "View Teachers", path: "/admin/teachers", icon: assest.teacher },
    { name: "Classroom", path: "/admin/class", icon: assest.classroom },
    { name: "Subjects", path: "/admin/subjects", icon: assest.subject },
  ];

  const logOut = async () => {
    try {
      toast.success("LogOut Successfull")
      localStorage.removeItem("adminToken")
      setIsAdmin(false)
      navigate('/')
    } catch (error) {
      console.error(error)
      toast.error(error)
    }
  };
  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
        <div className="flex items-center">
          <Link to={"/"}>
            <img
              className="h-9 w-10 rounded-md color"
              src={assest.s}
              alt="dummyLogoColored"
            />
          </Link>
          <p className="text-primary text-1xl uppercase md:text-3xl font-bold">
            mart Attendance
          </p>
        </div>
        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! Admin</p>
          <button
            onClick={logOut}
            className="border rounded-full text-sm px-4 py-1 cursor-pointer bg-primary hover:bg-primary-dull text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className=" md:w-64 w-16 border-r border-gray-300 pt-4 bg-white overflow-y-auto">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/admin"}
              className={({ isActive }) => `flex items-center py-3 px-4 gap-3 
                            ${
                              isActive
                                ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                : "hover:bg-gray-100/90 border-white "
                            }`}
            >
              <img src={item.icon} alt="" className="h-9 w-9" />
              <p className="md:block hidden text-center">{item.name}</p>
            </NavLink>
          ))}
        </div>
        {/* Right Outlet (Content Area) */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
