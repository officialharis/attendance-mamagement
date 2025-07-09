import { assest } from "../assets/assest";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-10 px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold text-primary mb-2">SmartAttendance</h3>
          <p className="text-sm">
            A reliable and efficient platform for managing student attendance digitally — fast, secure, and paperless.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="/" className="hover:text-primary">Home</a></li>
            <li><a href="/dashboard" className="hover:text-primary">Dashboard</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <ul className="space-y-1 text-sm">
            <li>Email: <a href="mailto:bahauddinrafiuddin@gmail.com" className="hover:text-primary">bahauddinrafiuddin@gmail.com</a></li>
            <li>Location: India</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="font-semibold mb-2">Follow Us</h4>
          <ul className="space-y-1 text-sm">
            <li className="flex items-center gap-2">
              <img src={assest.github} alt="GitHub" className="w-5 h-5" />
              <a href="https://github.com/BahauddinRafiuddin" target="_blank" rel="noreferrer" className="hover:text-primary">
                GitHub
              </a>
            </li>
            <li className="flex items-center gap-2">
              <img src={assest.instagram} alt="Instagram" className="w-5 h-5" />
              <a href="https://instagram.com/rafiuddin__01" target="_blank" rel="noreferrer" className="hover:text-primary">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      <p className="text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SmartAttendance. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
