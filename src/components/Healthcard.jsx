import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaDownload } from "react-icons/fa";
import { useSelector } from "react-redux";
import AVCard from "./microcomponents/AVCard";

function Healthcard() {
  const userData = useSelector((state) => state.auth.user);
  const [healthId, setHealthId] = useState("");
  const [gender, setGender] = useState("");
  const [state, setState] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [dob, setDob] = useState("");
  const navigate = useNavigate();
  const cardRef = useRef();

  useEffect(() => {
    if (userData?.gender && state && city && userData?.dob) {
      setHealthId(
        `AV${userData.gender.charAt(0).toUpperCase()}${state}${city}${userData.dob.replace(/-/g, "")}`
      );
    }
  }, [userData?.gender, state, city, userData?.dob]);

  const handleSkip = () => {
    navigate("/login");
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = "AV Health Card";
    window.print();
    document.title = originalTitle;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#e0f7f5] to-[#ffffff] flex items-center justify-center px-4 py-10 print:bg-white">
      <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 w-full max-w-6xl flex flex-col md:flex-row gap-10 print:shadow-none print:p-0">
        {/* Left - AVCard */}
        <div className="w-full md:w-1/2 flex items-center justify-center" ref={cardRef}>
          <AVCard
              initialName={`${userData?.firstName || ''} ${userData?.lastName || ''}`}
              initialCardNumber={healthId}
              initialGender={userData?.gender || ''}
              initialPhoneNumber={userData?.phone || ''}
              initialPhotoUrl="/default-avatar.png"
              isReadOnly={true}
          />
        </div>

        {/* Right - Form */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-[#0e1630]">
            Welcome to <span className="text-[#F4C430]">AV Swasthya</span>
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Generate your digital health card with just a few details. It's simple and secure.
          </p>
          <p className="text-center text-[#666] text-sm italic mb-4">
            {healthId || "Your Health ID will appear here"}
          </p>

          <form className="space-y-3 text-sm">
            {/* First & Last Name */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="First Name"
                value={userData?.firstName || ''}
                className="p-2 w-1/2 border border-gray-300 rounded-md shadow-sm placeholder:text-xs"
                readOnly
              />
              <input
                type="text"
                placeholder="Last Name"
                value={userData?.lastName || ''}
                className="p-2 w-1/2 border border-gray-300 rounded-md shadow-sm placeholder:text-xs"
                readOnly
              />
            </div>

            {/* DOB & Gender */}
            <div className="flex gap-2">
              <input
                placeholder="DOB"
                value={userData?.dob || ''}
                className="p-2 w-1/2 border border-gray-300 rounded-md shadow-sm text-sm"
                
              />
              <input
                placeholder="Gender"
                   type="text"
                   value={userData?.gender || ''}
                className="p-2 w-1/2 border border-gray-300 rounded-md shadow-sm text-sm"
              
                readOnly
              >
              </input>
            </div>

            {/* State & City */}
            <div className="flex gap-2">
              <select
                className="p-2 w-1/2 border border-gray-300 rounded-md shadow-sm text-sm"
                onChange={(e) => setState(e.target.value)}
              >
                <option value="">State</option>
                <option value="MH">Maharashtra</option>
                <option value="DL">Delhi</option>
                <option value="KA">Karnataka</option>
              </select>
              <select
                className="p-2 w-1/2 border border-gray-300 rounded-md shadow-sm text-sm"
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">City</option>
                <option value="CSTM">Mumbai (CSTM)</option>
                <option value="NDLS">New Delhi (NDLS)</option>
                <option value="SBC">Bangalore (SBC)</option>
              </select>
            </div>
          </form>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              className="flex-1 flex items-center justify-center gap-2 
  bg-[#0e1630] text-white border-2 border-transparent 
  hover:bg-white hover:text-[#0e1630] hover:border-[#0e1630]
  font-semibold py-2 rounded-xl 
  transition-all duration-300 
  shadow-md hover:shadow-[#0e1630]/40 hover:scale-105"
              onClick={handlePrint}
            >
              <FaDownload /> Generate & Download
            </button>

            <button
              className="flex-1 flex items-center justify-center gap-2 
  bg-[#0e1630] text-white 
  hover:bg-[#F4C430] hover:text-[#0e1630] 
  font-semibold py-2 rounded-xl 
  transition-all duration-300 
  shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={handleSkip}
            >
              Skip & Continue <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Healthcard;

