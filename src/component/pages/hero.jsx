import React from "react";
import team from "../../assets/team.png"

const Hero = () => {
  return (
    <div className="bg-[#F9FAFB] py-20 px-6 md:px-20 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[250px] h-[250px] bg-[#2C7BE5] opacity-20 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#FFD166] opacity-20 rounded-full blur-3xl z-0" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 max-w-7xl mx-auto">
        {/* Text Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1F2937] leading-tight mb-4">
            Hospital Management, Simplified & Powerful
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-6">
            One solution for Patients, Doctors, and Admins — managing records,
            appointments, and more with ease.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <a
              href="/register"
              className="bg-[#2C7BE5] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#1a5fd1] transition"
            >
              Get Started
            </a>
            <a
              href="#features"
              className="border border-[#2C7BE5] text-[#2C7BE5] px-6 py-3 rounded-md font-semibold hover:bg-[#2C7BE5] hover:text-white transition"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex-1">
          <img
            src={team}
            alt="Hospital team"
            className="w-full max-w-md rounded-lg "
          />
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
        <div>
          <h3 className="text-3xl font-bold text-[#2C7BE5]">50,000+</h3>
          <p className="text-gray-600">Patients Served</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-[#2C7BE5]">120+</h3>
          <p className="text-gray-600">Professional Doctors</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-[#2C7BE5]">24x7</h3>
          <p className="text-gray-600">Emergency Services</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
