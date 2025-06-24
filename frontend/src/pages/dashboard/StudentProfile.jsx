import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assest } from "../../assets/assest";
import toast from "react-hot-toast";

const StudentProfile = () => {
  const { user, axios ,setUser} = useAppContext();
  const [editProfile, setEditProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    rollNumber: user?.rollNumber || "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(
    user?.profileImage || assest.profile_icon
  );
  if (!user) {
    return <p>Loading profile...</p>; // or a loader/spinner
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
console.log(user)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userToken = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("rollNumber", formData.rollNumber);
      if (profileImage) form.append("profileImage", profileImage);

      const res = await axios.put("/api/user/update-profile", form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Profile updated successfully!");
      setUser(res.data.user);
      setEditProfile(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };
  return (
    <div>
      {!editProfile ? (
        <div className="text-sm text-gray-500 w-60 divide-y divide-gray-500/30 border border-gray-500/30 rounded bg-white">
          <div className="flex flex-col items-center justify-between py-8">
            <img
              className="h-24 w-24 rounded-full"
              src={user.profileImage ? user.profileImage : assest.profile_icon}
              alt="userImage1"
            />
            <h2 className="text-lg text-gray-800 mt-3">{user.name}</h2>
            <p>{user.email}</p>
            <p className="mt-[5px]">{user.rollNumber}</p>
            <p className="bg-green-500/20 px-2 py-0.5 rounded-full mt-2 text-xs text-green-600 border border-green-500/30">
              {user.role}
            </p>
          </div>
          <div className="flex items-center divide-x divide-gray-500/30">
            <button
              onClick={() => {
                setFormData({
                  name: user.name || "",
                  email: user.email || "",
                  rollNumber: user.rollNumber || "",
                });
                setPreview(user.profileImage || assest.profile_icon);
                setEditProfile(true);
              }}
              type="button"
              className="flex items-center justify-center gap-2 w-full py-3 cursor-pointer bg-blue-50 hover:bg-blue-100"
            >
              <img src={assest.editIcon} alt="" className="h-7 w-7" />
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto mt-10 px-6 py-8 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            Edit Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image Upload */}
            <div className="flex justify-center">
              <label className="cursor-pointer flex flex-col items-center">
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
                <img
                  src={preview || assest.profile_icon}
                  className="h-24 w-24 rounded-full object-cover border-2 border-blue-400"
                  alt="Profile Preview"
                />
                <p className="text-xs text-blue-600 mt-2 hover:underline">
                  Change Photo
                </p>
              </label>
            </div>

            {/* Input Fields */}
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="rollNumber"
              placeholder="Roll Number"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.rollNumber}
              onChange={handleChange}
            />

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition duration-200 cursor-pointer"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditProfile(false)}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-lg transition duration-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
