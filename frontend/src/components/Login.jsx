import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import Loading from "./Loading";

const Login = () => {
  const [state, setState] = useState("login");
  const [formRole, setFormRole] = useState("student"); // student | teacher
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("MCA");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser, setRole, showUserLogin, setShowUserLogin, navigate, axios } =
    useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Input validation on frontend
      if (state === "login") {
        if (!email || !password) {
          toast.error("Please enter both email and password");
          return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          toast.error("Please enter a valid email address");
          return;
        }
      } else {
        // Registration validation
        if (!name || !email || !password) {
          toast.error("Please fill in all required fields");
          return;
        }

        if (formRole === "student" && !rollNumber) {
          toast.error("Roll number is required for students");
          return;
        }

        if (formRole === "teacher" && !department) {
          toast.error("Department is required for teachers");
          return;
        }
      }

      let res;
      if (state === "login") {
        // Ensure clean data for login
        const loginData = {
          email: email.trim().toLowerCase(),
          password: password
        };

        console.log("Sending login request with:", {
          email: loginData.email,
          passwordLength: loginData.password.length
        });

        res = await axios.post("/api/user/login", loginData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        // Registration data
        const registrationData = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password,
          role: formRole,
          ...(formRole === "student" ? { rollNumber: rollNumber.trim() } : { department }),
        };

        res = await axios.post("/api/user/register", registrationData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      // Check if response is successful
      if (res.data && res.data.success) {
        const user = res.data.user;
        localStorage.setItem("token", user.token);
        setUser(user);
        setRole(user.role);
        setShowUserLogin(false);
        toast.success(res.data.message || "Login successful");

        // Slight delay to ensure context update completes
        setTimeout(() => navigate("/dashboard"), 200);
      } else {
        toast.error(res.data?.message || "Login failed");
      }

    } catch (error) {
      console.error("Login/Register Error Details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        timestamp: new Date().toISOString()
      });

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || "Server error occurred";
        toast.error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Unable to connect to server. Please check your internet connection.");
      } else {
        // Something else happened
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div
        onClick={() => setShowUserLogin(false)}
        className="fixed inset-0 z-30 flex flex-col  gap-2 items-center justify-center bg-black/50"
      >
        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col gap-4 w-80 sm:w-[352px] bg-white p-8 py-12 rounded-lg shadow-xl border border-gray-200"
        >
          <p className="text-2xl font-medium text-center">
            <span className="text-primary">User</span>{" "}
            {state === "login" ? "Login" : "Sign Up"}
          </p>

          {state === "register" && (
            <>
              <div className="w-full">
                <p>Name</p>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Type here"
                  className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                  type="text"
                  required
                />
              </div>

              <div className="w-full">
                <p>Role</p>
                <select
                  className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>

              {formRole === "student" && (
                <div className="w-full">
                  <p>Roll Number</p>
                  <input
                    onChange={(e) => setRollNumber(e.target.value)}
                    value={rollNumber}
                    placeholder="e.g. 21MCA01"
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                    type="text"
                    required
                  />
                </div>
              )}

              {formRole === "teacher" && (
                <div className="w-full">
                  <p>Department</p>
                  <select
                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  >
                    <option value="MCA">MCA</option>
                    <option value="BCA">BCA</option>
                    <option value="BBA">BBA</option>
                    <option value="MBA">MBA</option>
                  </select>
                </div>
              )}
            </>
          )}

          <div className="w-full">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="email"
              required
            />
          </div>

          <div className="w-full">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="password"
              required
            />
          </div>

          <p className="text-sm text-center">
            {state === "register" ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setState("login")}
                  className="text-primary cursor-pointer"
                >
                  Login
                </span>
              </>
            ) : (
              <>
                Create an account?{" "}
                <span
                  onClick={() => setState("register")}
                  className="text-primary cursor-pointer"
                >
                  Register
                </span>
              </>
            )}
          </p>

          <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
            {state === "register" ? "Create Account" : "Login"}
          </button>
          <p className="text-sm text-center">
            Want to login as Admin ?{" "}
            <span
              onClick={() => setShowAdminLogin(true)}
              className="text-primary cursor-pointer"
            >
              Click Here
            </span>
          </p>
        </form>
        {showAdminLogin && (
          <button
            onClick={() => navigate("/admin")}
            className="border border-black text-white bg-primary hover:bg-primary-dull transition-all w-fit px-20 sm:px-0 sm:w-1/5 py-2 rounded-md cursor-pointer"
          >
            Admin Login
          </button>
        )}
      </div>
    </>
  );
};

export default Login;
