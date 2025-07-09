import { useState } from "react";
import { assest } from "../../assets/assest";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import Loading from "../../components/Loading";

const AddClassroom = () => {
  const [classroom, setClassroom] = useState("");
  const [loading, setLoading] = useState(false);

  const { axios, navigate, setClassUpdated } = useAppContext();
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const adminToken = localStorage.getItem("adminToken"); // Get admin token
    axios.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
    try {
      const { data } = await axios.post("/api/admin/add-classroom", {
        classroom,
      });
      if (data.success) {
        toast.success("Class Added Successfully");
        setClassUpdated((prev) => !prev);
        navigate("/admin/class");
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      console.error(error);
      toast.message(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {loading && <Loading />}
      <div className="mt-16 pb-16">
        <p className="text-2xl md:text-3xl text-gray-500">
          Add New <span className="font-semibold text-primary">Class</span>
        </p>

        <div className="flex flex-col-reverse lg:flex-row justify-around mt-5 items-center ">
          {/* Left Part Form */}
          <div className="flex-1 max-w-md">
            <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
              <div className="">
                <input
                  className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none
    text-gray-500 focus:border-primary transition"
                  type="text"
                  name="classroom"
                  placeholder="Enter Class Name"
                  onChange={(e) => {
                    setClassroom(e.target.value);
                  }}
                  value={classroom}
                />
              </div>

              <button className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase">
                + Add Class
              </button>
            </form>
          </div>
          {/* Right Part Image */}
          <div className="flex items-center ">
            <img
              className="md:mr-16 mb-16 md:mt-0 w-100 h-100"
              src={assest.addClass}
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddClassroom;
