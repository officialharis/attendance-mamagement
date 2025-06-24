import React from "react";

const Footer = () => {
  return (
    <div className="mt-16">
      <footer className="bg-black/15 text-primary-dull py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between text-sm">
          <p>
            &copy; {new Date().getFullYear()} Smart Attendance | Developed by bahauddin rafiuddin.

          </p>  
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
