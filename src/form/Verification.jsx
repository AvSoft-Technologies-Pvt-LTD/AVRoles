import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OtpVerification = () => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5) inputRefs.current[index + 1].focus();
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      if (index > 0) inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6) {
      setLoading(true);
      try {
        // Simulate OTP verification process
        console.log("Verifying OTP:", enteredOtp);
        navigate("/healthcard");
      } catch (error) {
        alert("OTP Verification Failed");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a 6-digit OTP");
    }
  };

  const handleResend = () => {
    setResendTimer(60);
    alert("OTP has been resent!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f9fc]">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl flex items-center p-8 border border-gray-200">
        <div className="flex-1 space-y-6">
          <h2 className="text-2xl font-bold text-[#0e1630] text-center">OTP Verification</h2>
          <p className="text-sm text-gray-600 text-center">
            Enter the 6-digit OTP sent to your registered number
          </p>

          <div className="flex justify-between gap-2 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                className="w-12 h-12 text-center border border-gray-300 rounded-md text-xl font-semibold text-[#0e1630] focus:outline-none focus:ring-2 focus:ring-[#01D48C]"
              />
            ))}
          </div>

          <button onClick={handleVerify}
            className="w-full bg-[#01D48C] hover:bg-[#00bd7c] transition-colors text-white font-semibold py-2 rounded-lg shadow-md mb-3"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify & Proceed"}
          </button>

          <div className="text-center text-sm text-gray-600">
            {resendTimer > 0 ? (
              <p>Resend OTP in {resendTimer} seconds</p>
            ) : (
              <button
                onClick={handleResend}
                className="text-[#01D48C] hover:underline font-medium"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 hidden lg:block">
          <img
            src="https://img.freepik.com/premium-vector/doctor-examines-report-disease-medical-checkup-annual-doctor-health-test-appointment-tiny-person-concept-preventive-examination-patient-consults-hospital-specialist-vector-illustration_419010-581.jpg?ga=GA1.1.587832214.1744916073&semt=ais_hybrid&w=740"
            alt="Login illustration"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;