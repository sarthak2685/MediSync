import React from "react";
import { FaCalendarCheck, FaUserShield, FaHeartbeat, FaBell } from "react-icons/fa";

const features = [
  {
    icon: <FaCalendarCheck className="text-[#2C7BE5] text-3xl mb-4" />,
    title: "Appointment Booking",
    description: "Schedule appointments with doctors in just a few clicks — anytime, anywhere.",
  },
  {
    icon: <FaUserShield className="text-[#00B894] text-3xl mb-4" />,
    title: "Secure Records",
    description: "All patient data is encrypted and securely stored in our cloud database.",
  },
  {
    icon: <FaHeartbeat className="text-[#FFD166] text-3xl mb-4" />,
    title: "Role-based Access",
    description: "Custom dashboards for Admin, Doctor, and Patient for tailored access.",
  },
  {
    icon: <FaBell className="text-[#FF6B6B] text-3xl mb-4" />,
    title: "Real-Time Alerts",
    description: "Get notified for appointments, lab results, and system updates instantly.",
  },
];

const Features = () => {
  return (
    <div id="features" className="py-20 px-6 md:px-20 bg-white">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937] inline-block relative after:block after:mt-2 after:mx-auto after:w-20 after:h-1 after:bg-[#2C7BE5] after:rounded-full">
          Why Choose Our System?
        </h2>

        {/* Animated typing effect (Tailwind only) */}
        <p className="mt-3 text-gray-600 text-base md:text-lg w-fit mx-auto overflow-hidden whitespace-nowrap border-r-2 border-[#2C7BE5] animate-typing">
          Empowering patients, doctors, and admins with smart healthcare tools.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-[#F9FAFB] rounded-xl shadow-md p-6 text-center transition hover:shadow-xl"
          >
            {feature.icon}
            <h3 className="text-xl font-semibold text-[#2C7BE5] mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
