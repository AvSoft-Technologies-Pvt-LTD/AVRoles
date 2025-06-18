import React, { useState, useRef, useEffect } from "react";
import { Download, Check, AlertTriangle, Edit2, Camera } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const hospitalFields = [
  { id: "hospitalName", label: "Hospital Name", type: "text" },
  { id: "email", label: "Contact Email", type: "email" },
  { id: "phone", label: "Contact Phone", type: "tel" },
  { id: "address", label: "Hospital Address", type: "text" },
  { id: "licenseNumber", label: "License Number", type: "text", readOnly: true },
  { id: "gstNumber", label: "GST Number", type: "text", readOnly: true }
];

const notificationFields = [
  { id: "notifications", label: "Enable Notifications", desc: "Receive alerts for important updates" },
  { id: "appointments", label: "Online Appointments", desc: "Allow patients to book appointments online" }
];

const initialSettings = {
  hospitalName: "City General Hospital",
  email: "contact@hospital.com",
  phone: "+1 234 567 8900",
  address: "123 Medical Center Dr",
  notifications: true,
  appointments: true,
  licenseNumber: "HOS-2024-12345",
  gstNumber: "GSTIN-2024-98765"
};

export default function Settings() {
  const fileInputRef = useRef(null);
  const [settings, setSettings] = useState(initialSettings);
  const [originalSettings, setOriginalSettings] = useState(initialSettings);
  const [changedFields, setChangedFields] = useState({});
  const [shakeFields, setShakeFields] = useState({});
  const [savePulse, setSavePulse] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fieldFocus, setFieldFocus] = useState({});
  const [fieldSuccess, setFieldSuccess] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        // Simulate loading
      } catch {
        setError("Failed to fetch settings data");
      } finally {
        setIsLoading(false);
      }
    })();
    setProfileImage("");
  }, []);

  const isEditable = (name) => isEditMode && ["hospitalName", "email", "phone", "address", "notifications", "appointments"].includes(name);

  const handleChange = ({ target: { name, value, type, checked } }) => {
    if (!isEditable(name)) return;
    setSettings((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    setChangedFields((p) => ({ ...p, [name]: true }));
    setFieldSuccess((p) => ({ ...p, [name]: true }));
    setTimeout(() => {
      setChangedFields((p) => ({ ...p, [name]: false }));
      setFieldSuccess((p) => ({ ...p, [name]: false }));
    }, 1200);
  };

  const handleFocus = (name) => setFieldFocus((p) => ({ ...p, [name]: true }));
  const handleBlur = (name) => setFieldFocus((p) => ({ ...p, [name]: false }));
  const handleShake = (name) => {
    setShakeFields((p) => ({ ...p, [name]: true }));
    setTimeout(() => setShakeFields((p) => ({ ...p, [name]: false })), 600);
  };

  const handleEdit = () => {
    setOriginalSettings(settings);
    setIsEditMode(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavePulse(true);
    setSaved(false);
    setTimeout(() => {
      setSavePulse(false);
      setSaved(true);
      toast.success("Settings updated successfully!");
      setTimeout(() => setSaved(false), 2000);
      setIsEditMode(false);
      setOriginalSettings(settings);
    }, 800);
  };

  const handleCancel = () => {
    setSettings(originalSettings);
    setSaved(false);
    setIsEditMode(false);
    toast.info("Changes cancelled.");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => e.target?.result && setProfileImage(e.target.result.toString());
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-color)]" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center"><div className="text-red-500">{error}</div></div>;

  return (
   <div className="pt-6 mt-6 bg-white p-2 md:p-6 rounded-2xl shadow-lg animate-fade-in max-w-full md:max-w-6xl mx-auto">
      <ToastContainer position="top-right" theme="colored" />
      <div className="relative mb-8">
        <div className="h-28 bg-[var(--primary-color)] rounded-3xl shadow-md overflow-hidden"></div>
        <div className="absolute top-6 left-0 right-0 px-6 flex flex-col sm:flex-row justify-between items-center">
          <h2 className="text-white text-2xl mb-4 sm:mb-0">Profile Settings</h2>
          {!isEditMode ? (
            <button onClick={handleEdit} className="btn btn-primary" aria-label="Edit Profile">
              <Edit2 size={18} className="animate-fade-in-left" />
              <span className="animate-fade-in">Edit Profile</span>
            </button>
          ) : (
            <div className="btn btn-secondary flex items-center gap-2" aria-live="polite" aria-atomic="true">
              <span className="paragraph">Editing mode</span>
              <div className="w-3 h-3 rounded-full bg-[var(--accent-color)] animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
      <div className="relative -mt-16 z-10 flex justify-center mb-8">
        <div className="relative group">
          <div className="w-22 h-22 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <Camera size={22} className="text-gray-400" />
              </div>
            )}
          </div>
          {isEditMode && (
            <div
              className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--accent-color)] rounded-full flex items-center justify-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              aria-label="Upload Profile Image"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
            >
              <Camera size={18} className="text-white" />
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </div>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mt-6 space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up">
            <h2 className="h4-heading mb-6 flex items-center animate-slide-in">
              <span className="w-2 h-8 bg-[var(--primary-color)] rounded-full mr-3 animate-pulse-gentle"></span>
              Hospital Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hospitalFields.map(({ id, label, type, readOnly }) => {
  const editable = isEditMode && !readOnly;
  const isShaking = readOnly && shakeFields[id];
  return (
    <div key={id} className="floating-input relative mb-8" data-placeholder={label}>
      <input
        type={type}
        name={id}
        id={id}
        value={settings[id]}
        onChange={editable ? handleChange : undefined}
        onFocus={() => handleFocus(id)}
        onBlur={() => handleBlur(id)}
        placeholder=" "
        disabled={!editable}
        readOnly={!editable}
        autoComplete="off"
        required
        onClick={!editable ? () => handleShake(id) : undefined}
        className={
          "peer block w-full px-3 pt-6 pb-2 text-base bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:border-[var(--accent-color)]"
          + (isShaking ? " shake-red" : "")
        }
      />
      {readOnly && <span className="alert-icon"><AlertTriangle className="w-4 h-4 text-amber-500" /></span>}
      {fieldSuccess[id] && editable && <Check className="input-success-icon" />}
      {isShaking && <div className="input-error-msg">This field is read-only and cannot be modified</div>}
      {!editable && !readOnly && shakeFields[id] && <div className="input-error-msg">This field cannot be modified</div>}
    </div>
  );
})}
            </div>
          </section>
          <section>
            <div className="bg-[#0C1325] rounded-t-lg px-4 py-2">
              <h2 className="text-white font-semibold text-lg flex items-center">Notifications</h2>
            </div>

<div className="space-y-6">
  {notificationFields.map(({ id, label, desc }) => (
    <div
      key={id}
      className="bg-white rounded-2xl p-4 hover:bg-gray-50 transition-all duration-300 hover:shadow-md hover:scale-[1.01] flex justify-between items-center animate-slide-in-right"
    >
      <div>
        <h5 className="h5-heading text-sm">{label}</h5>
        <p className="paragraph text-xs">{desc}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name={id}
          checked={settings[id]}
          onChange={isEditMode ? handleChange : undefined}
          className="sr-only peer"
          disabled={!isEditMode}
          aria-checked={settings[id]}
          aria-disabled={!isEditMode}
        />
        <div
          className={`w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary-color)]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all after:duration-300 peer-checked:bg-[var(--accent-color)] toggle-switch ${
            !isEditMode ? "opacity-60 cursor-not-allowed" : ""
          }`}
        />
      </label>
    </div>
  ))}
</div>

          </section>
        </div>
        {isEditMode && (
          <div className="mt-8 flex justify-end space-x-4 animate-slide-in-up">
            <button type="button" className="btn btn-secondary animated-cancel-btn hover:scale-105 transition-transform duration-200" onClick={handleCancel} disabled={!isEditMode}>Cancel</button>
            <button type="submit" className={`relative overflow-hidden px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 ${savePulse ? 'bg-[var(--accent-color)]' : saved ? 'bg-green-500' : 'bg-[var(--primary-color)]'} ${savePulse ? 'animate-pulse-save' : ''} ${saved ? 'animate-success-complete' : ''} hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300`} disabled={savePulse || !isEditMode}>
              <div className={`absolute inset-0 rounded-full border-2 border-white/30 ${savePulse ? 'animate-circular-progress' : 'opacity-0'}`}></div>
              <div className="relative flex items-center gap-2">
                {!savePulse && !saved && <>
                  <Download className="w-5 h-5 animate-bounce-gentle" />
                  <span>Save Changes</span>
                </>}
                {savePulse && <>
                  <Check className="w-5 h-5 animate-spin-check" />
                  <span>Saving...</span>
                </>}
                {saved && <>
                  <div className="relative">
                    <Check className="w-5 h-5 animate-check-success" />
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                  </div>
                  <span>Saved Successfully!</span>
                </>}
              </div>
              {saved && <div className="absolute inset-0 bg-white/20 rounded-full animate-ripple-success"></div>}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
