import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [students, setStudents] = useState([]);
  const [teachres, setTeachres] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [studentUpdated, setStudentUpdated] = useState(false);
  const [teacherUpdated, setTeacherUpdated] = useState(false);
  const [classUpdated, setClassUpdated] = useState(false);
  const [subjectUpdated, setSubjectUpdated] = useState(false);
  const [attendance, setAttendance] = useState([]);

  // Configure axios defaults
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Add request interceptor for debugging
  axios.interceptors.request.use(
    (config) => {
      console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        setUser(null);
        setRole('');
        setIsAdmin(false);
      }
      return Promise.reject(error);
    }
  );

  // Fetch All Studetns
  const fetchAllStudents = async (params) => {
    try {
      const { data } = await axios.get("/api/user/getStudents");
      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Fetch All Teachres
  const fetchAllTeachres = async (params) => {
    try {
      const { data } = await axios.get("/api/user/getTeachres");
      if (data.success) {
        setTeachres(data.teachers);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Fetch All ClassRooms
  const fetchAllClassrooms = async (params) => {
    try {
      const { data } = await axios.get("/api/classroom/getAllClassrooms");
      if (data.success) {
        setClassrooms(data.classrooms);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch All Subjects
  const fetchAllSubjects = async (params) => {
    try {
      const { data } = await axios.get("/api/subject/get");
      if (data.success) {
        setSubjects(data.subjects);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch Attendence.
  const fetchAttendance = async () => {
    const userId = user?.id;
    if (!userId) {
      // console.warn("User ID is not available yet.");
      return;
    }
    try {
      const res = await axios.get(`/api/attendance/student/${userId}`);
      setAttendance(res.data.records);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };
  // Cheking Auth For User And Admin And Also Colling ALl Functions On Component Rendering
  useEffect(() => {
    const checkAuth = async () => {
      const userToken = localStorage.getItem("token");
      const adminToken = localStorage.getItem("adminToken"); // Get admin token

      // Reset states before checking
      setUser(null);
      setRole("");
      setIsAdmin(false); // Assume not admin initially

      // --- Check for User Token ---
      if (userToken) {
        try {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${userToken}`;
          const res = await axios.get("/api/user/auth");
          if (res.data.success) {
            setUser(res.data.user);
            setRole(res.data.user.role);
            // No need to set isAdmin here, as this is for regular users
          } else {
            localStorage.removeItem("token");
            console.warn("User token invalid or expired, user logged out.");
          }
        } catch (error) {
          console.error("Error checking user authentication:", error);
          localStorage.removeItem("token");
        }
      }

      // --- Check for Admin Token (only if no regular user is logged in) ---
      // This logic ensures admin login takes precedence or is checked separately (!userToken && )
      if (adminToken) {
        // Only check admin if no user token exists
        try {
          // You might need a separate axios instance or clear the header first if userToken was present
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${adminToken}`;
          // You'll need a backend endpoint like /api/admin/me to verify admin token
          const res = await axios.get("/api/admin/auth"); // Create this endpoint if you want persistence

          if (res.data.success && res.data.user.role === "admin") {
            setIsAdmin(true);
            // You might also want to set a 'currentUser' for admin if you display admin info
            // setUser(res.data.user); // If you want admin details in the 'user' state
            // setRole(res.data.user.role); // If you want admin role in 'role' state
          } else {
            localStorage.removeItem("adminToken");
            console.warn("Admin token invalid or expired, admin logged out.");
          }
        } catch (error) {
          console.error("Error checking admin authentication:", error);
          localStorage.removeItem("adminToken");
        }
      }

      setIsAuthChecked(true); // Mark auth check as complete
    };
    fetchAllStudents();
    checkAuth();
    fetchAllTeachres();
    fetchAllClassrooms();
    fetchAllSubjects();
    fetchAttendance();
  }, []);

  const value = {
    navigate,
    role,
    setRole,
    user,
    setUser,
    showUserLogin,
    setShowUserLogin,
    setIsAdmin,
    isAdmin,
    axios,
    students,
    teachres,
    classrooms,
    subjects,
    studentUpdated,
    setStudentUpdated,
    fetchAllStudents,
    setTeacherUpdated,
    teacherUpdated,
    fetchAllTeachres,
    setClassUpdated,
    classUpdated,
    fetchAllClassrooms,
    fetchAllSubjects,
    subjectUpdated,
    setSubjectUpdated,
    attendance,
    fetchAttendance,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
