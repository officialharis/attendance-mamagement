import React from "react";
import { features } from "../assets/assest";

const FeaturesSection = () => {
  return (
    <div className="max-w-6xl mt-16 flex flex-col">
      <div className="flex flex-col items-end w-max mb-6">
        <h2 className="text-3xl font-bold text-gray-800 uppercase">
          What We Provide
        </h2>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-blue-50 rounded-xl p-6 shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-blue-700">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
