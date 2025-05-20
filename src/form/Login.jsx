import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem("user");
  }, []);

  const mockLogin = async ({ phone, password }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = [
          { phone: "9067800201", password: "Doctor@123", userType: "doctor" },
          { phone: "9370672873", password: "Lab@123", userType: "lab" },
          { phone: "1111111111", password: "patient123", userType: "patient" },
          { phone: "1234567890", password: "Freelancer@123", userType: "freelancer" },
          { phone: "9876543210", password: "Hospital@123", userType: "hospital" },
          { phone: "9999999999", password: "SuperAdmin@123", userType: "superadmin" }, 
        ];
        

        const user = users.find((u) => u.phone === phone && u.password === password);

        if (user) {
          resolve({ success: true, userType: user.userType });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 1000);
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await mockLogin({ phone, password });
      const { userType } = response;

      localStorage.setItem("user", JSON.stringify({ userType, phone }));

      if (userType === "superadmin") {
        navigate("/superadmindashboard");
      } else if (userType === "doctor") {
        navigate("/doctordashboard");
      } else if (userType === "lab") {
        navigate("/labdashboard");
      } else if (userType === "freelancer") {
        navigate("/freelancerdashboard");
      } else if (userType === "hospital") {
        navigate("/hospitaldashboard");
      } else {
        navigate("/patientdashboard");
      }
      
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f9fc]">
      <div className="flex items-center w-full max-w-4xl bg-white p-8 rounded-2xl shadow-md border border-gray-200">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-[#0e1630] mb-6">
            Login to Your Account
          </h2>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target .value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="accent-[#01D48C]"
                />
                <span>Remember me</span>
              </label>
              <span className="text-sm text-[#01D48C] hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0e1630] hover:bg-[#01D48C] text-white py-3 px-6 rounded-lg"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            Don't have an account?{" "}
            <span
              className="text-[#01D48C] hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </div>

        <div className="w-full max-w-xs ml-8">
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

export default Login;