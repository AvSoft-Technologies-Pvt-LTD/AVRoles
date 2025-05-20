import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineCamera } from "react-icons/ai";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";

const RegisterForm = () => {
  const specializationList = {
    Ayush: ["Ayurveda", "Homeopathy", "Unani", "Siddha", "Naturopathy", "Yoga"],
    Allopathy: ["Cardiologist", "Dermatologist", "Orthopedic", "Pediatrician", "ENT", "Gynecologist", "Neurologist", "Psychiatrist"],
  };

  const testOptions = ["CBC", "LFT", "KFT", "Lipid Profile", "T3/T4/TSH", "Dengue", "Malaria", "X-Ray", "MRI", "CT Scan", "ECG", "2D Echo", "Mammography"];
  const specialServicesOptions = ["Home Sample Collection", "Emergency Diagnostic Services", "Tele-Radiology Services", "Mobile Diagnostic Units"];
  const inputStyle = "p-2 border border-gray-300 rounded w-full";
  const navigate = useNavigate();
  const location = useLocation();
  const userType = location.state?.userType;

  const [showSpecializationDropdown, setShowSpecializationDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});


  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

const [previewDoc, setPreviewDoc] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "", middleName: "", lastName: "", phone: "", aadhaar: "", gender: "", dob: "", email: "",
    photo: null, documents: [],
    password: "", confirmPassword: "", address: "",
    roleSpecificData: {
      registrationNumber: "", practiceType: "", specialization: "", qualification: "",
      willingToBeAvswasthya: "", associatedWithHospital: "", freelancerStatus: "", hospitalNames: [],
      location: "", agreeDeclaration: false, diagnosticCenterType: "", diagnosticCenterName: "",
      ownerName: "", licenseNumber: "", availableTests: [], specialServices: [], otherSpecialService: "",
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    if (name === "aadhaar") {
      const formatted = value.replace(/\D/g, '').slice(0, 12).replace(/(\d{4})(\d{4})(\d{0,4})/, (_, g1, g2, g3) => [g1, g2, g3].filter(Boolean).join('-'));
      setFormData(prev => ({ ...prev, aadhaar: formatted }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: val,
      roleSpecificData: {
        ...prev.roleSpecificData,
        [name]: val,
      },
    }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    // Handling photo upload
    if (name === "photo" && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setFormData(prev => ({ ...prev, photo: file }));
        setPhotoPreview(URL.createObjectURL(file)); // Preview the uploaded photo
      } else {
        alert("Please upload a valid photo.");
      }
    }
  
    // Handling document upload
    else if (name === "documents" && files.length > 0) {
      const validFiles = Array.from(files).filter(file => 
        file.type === 'application/pdf' || file.type.startsWith("image/")
      );
  
      // Add valid files to the documents array in formData
      if (validFiles.length > 0) {
        setFormData(prev => ({
          ...prev,
          documents: [...prev.documents, ...validFiles], // Add new documents
        }));
      } else {
        alert("Only PDF or image files are allowed.");
      }
    }
  };
  

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;
    const phoneRegex = /^\d{10}$/;
    const aadhaarRegex = /^\d{4}-\d{4}-\d{4}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = " Last name is required";
    if (!emailRegex.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.phone.match(phoneRegex)) newErrors.phone = "Phone must be 10 digits";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!aadhaarRegex.test(formData.aadhaar)) newErrors.aadhaar = 'Invalid Aadhaar format';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!passwordRegex.test(formData.password)) newErrors.password = 'Weak password';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.photo) newErrors.photo = 'Upload a photo';
    if (!formData.roleSpecificData.agreeDeclaration) newErrors.agreeDeclaration = 'Please accept declaration';

    if (userType === "doctor") {
      const d = formData.roleSpecificData;
      if (!d.registrationNumber) newErrors.registrationNumber = "Registration number is required";
      if (!d.practiceType) newErrors.practiceType = "Practice type is required";
      if (!d.specialization) newErrors.specialization = "Specialization is required";
      if (!d.qualification) newErrors.qualification = "Qualification is required";
      if (!d.location) newErrors.location = "Location is required";
      if (d.documents.length === 0) newErrors.documents = 'Upload at least one document';
      if (d.willingToBeAvswasthya === "") newErrors.willingToBeAvswasthya = "Please select if you're willing to be an AV Swasthya doctor.";
      if (d.associatedWithHospital === "") newErrors.associatedWithHospital = "Please select if you're associated with any hospital.";
      if (d.freelancerStatus === "") newErrors.freelancerStatus = "Please select if you're a freelancer doctor.";
      if (d.associatedWithHospital === "yes" && d.hospitalNames.some(hospital => hospital.trim() === "")) {
        newErrors.hospitalNames = "Hospital names cannot be empty.";
      }
      if (!d.associationType) newErrors.associationType = "Please select the type of association.";
    }

    if (userType === "lab") {
      const d = formData.roleSpecificData;
      if (!d.diagnosticCenterType) newErrors.diagnosticCenterType = "Center type required";
      if (!d.diagnosticCenterName) newErrors.diagnosticCenterName = "Center name required";
      if (!d.registrationNumber) newErrors.registrationNumber = "Registration number required";
      if (!d.ownerName) newErrors.ownerName = "Owner name required";
      if (!d.licenseNumber) newErrors.licenseNumber = "License number required";
      if (!d.location) newErrors.location = "Location required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'documents') {
        formData.documents.forEach(doc => formDataToSubmit.append('documents', doc));
      } else {
        formDataToSubmit.append(key, formData[key]);
      }
    });
    try {
      const response = await axios.post('https://your-valid-api-endpoint', formDataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("User  registered:", response.data);
      navigate("/verification");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error during registration: " + (error.response ? error.response.data.message : "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (name, type = "text", placeholder = "") => (
    <div>
      <input type={type} name={name} placeholder={placeholder} onChange={handleInputChange} value={formData[name]} className={`${inputStyle} ${errors[name] ? "border-red-500" : ""}`} />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  const renderUploadedDocuments = () => {
    return formData.documents.map((doc, index) => (
      <div key={index} className="flex items-center justify-between">
        <span className="text-gray-700">{doc.name}</span>
        <button type="button" onClick={() => setIsModalOpen(true)} className="text-sm text-blue-600 flex items -center gap-1">
          <FiEye />
        </button>
      </div>
    ));
  };

  const renderFieldsBasedOnRole = () => {
    const renderUploadedDocuments = () => {
      return formData.documents.map((doc, index) => (
        <div key={index} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
          <span className="text-gray-700 text-sm truncate">{doc.name}</span>
          <button
            type="button"
            onClick={() => {
              setPreviewDoc(doc);
              setIsModalOpen(true);
            }}
            className="text-sm text-blue-600 flex items-center gap-1"
          >
            <FiEye className="text-lg" />
          </button>
        </div>
      ));
    };
    
    if (userType === "doctor") {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderInput("registrationNumber", "text", "Registration Number")}
            <div>
              <select name="practiceType" value={formData.roleSpecificData.practiceType} onChange={handleInputChange} className={`${inputStyle} ${errors.practiceType ? "border-red-500" : ""}`}>
                <option value="">Select Practice Type</option>
                <option value="Ayush">Ayush</option>
                <option value="Allopathy">Allopathy</option>
              </select>
              {errors.practiceType && <p className="text-red-500 text-xs">{errors.practiceType}</p>}
            </div>
            <div className="relative">
              <div onClick={() => setShowSpecializationDropdown(!showSpecializationDropdown)} className="flex items-center border border-gray-300 rounded-lg p-2 pr-3 cursor-pointer">
                {formData.roleSpecificData.specialization || "Select Specialization"}
              </div>
              {showSpecializationDropdown && (
                <div className="absolute z-10 bg-white rounded mt-1 shadow max-h-40 overflow-y-auto w-full">
                  {formData.roleSpecificData.practiceType ? (
                    (specializationList[formData.roleSpecificData.practiceType] || []).map((spec) => (
                      <label key={spec} className="flex items-center p-2 hover:bg-gray-100">
                        <input
                          type="radio"
                          name="specialization"
                          value={spec}
                          checked={formData.roleSpecificData.specialization === spec}
                          onChange={(e) => {
                            handleInputChange(e);
                            setShowSpecializationDropdown(false);
                          }}
                          className="mr-2"
                        />
                        {spec}
                      </label>
                    ))
                  ) : (
                    <p className="p-2 text-gray-500 text-sm">Please select a practice type first.</p>
                  )}
                </div>
              )}
              {errors.specialization && <p className="text-red-500 text-xs">{errors.specialization}</p>}
            </div>
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {renderInput("qualification", "text", "Qualification")}
            {renderInput("location", "text", "Location")}
            <div className="relative flex flex-col gap-2">
              <label className="flex items-center border border-gray-300 rounded-lg p-2 pr-3 shadow-sm cursor-pointer overflow-hidden">
                <AiOutlineCamera className="text-xl text-gray-500 mr-2" />
                <span className="flex-1 truncate text-gray-700">{formData.documents.length > 0 ? `${formData.documents.length} Document(s) Uploaded` : 'Upload Document(s)'}</span>
                <input type="file" accept=".pdf, .doc, .docx, image/*" name="documents" onChange={handleFileChange} className="hidden" multiple />
              </label>
              {renderUploadedDocuments()}
              {errors.documents && <p className="text-xs text-red-500">{errors.documents}</p>}
            </div>
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Doctor Type</label>
              <select name="doctorType" value={formData.roleSpecificData.doctorType} onChange={handleInputChange} className={`${inputStyle} ${errors.doctorType ? "border-red-500" : ""}`}>
                <option value="">Select</option>
                <option value="freelancer">Freelancer</option>
                <option value="hospital">Hospital Associated Doctor</option>
              </select>
              {errors.doctorType && <p className="text-red-500 text-xs">{errors.doctorType}</p>}
            </div>
            {formData.roleSpecificData.doctorType === "hospital" && (
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Enter Hospital Names</label>
                <input
                  type="text"
                  name="hospitalNames"
                  onChange={(e) => {
                    const value = e.target.value;
                    const hospitalArray = value.split(',').map(h => h.trim()).filter(Boolean);
                    setFormData({
                      ...formData,
                      roleSpecificData: {
                        ...formData.roleSpecificData,
                        hospitalNames: hospitalArray,
                      },
                    });
                  }}
                  className={`${inputStyle} ${errors.hospitalNames ? "border-red-500" : ""}`}
                />
                {errors.hospitalNames && <p className="text-red-500 text-xs">{errors.hospitalNames}</p>}
              </div>
            )}
          </div>
    
          {/* Modal Preview for Uploaded Documents */}
          {isModalOpen && previewDoc && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg w-full max-w-2xl relative">
                <button
                  className="absolute top-2 right-2 text-red-500 text-2xl"
                  onClick={() => {
                    setIsModalOpen(false);
                    setPreviewDoc(null);
                  }}
                >
                  &times;
                </button>
                <h2 className="text-lg font-semibold mb-4">Document Preview</h2>
                {previewDoc.type.startsWith("image/") ? (
                  <img src={URL.createObjectURL(previewDoc)} alt="Document Preview" className="max-h-[500px] w-full object-contain" />
                ) : previewDoc.type === "application/pdf" ? (
                  <iframe src={URL.createObjectURL(previewDoc)} className="w-full h-[500px]" title="PDF Preview"></iframe>
                ) : (
                  <p className="text-gray-600">Preview not available for this file type.</p>
                )}
              </div>
            </div>
          )}
        </>
      );
    }
    if (userType === "lab") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <select name="diagnosticCenterType" value={formData.roleSpecificData.diagnosticCenterType} onChange={handleInputChange} className={inputStyle}>
                <option value="">Select Diagnostic Center Type</option>
                <option>Pathology Lab</option>
                <option>Diagnostic Center</option>
                <option>Radiology Lab</option>
                <option>Microbiology Lab</option>
                <option>Other</option>
              </select>
            </div>
            {renderInput("diagnosticCenterName", "text", "Diagnostic Center Name")}
            {renderInput("registrationNumber", "text", "Registration Number")}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderInput("ownerName", "text", "Owner's Full Name")}
            {renderInput("licenseNumber", "text", "License Number")}
            {renderInput("location", "text", "Location")}
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-6 mb-5">
              <div className="md:w-1/2">
                <label className="font-semibold block mb-2">Available Tests</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48">
                  {testOptions.map((test) => (
                    <label key={test} className="flex items-center">
                      <input type="checkbox" value={test} checked={formData.roleSpecificData.availableTests.includes(test)} onChange={(e) => {
                        const tests = e.target.checked ? [...formData.roleSpecificData.availableTests, test] : formData.roleSpecificData.availableTests.filter((t) => t !== test);
                        setFormData(prev => ({ ...prev, roleSpecificData: { ...prev.roleSpecificData, availableTests: tests } }));
                      }} className="mr-2" />
                      {test}
                    </label>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2">
                <label className="font-semibold block mb-2">Special Services</label>
                <div className="space-y-2 max-h-48">
                  {specialServicesOptions.map((service) => (
                    <label key={service} className="flex items-center">
                      <input type="checkbox" value={service} checked={formData.roleSpecificData.specialServices.includes(service)} onChange={(e) => {
                        const services = e.target.checked ? [...formData.roleSpecificData.specialServices, service] : formData.roleSpecificData.specialServices.filter((s) => s !== service);
                        setFormData(prev => ({ ...prev, roleSpecificData: { ...prev.roleSpecificData, specialServices: services } }));
                      }} className="mr-2" />
                      {service}
                    </label>
                  ))}
                </div>
                <input type="text" name="otherSpecialService" value={formData.roleSpecificData.otherSpecialService} onChange={handleInputChange} className={"border-b border-b gray-300 mt-4"} placeholder="Specify if any" />
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#f5f9fc] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-white/70 backdrop-blur-xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/30 rounded-xl">
        <h2 className="text-3xl font-bold text-center text-[#0e1630] drop-shadow mb-1">Register as {userType}</h2>
        <p className="text-xs text-center text-[#0e1630] mb-6">Please fill in your details to create an account.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderInput("firstName", "text", "First Name")}
            {renderInput("middleName", "text", "Middle Name")}
            {renderInput("lastName", "text", "Last Name")}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderInput("phone", "text", "Phone Number")}
            {renderInput("aadhaar", "text", "Aadhaar Number (XXXX-XXXX-XXXX)")}
            <div>
              <select name="gender" value={formData.gender} onChange={handleInputChange} className={inputStyle + (errors.gender ? " border-red-500" : "")}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderInput("dob", "date", "Date of Birth")}
            {renderInput("email", "email", "Email")}
            <div className="relative flex flex-col gap-2">
              <label className="flex items-center border border-gray-300 rounded-lg p-2 pr-3 bg-white shadow-sm cursor-pointer overflow-hidden">
                <AiOutlineCamera className="text-xl text-gray-500 mr-2" />
                <span className="flex-1 truncate text-gray-700">{formData.photo ? formData.photo.name : 'Upload Photo'}</span>
                <input type="file" accept="image/*" name="photo" onChange={handleFileChange} className="hidden" />
                {formData.photo && <button type="button" onClick={() => setIsModalOpen(true)} className="text-sm text-blue-600 flex items-center gap-1 w-fit mt-1"><FiEye /></button>}
              </label>
              {errors.photo && <p className="text-xs text-red-500">{errors.photo}</p>}
            </div>
          </div>
          {renderFieldsBasedOnRole()}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="relative">
              <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Create Password" onChange={handleInputChange} className="input pr-10 border border-gray-300 rounded-lg p-2 w-full" />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute top-3 right-3 cursor-pointer text-gray-700">{showPassword ? <FiEyeOff /> : <FiEye />}</span>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            <div className="relative">
              <input name="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" onChange={handleInputChange} className="input pr-10 border border-gray-300 rounded-lg p-2 w-full" />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute top-3 right-3 cursor-pointer text-gray-700">{showPassword ? <FiEyeOff /> : <FiEye />}</span>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>
          <label className="flex items-center mt-4">
            <input type="checkbox" name="agreeDeclaration" checked={formData.roleSpecificData.agreeDeclaration} onChange={handleInputChange} className="mr-2" />
            I agree to the declaration
          </label>
          {errors.agreeDeclaration && <p className="text-red-500 text-xs">{errors.agreeDeclaration}</p>}
          <div className="flex justify-center mt-6">
            <button type="submit" disabled={isSubmitting} className="bg-[#0e1630] hover:bg-[#01D48C] text-white py-3 px-8 rounded-lg shadow-lg w-full md:w-auto transition">{isSubmitting ? "Submitting..." : "Verify & Proceed"}</button>
          </div>
          <div className="text-center mt-4 text-[#0e1630]">
            <p>Already have an account? <button type="button" onClick={() => navigate("/login")} className="text-[#01D48C] font-semibold">Login Here</button></p>
          </div>
          {isModalOpen && photoPreview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded shadow-lg relative">
                <img src={photoPreview} alt="Preview" className="max-h-[80vh] max-w-full" />
                <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 text-xl text-red-600">&times;</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;