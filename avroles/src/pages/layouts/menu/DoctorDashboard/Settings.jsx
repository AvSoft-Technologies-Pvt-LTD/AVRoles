import React, { useState, useRef } from "react";
import { Camera, Save } from "lucide-react";

const formFields = {
  Personal: ["firstName", "lastName", "phone", "email", "dob"],
  Professional: ["qualification", "specialization", "experience", "licenseNo"],
  Address: ["address", "city", "state", "pincode"],
  Security: ["currentPassword", "newPassword", "confirmPassword"],
};

const mockUserData = {
  firstName: "Sheetal",
  lastName: "Shelke",
  phone: "9876543210",
  email: "john@example.com",
  dob: "1990-01-01",
  qualification: "MBBS",
  specialization: "Neurology",
  experience: "10",
  licenseNo: "12345-67890",
  address: "Dharwad, Karnataka",
  city: "Dharwad",
  state: "Kanataka",
  pincode: "558001",
};

const DoctorProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("Personal");
  const [formData, setFormData] = useState(mockUserData);
  const [avatar, setAvatar] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setHasUnsavedChanges(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasUnsavedChanges(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[var(--primary-color)]">Doctor Profile Settings</h2>
      {/* Avatar Upload */}
      <div className="relative group w-fit mx-auto mb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-[var(--color-surface)] shadow-lg transition duration-300 transform group-hover:scale-105">
          <img
            src={avatar || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        {isEditMode && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-10 h-10 bg-[var(--primary-color)] rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-110 transition-all duration-300"
          >
            <Camera size={18} className="text-[var(--color-surface)]" />
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </div>
        )}
      </div>
      {/* Tabs */}
      <div className="relative flex justify-center mb-6 gap-3 flex-wrap">
        {Object.keys(formFields).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 py-2 rounded-full font-semibold tracking-wide transition-all duration-300 ease-in-out overflow-hidden ${
              activeTab === tab
                ? "bg-[var(--primary-color)] text-white shadow-md scale-105 animate-tab-pop"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
            }`}
          >
            <span className="relative z-10">{tab}</span>
            {activeTab === tab && (
              <span className="absolute inset-0 bg-[var(--primary-color)] opacity-10 rounded-full blur-md"></span>
            )}
          </button>
        ))}
      </div>
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        key={activeTab}
        className="space-y-4 transition-all duration-500 animate-fade-in-up"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {formFields[activeTab].map((field, index) => (
            <div
              key={field}
              style={{ animationDelay: `${index * 0.05}s` }}
              className="animate-fade-in-up"
            >
              <div className="floating-input relative" data-placeholder={field.replace(/([A-Z])/g, " $1")}>
                <input
                  type={field.toLowerCase().includes("password") ? "password" : "text"}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="input-field peer"
                  placeholder=" "
                  autoComplete="off"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-6 py-2 rounded-xl text-sm border border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white transition-transform duration-300 ${
              isEditMode ? "hover:scale-105" : "hover:scale-110"
            }`}
          >
            {isEditMode ? "Cancel" : "Edit"}
          </button>
          <button
            type="submit"
            disabled={!hasUnsavedChanges || isSaving}
            className={`px-6 py-2.5 rounded-xl flex items-center gap-2 transition duration-300 transform ${
              !hasUnsavedChanges || isSaving
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[var(--primary-color)] text-white hover:-translate-y-1 hover:shadow-xl pulse"
            }`}
          >
            {isSaving ? (
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Save size={18} />
            )}
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </form>
      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-[var(--primary-color)] text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-toast z-20">
          <Save size={18} />
          <span>Profile updated successfully!</span>
        </div>
      )}
    </div>
  );
};

export default DoctorProfileSettings;