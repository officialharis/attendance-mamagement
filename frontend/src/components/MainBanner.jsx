import { assest } from "../assets/assest";
import { useAppContext } from "../context/AppContext";

const MainBanner = () => {
  const { user, setShowUserLogin ,navigate} = useAppContext();
  return (
    <section className="w-full px-4 py-12 md:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        {/* Left Text Section */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-snug text-gray-800 mb-6">
            Welcome to <span className="text-primary">SmartAttendance</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-4">
            A modern and efficient way to manage student attendance.
          </p>
          <p className="text-base text-gray-600 mb-6">
            Say goodbye to paper registers. Empower teachers and admins to
            track, report, and improve classroom presence effortlessly.
          </p>
          <button
            onClick={() =>
              user ? navigate("/dashboard") : setShowUserLogin(true)
            }
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg shadow-md hover:bg-primary-dull transition duration-300 cursor-pointer"
          >
            Explore Features
          </button>
        </div>

        {/* Right Image Section */}
        <div className="w-full md:w-1/2">
          <img
            className="w-full h-auto rounded-2xl shadow-xl"
            src={assest.background}
            alt="Smart Attendance Banner"
          />
        </div>
      </div>
    </section>
  );
};

export default MainBanner;
