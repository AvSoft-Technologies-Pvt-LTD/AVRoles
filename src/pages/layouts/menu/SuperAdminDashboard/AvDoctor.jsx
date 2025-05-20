

import React, { useState } from 'react';

const DoctorManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [viewDoctor, setViewDoctor] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '', phone: '', aadhaar: '',
    registrationNo: '', gender: '', doctorType: '', specializationType: '',
    ayushSpecializations: [], qualification: '', documentType: '', file: null,
    location: '', password: '', confirmPassword: ''
  });

  const ayushOptions = ['Ayurveda', 'Homeopathy', 'Unani', 'Siddha', 'Yoga & Naturopathy'];

  const handleChange = ({ target: { name, value, type, checked } }) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ayushSpecializations'
        ? (checked ? [...prev.ayushSpecializations, value] : prev.ayushSpecializations.filter(i => i !== value))
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords do not match");
    const newDoctor = {
      ...formData,
      specialization: formData.doctorType === 'Allopathy' 
        ? formData.specializationType 
        : formData.ayushSpecializations.join(', '),
    };
    setDoctors(prev => [...prev, newDoctor]);
    setShowModal(false);
    setFormData({ firstName: '', middleName: '', lastName: '', phone: '', aadhaar: '', registrationNo: '', gender: '', doctorType: '', specializationType: '', ayushSpecializations: [], qualification: '', documentType: '', file: null, location: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="pt-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-8">Doctor Management</h1>
<div className="flex justify-end">
  <button
    onClick={() => setShowModal(true)}
    className="mb-6 inline-block bg-slate-900 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-md shadow-md transition"
  >
    + Add Doctor
  </button>
</div>
      <div className="overflow-x-auto border  shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-800">
            <tr>{['Name', 'Phone', 'Doctor Type', 'Specialization', 'Qualification', 'Location', 'Actions'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {doctors.length ? doctors.map((doc, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{doc.firstName} {doc.lastName}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{doc.phone}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{doc.doctorType}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{doc.specialization}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{doc.qualification}</td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{doc.location}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <button onClick={() => setViewDoctor(doc)} className="px-4 py-1 border border-yellow-400 text-yellow-400 font-semibold bg-transparent">View </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="text-center py-10 text-gray-400 italic">No doctors added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Register Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2">
          <div className=" bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto p-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Register New Doctor</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                {['firstName', 'middleName', 'lastName'].map(name => (
                  <input key={name} name={name} placeholder={name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} className="border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-slate-500 focus:outline-none" onChange={handleChange} value={formData[name]} required={['firstName', 'lastName'].includes(name)} />
                ))}
              </div>
              <input name="phone" placeholder="Phone Number" className="border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-slate-500 focus:outline-none" onChange={handleChange} value={formData.phone} required />
              <input name="aadhaar" placeholder="Aadhaar Number" className="border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-slate-500 focus:outline-none" onChange={handleChange} value={formData.aadhaar} />
              <input name="registrationNo" placeholder="Registration No" className="border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-slate-500 focus:outline-none" onChange={handleChange} value={formData.registrationNo} />
              <select name="gender" className="border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-slate-500 focus:outline-none" onChange={handleChange} value={formData.gender} required>
                <option value="" disabled>Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <select name="doctorType" className="border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-slate-500 focus:outline-none" onChange={handleChange} value={formData.doctorType} required>
                <option value="" disabled>Doctor Type</option>
                <option>Allopathy</option>
                <option>Ayush</option>
              </select>
              {formData.doctorType === 'Allopathy' && (
                <select name="specializationType" className="border border-gray-300 rounded px-3 py-2 col-span-2 focus:ring-1 focus:ring-slate-500 focus:outline-none" onChange={handleChange} value={formData.specializationType} required>
                  <option value="" disabled>Select Specialization</option>
                  <option>Cardiology</option>
                  <option>Gynecology</option>
                  <option>Dermatology</option>
                  <option>Pediatrics</option>
                  <option>Orthopedics</option>
                  <option>Neurology</option>
                  <option>General Physician</option>
                </select>
              )}
              {formData.doctorType === 'Ayush' && (
                <div className="col-span-2">
                  <label className="block mb-1 font-medium text-gray-700">Ayush Specializations:</label>
                  <div className="flex flex-wrap gap-2">
                    {ayushOptions.map(opt => (
                      <label key={opt} className="flex items-center space-x-1 cursor-pointer text-gray-700">
                        <input type="checkbox" name="ayushSpecializations" value={opt} checked={formData.ayushSpecializations.includes(opt)} onChange={handleChange} className="form-checkbox h-4 w-4 text-slate-600" />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <input name="qualification" placeholder="Highest Qualification" className="border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-slate-500 focus:outline-none" onChange={handleChange} value={formData.qualification} required />
              <select name="documentType" className="border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-slate-500 focus:outline-none" onChange={handleChange} value={formData.documentType} required>
                <option value="" disabled>Select Document Type</option>
                <option>Medical Degree Certificate</option>
                <option>Medical Registration Certificate</option>
                <option>Government ID Proof</option>
                <option>Experience Certificate</option>
              </select>
              <input type="file" className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-slate-500 focus:outline-none" onChange={e => setFormData(prev => ({ ...prev, file: e.target.files[0] }))} accept="application/pdf,image/*" required />
              <input name="location" placeholder="Location" className="border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-slate-500 focus:outline-none" onChange={handleChange} value={formData.location} required />
              <input name="password" type="password" placeholder="Create Password" className="border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-slate-500 focus:outline-none" onChange={handleChange} value={formData.password} required />
              <input name="confirmPassword" type="password" placeholder="Confirm Password" className="border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-slate-500 focus:outline-none" onChange={handleChange} value={formData.confirmPassword} required />
              <div className="col-span-2 flex justify-end space-x-3 mt-4">
                                <button type="submit" className="bg-slate-900 hover:bg-slate-700 text-white px-4 py-1.5 rounded text-sm">Submit</button>

                <button type="button" onClick={() => setShowModal(false)} className="bg-yellow-300 hover:bg-yellow-400 px-4 py-1.5 rounded text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {viewDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 overflow-y-auto max-h-[95vh]">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-700">{viewDoctor.firstName?.[0] || ""}</div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-700">{[viewDoctor.firstName, viewDoctor.middleName, viewDoctor.lastName].filter(Boolean).join(" ")}</h2>
                  <div className="text-gray-500 text-sm">{viewDoctor.doctorType} Doctor</div>
                </div>
              </div>
              <button onClick={() => setViewDoctor(null)} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Details</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><strong>Phone:</strong> {viewDoctor.phone}</li>
                  <li><strong>Aadhaar:</strong> {viewDoctor.aadhaar}</li>
                  <li><strong>Registration No.:</strong> {viewDoctor.registrationNo}</li>
                  <li><strong>Gender:</strong> {viewDoctor.gender}</li>
                  <li><strong>Specialization:</strong> {viewDoctor.doctorType === "Ayush" ? (viewDoctor.ayushSpecializations || []).join(", ") : viewDoctor.specializationType}</li>
                  <li><strong>Qualification:</strong> {viewDoctor.qualification}</li>
                  <li><strong>Location:</strong> {viewDoctor.location}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Verification Document</h3>
                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="mb-2"><strong>Document Type:</strong> {viewDoctor.documentType}</div>
                  <div><strong>Uploaded Document:</strong><br />
                    {viewDoctor.file ? (
                      <a href={URL.createObjectURL(viewDoctor.file)} target="_blank" rel="noopener noreferrer" className="text-slate-600 underline mt-1 inline-block">Click to view document</a>
                    ) : (
                      <span className="text-gray-400">No document uploaded</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
           
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;


