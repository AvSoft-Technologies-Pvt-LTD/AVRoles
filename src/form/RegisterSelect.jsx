import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaHospital, FaStethoscope, FaFlask, FaPills } from 'react-icons/fa';

const RegisterSelect = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const userType = [
    { label: "Patient", value: "patient", icon: <FaUser Alt className="mr-2" /> },
    { label: "Hospital", value: "hospital", icon: <FaHospital className="mr-2" /> },
    { label: "Doctor", value: "doctor", icon: <FaStethoscope className="mr-2" /> },
    { label: "Labs / Scan", value: "lab", icon: <FaFlask className="mr-2" /> },
    { label: "Pharmacy", value: "pharmacy", icon: <FaPills className="mr-2" /> },
  ];

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false);
    navigate("/registration", { state: { userType: option.value } });
  };

  return (
    <div className="min-h-screen bg-[#f5f9fc] flex items-center justify-center">
      <div className="flex flex-col md:flex-row w-full max-w-5xl p-8 bg-white shadow-lg">
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-[#0e1630] mb-8 leading-relaxed">
            Your <span className="text-[#01D48C]">Health</span>, Our Priority.
            Expert <span className="text-[#01D48C]">Care</span> You Can Trust
          </h1>
          <h3 className="text-2xl font-bold text-center mb-4 text-[#01D48C]">
            Welcome to AV Swasthya
          </h3>
          <p className="text-center text-gray-600 mb-8">
            "Empowering Your Health Journey with AVSwasthya — <span className="text-[#01D48C]">Personalized Care</span> at Your Fingertips, <span className="text-[#01D48C]">Trusted Services</span> Around the Clock."
          </p>

          <div className="relative w-full">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full p-2 text-lg bg-white text-gray-700 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#01D48C] transition"
            >
              {selected ? selected.label : "Who am I?"}
            </button>

            {isOpen && (
              <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {userType.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option)}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-[#01D48C] hover:text-white cursor-pointer"
                  >
                    {option.icon}
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            src="https://img.freepik.com/premium-vector/doctor-examines-report-disease-medical-checkup-annual-doctor-health-test-appointment-tiny-person-concept-preventive-examination-patient-consults-hospital-specialist-vector-illustration_419010-581.jpg"
            alt="Login illustration"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterSelect;