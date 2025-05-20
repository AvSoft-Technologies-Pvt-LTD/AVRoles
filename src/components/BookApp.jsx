import React, { useState, useEffect } from "react";
import axios from "axios";
import imges from "../assets/book.jpeg";

const symptomSpecialtyMap = {
  fever: ["Pediatrics", "General Physician", "Ear, Nose, Throat"],
  cough: ["Pulmonologist", "General Physician"],
  headache: ["Neurologist", "General Physician"],
  pain: ["Orthopedic", "General Physician"],
  stomach: ["Gastroenterologist", "General Physician"],
  rash: ["Dermatologist", "General Physician"],
  "chest pain": ["Cardiologist", "General Physician"]
};



const citiesData = [
  { id: "delhi", name: "Delhi" },
  { id: "mumbai", name: "Mumbai" },
  { id: "bangalore", name: "Bangalore" },
  { id: "chennai", name: "Chennai" },
  { id: "kolkata", name: "Kolkata" },
  { id: "hyderabad", name: "Hyderabad" },
  { id: "pune", name: "Pune" }
];

export default function AppointmentForm() {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [consultationType, setConsultationType] = useState("Physical");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [gpayDetails, setGpayDetails] = useState({ email: "" });
  const [netbankingDetails, setNetbankingDetails] = useState({ bankName: "" });
  const [doctors, setDoctors] = useState([]);
  const [bankSearch, setBankSearch] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); 
const [gpayErrors, setGpayErrors] = useState({});
const [netbankingErrors, setNetbankingErrors] = useState({});
// State for confirmation modal
  const fetchDoctors = async () => {
    try {
      const response = await axios.get('https://mocki.io/v1/e85026d5-99b0-4f23-8241-c323074dd88a'); // Replace with your actual API endpoint
      return response.data;
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      throw error;
    }
  };
  const validateFields = () => {
    let valid = true;
  
    // CARD VALIDATION
    if (paymentMethod === "Card") {
      const errors = {};
      if (!cardDetails.number || !/^\d{16}$/.test(cardDetails.number)) {
        errors.number = "Enter a valid 16-digit card number";
        valid = false;
      }
      if (!cardDetails.name || cardDetails.name.trim().length < 3) {
        errors.name = "Enter a valid name";
        valid = false;
      }
      if (
        !cardDetails.expiry ||
        !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)
      ) {
        errors.expiry = "Enter expiry in MM/YY format";
        valid = false;
      }
      if (!cardDetails.cvv || !/^\d{3}$/.test(cardDetails.cvv)) {
        errors.cvv = "Enter a valid 3-digit CVV";
        valid = false;
      }
      setCardErrors(errors);
    }
  
    // GPAY VALIDATION
    if (paymentMethod === "GPay") {
      const errors = {};
      if (!gpayDetails.email || !/^\S+@\S+\.\S+$/.test(gpayDetails.email)) {
        errors.email = "Enter a valid email";
        valid = false;
      }
      if (!gpayDetails.mobile || !/^\d{10}$/.test(gpayDetails.mobile)) {
        errors.mobile = "Enter a 10-digit mobile number";
        valid = false;
      }
      setGpayErrors(errors);
    }
  
    // NETBANKING VALIDATION
    if (paymentMethod === "NetBanking") {
      const errors = {};
      if (!netbankingDetails.bankName) {
        errors.bankName = "Please select a bank";
        valid = false;
      }
      setNetbankingErrors(errors);
    }
  
    return valid;
  };
  
  useEffect(() => {
    const getDoctors = async () => {
      try {
        const doctorData = await fetchDoctors();
        setDoctors(doctorData);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };

    getDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    return (
      doctor.specialty === specialty &&
      doctor.location === location &&
      doctor.availableDates.includes(date) &&
      doctor.availableTimes.includes(time) &&
      doctor.consultationType.toLowerCase() === consultationType.toLowerCase()
    );
  });

  const isValidMobile = (number) => {
    const pattern = /^[ 6-9]\d{9}$/;
    return pattern.test(number);
  };

  const handleSymptomsChange = (e) => {
    const val = e.target.value.toLowerCase();
    setSymptoms(val);
    setSpecialties(symptomSpecialtyMap[val] || []);
    setSpecialty("");
  };

  const handleNext = () => {
    if (step === 1 && (!location || !symptoms || !date || !time || !specialty || !consultationType || !selectedDoctor)) {
      alert("Please fill all fields and select a doctor.");
      return;
    }
    if (step === 2 && (!name || !mobile)) {
      alert("Please enter name and mobile number");
      return;
    }
    if (step === 3 && !paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    if (step === 3) {
      handleConfirm(); // Call handleConfirm instead of just showing modal
    } else {
      setStep((prev) => prev + 1);
    }
  };
  const validateCardDetails = () => {
    const cardNumberRegex = /^[0-9]{16}$/;
    const nameRegex = /^[a-zA-Z\s]+$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    const cvvRegex = /^[0-9]{3,4}$/;
  
    let errors = {};
  
    if (!cardNumberRegex.test(cardDetails.number.replace(/\s+/g, ""))) {
      errors.number = "Invalid card number";
    }
  
    if (!nameRegex.test(cardDetails.name.trim())) {
      errors.name = "Invalid name";
    }
  
    if (!expiryRegex.test(cardDetails.expiry)) {
      errors.expiry = "Invalid expiry date";
    } else {
      const [month, year] = cardDetails.expiry.split('/');
      const expiryDate = new Date(`20${year}`, parseInt(month, 10) - 1);
      const currentDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1); // Set to end of expiry month
  
      if (expiryDate <= currentDate) {
        errors.expiry = "Card expired";
      }
    }
  
    if (!cvvRegex.test(cardDetails.cvv)) {
      errors.cvv = "Invalid CVV";
    }
  
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

const [cardErrors, setCardErrors] = useState({});

  // const handleBack = () => {
  //   setStep((prev) => prev - 1);
  // };

  const sendOtp = () => {
    if (!isValidMobile(mobile)) {
      alert("Please enter a valid 10-digit mobile number starting with 6-9.");
      return;
    }
    setOtpSent(true);
    alert("OTP sent to " + mobile);
  };

  const verifyOtp = () => otp === "1234";
  const handlePayment = () => {
    const isValid = validateFields(); // run validation first
    if (!isValid) return; // stop if validation fails
  
    handleConfirm(); // proceed only if validation passes
    setShowConfirmationModal(false);
  };
  
  const handleConfirm = () => {
    setShowModal(true); // Show modal on confirmation
    setTimeout(() => {
      resetForm(); // Reset the form after 3 seconds
    }, 3000); // 3000 milliseconds = 3 seconds
  };

  const resetForm = () => {
    setStep(1);
    setLocation("");
    setSymptoms("");
    setDate("");
    setTime("");
    setSpecialty("");
    setSpecialties([]);
    setSelectedDoctor(null);
    setName("");
    setMobile("");
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setVerifying(false);
    setPaymentMethod("");
    setCardDetails({ number: "", expiry: "", cvv: "" });
    setGpayDetails({ email: "" });
    setNetbankingDetails({ bankName: "" });
    setShowModal(false); // Close modal
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl w-full">
        <div className="w-full lg:w-1/2 p-8 form-container">
          <h2 className="text-xl font-semibold text-blue-900 mb-6">Consult with a Doctor</h2>
          {step === 1 && (
  <div className="space-y-6 text-sm  text-[#0e1630]">
    {/* Consultation Type */}
    <div>
      <h4 className="font-semibold mb-2 text-[#0e1630]">Consultation Type</h4>
      <div className="flex gap-4">
        {["Physical", "Virtual"].map((type) => (
          <label
            key={type}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl cursor-pointer transition-all ${
              consultationType === type
                ? "border-[#0e1630] bg-[#0e1630]/10"
                : "border-[#ccd1dc] hover:border-[#0e1630]"
            }`}
          >
            <input
              type="radio"
              name="consultationType"
              value={type}
              checked={consultationType === type}
              onChange={(e) => setConsultationType(e.target.value)}
              className="accent-[#0e1630]"
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Location */}
    <select
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      className="w-full p-3 border border-[#ccd1dc] rounded-xl bg-white text-[#0e1630] focus:outline-none focus:ring-1 focus:ring-[#01D48C]"
    >
      <option value="" >Select location</option>
      {citiesData.map((c) => (
        <option key={c.id} value={c.name}>
          {c.name}
        </option>
      ))}
    </select>

    {/* Symptoms */}
    <input
      type="text"
      placeholder="Describe your symptoms..."
      value={symptoms}
      onChange={handleSymptomsChange}
      className="w-full p-3 border border-[#ccd1dc] rounded-xl bg-white text-[#0e1630] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#01D48C]"
    />

    {/* Suggested Specialties */}
    {specialties.length > 0 && (
      <div className="space-y-2">
        {specialties.map((spec, i) => (
          <label
            key={i}
            className={`flex justify-between items-center px-4 py-2 border rounded-xl cursor-pointer transition-all ${
              specialty === spec
                ? "border-[#0e1630] bg-[#0e1630]/10"
                : "border-[#ccd1dc] hover:border-[#0e1630]"
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="specialty"
                value={spec}
                checked={specialty === spec}
                onChange={(e) => setSpecialty(e.target.value)}
                className="accent-[#0e1630]"
              />
              <span>{spec}</span>
            </div>
          </label>
        ))}
      </div>
    )}

    {/* Date & Time */}
    <div className="flex gap-4">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-3 border border-[#ccd1dc] rounded-xl bg-white text-[#0e1630] focus:outline-none focus:ring-1 focus:ring-[#01D48C]"
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full p-3 border border-[#ccd1dc] rounded-xl bg-white text-[#0e1630] focus:outline-none focus:ring-1 focus:ring-[#01D48C]"
      />
    </div>

    {/* Available Doctors */}
    {filteredDoctors.length > 0 && (
  <div>
    <h4 className="text-sm font-semibold mb-2 text-[#0e1630]">Available Doctors</h4>
    <div className="flex overflow-x-auto space-x-4 pb-2">
      {filteredDoctors.map((doctor) => (
        <div
          key={doctor.name}
          className={`flex flex-shrink-0 items-start p-4 border rounded-2xl shadow-sm transition-all ${
            selectedDoctor?.name === doctor.name
              ? "border-[#0e1630] bg-[#0e1630]/10 ring-1 ring-[#0e1630]"
              : "border-[#ccd1dc] hover:border-[#0e1630]"
          }`}
          onClick={() => setSelectedDoctor(doctor)}
          style={{ width: '200px', position: 'relative' }}
        >
          <img
            src={doctor.photo}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://cdn-icons-png.flaticon.com/512/3870/3870822.png";
            }}
            alt={doctor.name}
            className="w-10 h-10 object-cover rounded-full border-2 border-[#0e1630] mb-2"
          />
          <div className="flex-1 pl-3">
            <h6 className="text-sm font-medium text-[#0e1630] leading-tight break-words">
              {doctor.name}
            </h6>
            <p className="text-xs text-gray-500">{doctor.specialty}</p>
          </div>
          <span className="text-[#01D48C] font-semibold text-sm absolute bottom-2 right-2">
            ₹{doctor.fees}
          </span>
        </div>
      ))}
    </div>
  </div>
)}


    {/* Next Button - Dark Blue Primary */}
    <div className="flex justify-end items-end">
  <button
    type="button"
    onClick={handleNext}
    className="bg-[#0e1630] text-white py-2.5 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ease-in-out hover:bg-white hover:text-[#0e1630] hover:ring-2 hover:ring-[#0e1630] active:scale-95 shadow-md hover:shadow-lg"
  >
    Next
  </button>
</div>


  </div>
)}





          {/* Step 2: Personal Info & OTP */}
          {step === 2 && (
  <div className="space-y-4  p-4  text-sm">
    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-1">You have selected the following doctor:</h2>
      {selectedDoctor && (
        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 text-sm">
          <h3 className="text-lg font-bold text-blue-900">{selectedDoctor.name}</h3>
          <p className="text-xs text-gray-500">{selectedDoctor.qualification}</p>
          <p className="text-xs text-gray-500">Experience: {selectedDoctor.experience} years</p>
          <p className="text-xs text-gray-500">Consultation Type: {selectedDoctor.consultationType}</p>
          <p className="text-sm font-semibold text-green-600 mt-1">Consultation Fee: ₹{selectedDoctor.fees}</p>
        </div>
      )}
    </div>

    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-1">Enter your personal information</h2>
      <p className="text-xs text-gray-500 mb-2">This helps us verify your details to proceed with your appointment.</p>

      <div className="space-y-3 text-sm">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e1630]"
        />

        <input
          type="tel"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0e1630]"
        />

        {!otpSent ? (
          <button
            type="button"
            onClick={sendOtp}
            className="w-full bg-[#0e1630] hover:bg-[#0b1125] transition text-white py-2.5 rounded-md font-medium text-sm"
          >
            Send OTP
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <button
                type="button"
                onClick={async () => {
                  setVerifying(true);
                  const result = await verifyOtp();
                  setVerifying(false);
                  if (result) {
                    setOtpVerified(true);
                  } else {
                    alert("Incorrect OTP");
                  }
                }}
                disabled={verifying}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-medium text-white text-sm ${
                  verifying
                    ? "bg-gray-400"
                    : "bg-green-600 hover:bg-green-700"
                } transition`}
              >
                {verifying ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Verifying...
                  </>
                ) : (
                  "Verify"
                )}
              </button>
            </div>

            {otpVerified && (
           <div className="relative min-h-[120px]"> {/* Make sure parent is relative */}
           <button
             type="button"
             onClick={() => setStep(3)}
             className="absolute bottom-0 right-0 bg-[#0e1630] text-white py-2.5 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ease-in-out hover:bg-white hover:text-[#0e1630] hover:ring-2 hover:ring-[#0e1630] active:scale-95 shadow-md hover:shadow-lg"
           >
             Next
           </button>
         </div>
         
            )}
          </>
        )}
      </div>
    </div>
  </div>
)}


          {/* Step 3: Payment Info */}
          {step === 3 && (
  <div className="text-sm text-[#002D62]"> {/* Dark Blue Text */}
    <p className="font-semibold text-lg mb-4">Choose a Payment Method</p>

    {/* Payment Method Selection */}
    <div className="grid grid-cols-3 gap-4 mb-6">
      {['Card', 'GPay', 'NetBanking'].map((method) => (
        <label
          key={method}
          className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
            paymentMethod === method
              ? 'border-blue-800 bg-blue-50 font-semibold' // Dark blue when selected
              : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={method}
            checked={paymentMethod === method}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="hidden"
          />
          {method}
        </label>
      ))}
    </div>

    {/* Dynamic Form */}
    <div className="h-[320px] overflow-y-auto transition-all duration-300 border rounded-md p-4 bg-gray-50">
      {paymentMethod === 'Card' && (
        <div className="space-y-4">
          <InputField
            label="Card Number"
            placeholder="Enter your card number"
            value={cardDetails.number}
            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
            error={cardErrors.number}
            inputClassName="focus:border-green-500" // ✅ Green border on typing
          />
          <InputField
            label="Name on Card"
            placeholder="Enter name on card"
            value={cardDetails.name}
            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
            error={cardErrors.name}
            inputClassName="focus:border-green-500"
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Expiry (MM/YY)"
              placeholder="MM/YY"
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
              error={cardErrors.expiry}
              inputClassName="focus:border-green-500"
            />
            <InputField
              label="CVV"
              placeholder="CVV"
              type="password"
              value={cardDetails.cvv}
              onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
              error={cardErrors.cvv}
              inputClassName="focus:border-green-500"
            />
          </div>
        </div>
      )}

      {paymentMethod === 'GPay' && (
        <div className="space-y-4">
          <InputField
            label="GPay Email"
            placeholder="example@gmail.com"
            value={gpayDetails.email}
            onChange={(e) => setGpayDetails({ ...gpayDetails, email: e.target.value })}
            error={gpayErrors.email}
            inputClassName="focus:border-green-500"
          />
          <InputField
            label="Registered Mobile"
            placeholder="10-digit mobile number"
            type="tel"
            value={gpayDetails.mobile}
            onChange={(e) => setGpayDetails({ ...gpayDetails, mobile: e.target.value })}
            error={gpayErrors.mobile}
            inputClassName="focus:border-green-500"
          />
          <InputField
            label="Transaction ID (Optional)"
            placeholder="Txn1234..."
            value={gpayDetails.transactionId}
            onChange={(e) => setGpayDetails({ ...gpayDetails, transactionId: e.target.value })}
            inputClassName="focus:border-green-500"
          />
        </div>
      )}

      {paymentMethod === 'NetBanking' && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Search Bank"
            value={bankSearch}
            onChange={(e) => setBankSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-2 focus:border-green-500"
          />
          <div className="max-h-40 overflow-y-auto space-y-2">
            {['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak', 'PNB', 'BOB', 'Yes Bank']
              .filter((bank) => bank.toLowerCase().includes(bankSearch.toLowerCase()))
              .map((bank) => (
                <label key={bank} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="selectedBank"
                    value={bank}
                    checked={netbankingDetails.bankName === bank}
                    onChange={(e) =>
                      setNetbankingDetails({
                        ...netbankingDetails,
                        bankName: e.target.value,
                      })
                    }
                  />
                  <span>{bank}</span>
                </label>
              ))}
          </div>
          {netbankingErrors.bankName && (
            <p className="text-red-500 text-sm mt-1">{netbankingErrors.bankName}</p>
          )}
        </div>
      )}
    </div>

    {/* Confirm Buttons */}
    <div className="mt-6 flex justify-end">
      <button
        type="button"
        onClick={handlePayment}
        className="bg-[#002D62] hover:bg-[#001f45] text-white px-4 py-2 rounded-md"
      >
        Pay Now
      </button>
      <button
        type="button"
        onClick={() => setShowConfirmationModal(false)}
        className="ml-2 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
      >
        Cancel
      </button>
    </div>
  </div>
)}
 {showConfirmationModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Confirm Payment</h2>
      <p className="text-sm text-gray-500">Please confirm your payment to book the appointment.</p>
      <div className="mt-4">
        <p className="font-semibold">Appointment Details:</p>
        <p>Location: {location}</p>
        <p>Symptoms: {symptoms}</p>
        <p>Date: {date}</p>
        <p>Time: {time}</p>
        <p>Specialty: {specialty}</p>
        <p>Consultation Type: {consultationType}</p>
        <p>Doctor: {selectedDoctor?.name}</p>
        <p>Mobile: {mobile}</p>
        <p>Payment Method: {paymentMethod}</p>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handlePayment}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Pay Now
        </button>
        <button
          type="button"
          onClick={() => setShowConfirmationModal(false)}
          className="ml-2 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Appointment Details</h2>
                <p className="text-sm text-gray-500">Location: {location}</p>
                <p className="text-sm text-gray-500">Symptoms: {symptoms}</p>
                <p className="text-sm text-gray-500">Date: {date}</p>
                <p className="text-sm text-gray-500">Time: {time}</p>
                <p className="text-sm text-gray-500">Specialty: {specialty}</p>
                <p className="text-sm text-gray-500">Consultation Type: {consultationType}</p>
                <p className="text-sm text-gray-500">Doctor: {selectedDoctor?.name}</p>
                <p className="text-sm text-gray-500">Mobile: {mobile}</p>
                <p className="text-lg font-semibold text-green-600 mt-2">Payment Method: {paymentMethod}</p>

                {/* Success Message */}
                <div className="mt-6 text-center">
                  <p className="text-green-600 text-lg font-bold">Booked Successfully!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-auto bg-gray-300" />
        <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center p-8">
          <div className="text-center">
            <img
              alt="Free Follow-up"
              className="mx-auto mb-4 w-full h-full object-contain"
              src={imges}
            />
           
          </div>
        </div>
      </div>
    </div>
  );
}
const InputField = ({ label, placeholder, type = "text", value, onChange, error }) => (
  <div>
    <label className="block text-gray-700 text-sm mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-2 border rounded-md ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);