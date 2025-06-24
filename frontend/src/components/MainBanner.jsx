import React from "react";
import { assest } from "../assets/assest";

const MainBanner = () => {
  return (
    <div className="w-full flex flex-col items-center justify-between md:flex-row min-h-[70vh] px-2 md:px-4">
      {/* Left Div Text */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-gray-800">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Welcome to <span className="text-primary">SmartAttendance</span>
        </h1>
        <p className="text-lg md:text-xl mb-4">
          A modern and efficient way to manage student attendance. Say goodbye
          to paper-based systems!
        </p>
        <p className="text-md text-gray-600">
          Empowering teachers and admins to track, report, and improve classroom
          presence with ease.
        </p>
      </div>

      {/* Rigth Div Image */}
      <div className="w-full md:w-1/2 mb-8 md:mb-0 ">
        <img
          className="w-full rounded-2xl h-auto shadow-lg"
          src={assest.background}
          alt="Banner"
        />
      </div>
    </div>
  );
};

export default MainBanner;
