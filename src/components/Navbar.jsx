import React, { useState } from 'react';
import { IoCallOutline, IoChatbubblesOutline } from "react-icons/io5";
import { RiContactsBook2Fill, RiHospitalLine, RiStethoscopeFill, RiFlaskFill, RiHomeOfficeLine, RiArrowDropDownFill, RiServiceFill } from "react-icons/ri";
import { TbInfoHexagon } from "react-icons/tb";
import RegisterForm from '../form/Registration';
import { useNavigate } from 'react-router-dom';

// Color constants
const primaryColor = "#0E1630";
const greenColor = "#01D48C";
const whiteColor = "#ffffff";

function Navbar() {

  const [dropdown, setDropdown] = useState(null);
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null); // ✅ Fix here

  const toggleDropdown = (menu) => {
    setDropdown(dropdown === menu ? null : menu);
  };

  return (
    <>
      <nav setUserType={setUserType} userType={userType}

        className="bg-white/10 backdrop-blur-xl px-6 py-2 flex justify-between items-center sticky top-0 text-lg shadow-lg relative z-50 transition-all duration-300"
        style={{ color: primaryColor }}
      >
        {/* Logo and Title */}
        <div className='flex items-center text-3xl'>
          {/* <img src={logo} className='w-12 h-12 my-1 rounded-full border-[#0e1630] border-1' alt='logo' /> */}
          <div>Logo</div>
          <h1 className='mx-2 font-extrabold flex items-center text-3xl ml-9' style={{ color: primaryColor }}>
            A<span style={{ color: greenColor }}>V</span>Swasthya
          </h1>
        </div>

        {/* Main Menu */}
        <ul className='flex gap-6 font-bold' style={{ color: primaryColor }}>
          <li  onClick={() => navigate('/registration', { state: { userType: 'patient' } })}
            className="relative cursor-pointer flex items-center gap-1 px-4 py-2 rounded transition hover:text-[#01D48C]">
            <RiContactsBook2Fill /> My Health Card
          </li>

          <li
            onClick={() => navigate('/registration', { state: { userType: 'doctor' } })}
            className="relative cursor-pointer flex items-center gap-1 px-4 py-2 rounded transition hover:text-[#01D48C]"
          >
            <RiStethoscopeFill /> For Doctors
          </li>

          <li
            onClick={() => navigate('/registration', { state: { userType: 'lab' } })}
            className="relative cursor-pointer flex items-center gap-1 px-4 py-2 rounded transition hover:text-[#01D48C]"
          >
            <RiFlaskFill /> E-Labs
          </li>
          <li
            className='relative cursor-pointer flex items-center gap-1 hover:text-[#01D48C] transition'
            onClick={() => toggleDropdown('hospitals')}
          >
            <RiHospitalLine /> For Hospitals
          </li>

          <li className='relative group cursor-pointer flex items-center gap-1 hover:text-[#01D48C] transition'>
            <RiServiceFill size={20} />
            Services <RiArrowDropDownFill />

            <ul className='absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-white border border-gray-200 py-2 px-3 mt-2 rounded-xl shadow-xl w-52 z-20 top-14 transition-all duration-200'>
              {[
                { label: 'Healthcard', icon: <RiContactsBook2Fill /> },
                { label: 'Consultation', icon: <RiStethoscopeFill /> },
                { label: 'Pharmacy', icon: <RiFlaskFill /> },
                { label: 'Insurance', icon: <TbInfoHexagon /> },
                { label: 'Emergency', icon: <IoCallOutline /> }
              ].map(({ label, icon }) => (
                <li
                  key={label}
                  className='flex items-center gap-2 px-3 py-2 text-[#0E1630] hover:bg-[#01D48C] hover:text-white hover:rounded-lg transition-all duration-150 cursor-pointer'
                >
                  {icon} {label}
                </li>
              ))}
            </ul>

          </li>
        </ul>

        {/* Auth Buttons */}
        <div className='flex gap-3 font-normal'>
          <button
            className='cursor-pointer border-2 rounded-3xl px-4 py-1 hover:shadow-md hover:scale-[1.03] transition-transform duration-300 ease-in-out'
            style={{
              color: primaryColor,
              borderColor: greenColor,
              hover: {
                backgroundColor: primaryColor,
                color: greenColor,
              },
            }}
            onClick={() => navigate('/login')}
          >
            Login
          </button>

          <button
            className='cursor-pointer rounded-3xl px-4 py-1 hover:shadow-md hover:scale-[1.03] transition-transform duration-300 ease-in-out'
            style={{
              backgroundColor: primaryColor,
              color: whiteColor,
            }}
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      </nav>
      {userType && <RegisterForm userType={userType} />}
    </>
  );
}

export default Navbar;
