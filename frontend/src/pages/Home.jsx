import React from "react";
import MainBanner from "../components/MainBanner";
import FeaturesSection from "../components/FeaturesSection ";
import HowItWorksSection from "../components/HowItWorksSection";
import CTA from "../components/CTA";

const Home = () => {

  return (
    <div className="mt-3 overflow-y-auto">
      <MainBanner />
      <FeaturesSection />
      <HowItWorksSection/>
      <CTA/>
    </div>
  );
};

export default Home;
