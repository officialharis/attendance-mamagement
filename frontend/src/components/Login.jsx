import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const [state, setState] = useState("login");
  const [formRole, setFormRole] = useState("student"); // student | teacher
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("MCA");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser, setRole, showUserLogin, setShowUserLogin, navigate, axios } =
    useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
      console.log("Login button clicked");
    try {
      let res;
      if (state === "login") {
        res = await axios.post("/api/user/login", { email, password });
      } else {
        const data = {
          name,
          email,
          password,
          role: formRole, // use formRole here
          ...(formRole === "student" ? { rollNumber } : { department }),
        };
        res = await axios.post("/api/user/register", data);
      }

      const user = res.data.user;
      localStorage.setItem("token", user.token);
      setUser(user);
      setRole(user.role);
      setShowUserLogin(false);
      toast.success(res.data.message)
      navigate("/"); // redirect after login
    } catch (error) {
      const errorMessage = error.response?.data?.message 
      toast.error(errorMessage);
      console.error("Login/Register Error:", error);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50"
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
      </form>
    </div>
  );
};

export default Login;
