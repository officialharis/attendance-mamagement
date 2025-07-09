import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: "🧑‍💻",
    title: "Login / Register",
    description: "Secure login for students and teachers to access the portal.",
  },
  {
    icon: "✅",
    title: "Mark Attendance",
    description: "Students mark attendance in just one click from anywhere.",
  },
  {
    icon: "📊",
    title: "View Reports",
    description: "Teachers and admins track daily and monthly attendance.",
  },
  {
    icon: "📁",
    title: "Export Data",
    description: "Download attendance records for analysis and backups.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const HowItWorksSection = () => {
  return (
    <section className="max-w-6xl mx-auto mt-20 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          How It <span className="text-primary">Works</span>
        </h2>
        <p className="text-gray-600 mt-2">
          Follow these simple steps to manage attendance seamlessly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
            className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;
