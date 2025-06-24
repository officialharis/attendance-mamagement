import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const { isAdmin, setIsAdmin, navigate ,axios} = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // Make API call to backend admin login endpoint
      const res = await axios.post("/api/admin/login", { email, password });

      // Check if login was successful based on backend response structure
      if (res.data.success) {
        // Store the admin token in localStorage
        localStorage.setItem("adminToken", res.data.token); // Using 'adminToken' to differentiate from user token

        // Update isAdmin state to true
        setIsAdmin(true);

        // Show success toast
        toast.success("Admin login successful!");

        // Navigate to the admin dashboard
        navigate("/admin");
      } else {
        // This block might not be reached if backend sends 4xx status for errors
        // but it's good for explicit checks if backend always sends 200 with success: false
        toast.error(res.data.message || "Admin login failed.");
      }
    } catch (error) {
      // Access error.response.data.message for server-provided error messages
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred during admin login. Please try again.";
      toast.error(errorMessage); // Show error toast
      console.error("Admin Login Error:", error);
    }
  };
  return (
    !isAdmin && (
      <form
        onSubmit={onSubmitHandler}
        className="min-h-screen flex items-center text-sm text-gray-600"
      >
        <div
          className="flex flex-col gap-5 m-auto items-start p-8  py-12 min-w-80 sm:min-w-88
    rounded-lg shadow-xl border border-gray-200"
        >
          <p className="text-xl font-medium m-auto">
            <span className="text-primary">Admin</span> Login
          </p>

          <div className="w-full">
            <p>Email</p>
            <input
              type="email"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="w-full">
            <p>Password</p>
            <input
              type="password"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
            Login
          </button>
        </div>
      </form>
    )
  );
};

export default AdminLogin;
