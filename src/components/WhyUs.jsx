import React from "react";
import {
  FaShieldAlt,
  FaUserMd,
  FaRobot,
  FaCapsules,
} from "react-icons/fa";
import {
  MdHowToReg,
  MdAssignment,
  MdDateRange,
  MdHeadsetMic,
} from "react-icons/md";
import whyChoose1 from "../assets/99e672c7-f9a2-4070-b3f5-3a49174776bc-removebg-preview.png";
import whyChoose2 from "../assets/team-removebg-preview.png";

// Color constants
const primaryColor = "0E1630";
const greenColor = "#22c55e";
const iconBgColor = "#f0f0f0";

const IconWrapper = ({ children }) => (
  <div
    className="w-25 h-12 flex items-center justify-center rounded-md"
    style={{ backgroundColor: iconBgColor, color: primaryColor }}
  >
    {children}
  </div>
);

const IconWrapper1 = ({ children }) => (
  <div
    className="w-10 h-10 flex items-center justify-center rounded-full"
    style={{ backgroundColor: iconBgColor, color: primaryColor }}
  >
    {children}
  </div>
);

const features = [
  {
    icon: <FaShieldAlt />,
    title: "Secure & Trusted",
    description: "Your health data is encrypted & protected.",
  },
  {
    icon: <FaUserMd />,
    title: "Seamless Access",
    description: "One platform for hospitals, doctors, labs & pharmacies.",
  },
  {
    icon: <FaRobot />,
    title: "AI-Driven Insights",
    description: "Smart health tracking & AI-based recommendations.",
  },
  {
    icon: <FaCapsules />,
    title: "Exclusive Benefits",
    description: "Enjoy discounts on medicines & healthcare services.",
  },
];

const steps = [
  {
    icon: <MdHowToReg />,
    title: "Register & Connect",
    description: "Sign up & link to hospitals, doctors & pharmacies.",
  },
  {
    icon: <MdAssignment />,
    title: "Manage Health Records",
    description: "Store your medical history securely.",
  },
  {
    icon: <MdDateRange />,
    title: "Book & Track Appointments",
    description: "Schedule consultations, lab tests & medicine orders.",
  },
  {
    icon: <MdHeadsetMic />,
    title: "24/7 Assistance",
    description: "Our support team is always ready to help.",
  },
];

const WhyUs = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold mb-4">
          <span style={{ color: primaryColor }}>Why & How</span>{" "}
          <span style={{ color: greenColor }}>AV Swasthya Works</span>
        </h2>

        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          AV Swasthya is your one-stop digital healthcare solution, ensuring
          seamless access to doctors, hospitals, pharmacies, and labs with
          AI-driven insights and exclusive benefits.
        </p>

        {/* Why Choose Us Section */}
        <div className="flex flex-col md:flex-row items-center gap-12 mt-12 ms-8">
          <div className="w-full md:w-1/2">
            <h3
              className="text-2xl font-semibold mb-6"
              style={{ color: primaryColor }}
            >
              Why Choose AV Swasthya?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ms-9 ">
              {features.map(({ icon, title, description }, index) => (
                <div
                  key={index}
                  className="flex items-center p-5 bg-white rounded-xl shadow-md hover:bg-gray-100 transition-all duration-300"
                >
                  <IconWrapper>{icon}</IconWrapper>
                  <div className="ml-4 text-left ">
                    <h3
                      className="text-lg font-semibold group-hover:text-green-500 "
                      style={{ color: primaryColor }}
                    >
                      {title}
                    </h3>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 relative ms-10">
            <div
              className="absolute top-3 right-20 rounded-full w-40 h-40"
              style={{ backgroundColor: "rgba(30, 58, 138, 0.1)" }}
            ></div>
            <div
              className="absolute bottom-[-2px] left-[-40px] rotate-45"
              style={{
                backgroundColor: "rgba(30, 58, 138, 0.2)",
                width: "50px",
                height: "50px",
              }}
            ></div>
            <img
              src={whyChoose1}
              alt="Healthcare Professional"
              className="w-full max-w-md object-cover rounded-lg brightness-100"
            />
          </div>
        </div>

        {/* How We Work Section */}
        <div className="flex flex-col md:flex-row items-center gap-12 mt-16 ms-10">
          <div className="w-full md:w-1/2 relative">
            <div
              className="absolute top-[-20px] left-[-30px] rounded-full w-40 h-40"
              style={{ backgroundColor: "rgba(30, 58, 138, 0.2)" }}
            ></div>
            <div
              className="absolute top-1/2 right-[-10px] rotate-45 rounded-full w-16 h-16"
              style={{ backgroundColor: "rgba(14, 35, 95, 0.1)" }}
            ></div>
            <div
              className="absolute bottom-[-2px] left-[-40px] rounded-lg"
              style={{
                backgroundColor: "rgba(30, 58, 138, 0.2)",
                width: "35px",
                height: "35px",
              }}
            ></div>
            <img
              src={whyChoose2}
              alt="Healthcare Process"
              className="w-full max-w-md object-cover rounded-lg brightness-100"
            />
          </div>

          <div className="w-full md:w-1/2 me-16">
            <h3
              className="text-xl font-semibold text-center"
              style={{ color: primaryColor }}
            >
              How We Work?
            </h3>
            <div className="relative mt-6">
              <div
                className="absolute left-1/2 w-1 h-full rounded-lg"
                style={{ backgroundColor: primaryColor }}
              ></div>
              {steps.map(({ icon, title, description }, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "flex-row-reverse" : ""
                  } mb-6`}
                >
                  <div className="w-full max-w-xs p-3 bg-white rounded-lg shadow-md hover:bg-gray-100 flex items-center gap-3 group">
                    <IconWrapper1>{icon}</IconWrapper1>
                    <div>
                      <h3
                        className="text-sm font-medium"
                        style={{ color: primaryColor }}
                      >
                        {title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;