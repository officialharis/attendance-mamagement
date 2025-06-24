import { useState } from "react";
import { assest } from "../assets/assest";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { setShowUserLogin, user, setUser, navigate, role, setRole } =
    useAppContext();

  const logOut = (params) => {
    toast.success("Logged out successfully!");
    localStorage.removeItem("token");
    setUser(null);
    setRole("");
    setOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={`flex items-center ${
        user ? "justify-between" : "justify-between"
      } px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all`}
    >
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

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <Link to={"/"}>Home</Link>

        {!user && (
          <button
            onClick={() => {
              setOpen(false);
              setShowUserLogin(true);
            }}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        )}
      </div>

      {!user ? (
        <button
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          aria-label="Menu"
          className="sm:hidden"
        >
          {/* Menu Icon SVG */}
          <img src={assest.menu_icon} alt="" />
        </button>
      ) : (
        <div className="relative group" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <p className="flex items-center gap-1 text-primary">
            {` Welcome , ${user.name}`}
            <img
              src={user.profileImage ? user.profileImage : assest.profile_icon}
              alt="profile"
              className="w-10"
            />
          </p>
          <ul
            className={`hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200
              py-2.5 w-30 rounded-md text-sm z-40 ${dropdownOpen ? "block" : "hidden"}`}
          >
            <li
              onClick={() => {
                navigate("dashboard");
              }}
              className="p-1.5 pl-3 hover:bg-primary-dull/10 cursor-pointer"
            >
              Dashboard
            </li>
            <li
              onClick={logOut}
              className="p-1.5 pl-3 hover:bg-primary-dull/10 cursor-pointer"
            >
              LogOut
            </li>
          </ul>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}
      >
        <Link to={"/"} className="block" onClick={() => setOpen(false)}>
          Home
        </Link>
        <button
          onClick={() => {
            setOpen(false);
            setShowUserLogin(true);
          }}
          className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
