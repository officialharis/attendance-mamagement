import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import InputField from "../../components/InputField";
import { assest } from "../../assets/assest";
import toast from "react-hot-toast";

const AddStudent = () => {
  // We Need Name Email Password And Roll Number Field
  const { axios, navigate, setStudentUpdated } = useAppContext();
  const [student, setStudent] = useState({
    name: "",
    email: "",
    password: "",
    rollNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const { name, email, password, rollNumber } = student;
    const adminToken = localStorage.getItem("adminToken"); // Get admin token
    axios.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
    try {
      if (adminToken) {
        const { data } = await axios.post("/api/admin/add-student", {
          name,
          email,
          password,
          rollNumber,
        });
        if (data.success) {
          toast.success(data.message);
          setStudentUpdated((prev) => !prev);
          navigate("/admin");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add New <span className="font-semibold text-primary">Student</span>
      </p>

      <div className="flex flex-col-reverse lg:flex-row justify-around mt-5 items-center ">
        {/* Left Part Form */}
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                data={student}
                name="name"
                type="text"
                placeholder="Enter Name"
              />
              <InputField
                handleChange={handleChange}
                data={student}
                name="email"
                type="email"
                placeholder="Email Address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                handleChange={handleChange}
                data={student}
                name="password"
                type="password"
                placeholder="Enter Password"
              />
              <InputField
                handleChange={handleChange}
                data={student}
                name="rollNumber"
                type="text"
                placeholder="Enter RollNumber"
              />
            </div>

            <button className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase">
              + Add Student
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
  );
};

export default AddStudent;
