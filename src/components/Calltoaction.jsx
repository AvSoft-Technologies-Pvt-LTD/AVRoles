import { FaEnvelope, FaPhoneAlt, FaUser } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import Appointment from "../assets/BKapp.png";
import AVCard from "./microcomponents/AVCard";

const Calltoaction = () => {
    const navigate = useNavigate();
  
    return (
        <div className="flex justify-center items-center bg-[#f5f5f5] mb-24">
            <div className="w-7/9 h-9/10 rounded-3xl shadow-lg border-2 border-[#121e46]">
                <div className="relative bg-[#f5f5f5] p-6 z-10 container mx-auto px-6 py-10 lg:px-12 rounded-3xl">
                    <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-10 lg:gap-16">
                        <div className="w-full lg:w-1/2 flex flex-col items-center space-y-9">
                            <AVCard/>
                            <div className="flex flex-wrap gap-4 justify-center mt-6">
                            <button 
  className="bg-[#0E1630] hover:bg-white text-white hover:text-[#0e1630] border border-[#0e1630] px-10 py-2 rounded-3xl font-semibold shadow-md transition duration-300"
  onClick={() => navigate("/healthcard")}
>
  Generate HealthCard
</button>


                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-5">
                            <h2 className="text-2xl lg:text-3xl font-bold text-[#1E3a8a]">
                                Get expert advice from top doctors anytime,{" "}
                                <span className="text-[#01D48C]">
                                    anywhere!
                                </span>
                            </h2>
                            <p className="text-lg text-[#1e3a8a] max-w-lg ">
                                Connect with qualified healthcare professionals and receive personalized medical consultation from the comfort of your home.
                            </p>

                            <div className="flex flex-wrap items-center justify-center lg:justify-between w-full max-w-3xl bg-white rounded-full shadow-md border border-gray-200 overflow-hidden">
  {[
    "Consult With Doctor",
    "Order Medicines",
    "Lab/Scans Booking",
    "My Medical Records",
  ].map((text, index) => (
    <button
      key={index}
      className={`relative flex items-center justify-center font-medium px-5 py-3 text-[#0e1630]  text-xs font- w-1/2 sm:w-1/4 text-sm transition-transform duration-300 ease-in-out transform
        hover:scale-110  
        focus:outline-none
        ${index < 3 ? "border-b sm:border-b-0 sm:border-r border-gray-300" : ""}
      `}
      style={{ willChange: 'transform' }}
    >
      <span className="z-20 flex items-center gap-1">
        {text}
        <HiArrowRight size={16} />
      </span>
    </button>
  ))}
</div>



                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calltoaction;