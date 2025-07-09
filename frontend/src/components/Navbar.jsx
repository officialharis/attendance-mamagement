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

  const logOut = () => {
    toast.success("Logged out successfully!");
    localStorage.removeItem("token");
    setUser(null);
    setRole("");
    setOpen(false);
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 bg-white shadow-sm sticky top-0 z-50">
      {/* Logo & Brand */}
      <Link to="/" className="flex items-center gap-2">
        <img className="h-9 w-9 rounded-md" src={assest.s} alt="Logo" />
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          Smart<span className="text-gray-800">Attendance</span>
        </h1>
      </Link>

      {/* Desktop Links */}
      <div className="hidden sm:flex items-center gap-8 text-sm font-medium">
        <Link to="/" className="hover:text-primary transition">
          Home
        </Link>
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="bg-primary hover:bg-primary-dull text-white px-6 py-2 rounded-full transition cursor-pointer"
          >
            Login
          </button>
        ) : (
          <div className="relative ">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-primary hover:text-primary/90 transition"
            >
              <span className="hidden md:block">
                Hi, {user.name.split(" ")[0]}
              </span>
              <img
                src={user.profileImage || assest.profile_icon}
                alt="Profile"
                className="w-9 h-9 rounded-full border border-gray-300 cursor-pointer"
              />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 bg-white shadow-md border rounded-md w-40 text-sm z-50">
                <li
                  onClick={() => {
                    navigate("/dashboard");
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Dashboard
                </li>
                <li
                  onClick={() => {
                    logOut();
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <button
        className="sm:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Toggle Menu"
      >
        <img src={assest.menu_icon} alt="Menu" className="w-6 h-6" />
      </button>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden absolute top-[64px] left-0 w-full bg-white shadow-md py-4 px-6 flex flex-col gap-3 z-40 transition-all duration-300 ${
          open ? "block" : "hidden"
        }`}
      >
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="hover:text-primary transition"
        >
          Home
        </Link>

        {!user ? (
          <button
            onClick={() => {
              setOpen(false);
              setShowUserLogin(true);
            }}
            className="bg-primary hover:bg-primary-dull text-white px-4 py-2 rounded-full transition cursor-pointer"
          >
            Login
          </button>
        ) : (
          <div className="flex flex-col gap-2 text-sm">
            <button
              onClick={() => {
                navigate("/dashboard");
                setOpen(false);
              }}
              className="text-left hover:text-primary"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                logOut();
                setOpen(false);
              }}
              className="text-left hover:text-primary"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
