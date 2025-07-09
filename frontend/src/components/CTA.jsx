import { useAppContext } from "../context/AppContext";

const CTA = () => {
  const { setShowUserLogin, user, navigate } = useAppContext();
  return (
    <section className="mt-20 bg-primary/95 text-white py-16 text-center rounded-xl mx-4">
      <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
      <p className="mb-6">
        Join thousands of students and teachers using SmartAttendance today!
      </p>
      {user ? (
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 cursor-pointer transition"
        >
          Go to Dashboard
        </button>
      ) : (
        <button
          onClick={() => setShowUserLogin(true)}
          className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 cursor-pointer transition"
        >
          Login / Register Now
        </button>
      )}
    </section>
  );
};

export default CTA;
