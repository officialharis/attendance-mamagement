import { useState, useEffect } from "react";
import InputField from "../../components/InputField";
import { assest } from "../../assets/assest";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import Loading from "../../components/Loading";

const AddTeacher = () => {
  // We Need Name Email Password And Department Feild
  const { axios, navigate, setTeacherUpdated } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [department, setDepartment] = useState("MCA");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { name, email, password } = teacher;
    const adminToken = localStorage.getItem("adminToken"); // Get admin token
    axios.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
    try {
      const { data } = await axios.post("/api/admin/add-teacher", {
        name,
        email,
        password,
        department,
      });
      if (data.success) {
        toast.success("Teacher Added Successfully");
        setTeacherUpdated((prev) => !prev);
        navigate("/admin/teachers");
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading && <Loading />}
      <div className="mt-16 pb-16">
        <p className="text-2xl md:text-3xl text-gray-500">
          Add New <span className="font-semibold text-primary">Teacher</span>
        </p>

        <div className="flex flex-col-reverse lg:flex-row justify-around mt-5 items-center ">
          {/* Left Part Form */}
          <div className="flex-1 max-w-md">
            <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  handleChange={handleChange}
                  data={teacher}
                  name="name"
                  type="text"
                  placeholder="Enter Name"
                />
                <InputField
                  handleChange={handleChange}
                  data={teacher}
                  name="email"
                  type="email"
                  placeholder="Email Address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  handleChange={handleChange}
                  data={teacher}
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                />
              </div>

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

              <button className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase">
                + Add Teacher
              </button>
            </form>
          </div>
          {/* Right Part Image */}
          <div className="flex items-center ">
            <img
              className="md:mr-16 mb-16 md:mt-0 w-100 h-100"
              src={assest.addStudent}
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTeacher;
