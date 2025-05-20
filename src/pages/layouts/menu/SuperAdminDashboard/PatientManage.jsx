
import React, { useState, useEffect } from 'react';
import axios from 'axios';
const editReasons = [
  "Incorrect DOB", "Update contact info", "Address mismatch",
  "Spelling mistake in name", "Occupation changed", "Incorrect Aadhaar number"
];
const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [randomReasonMap, setRandomReasonMap] = useState({}); // Moved inside the component
useEffect(() => { axios.get('https://6810972027f2fdac2411f6a5.mockapi.io/users').then(res => {const fetched = res.data;setPatients(fetched); const reasons = {}; fetched.forEach(p => {const randomIndex = Math.floor(Math.random() * editReasons.length);reasons[p.id] = editReasons[randomIndex]; }); setRandomReasonMap(reasons);setLoading(false);}).catch(() => setLoading(false)); }, []);
 const calculateAge = dob => { const b = new Date(dob), t = new Date(); let age = t.getFullYear() - b.getFullYear(); if (t.getMonth() < b.getMonth() || (t.getMonth() === b.getMonth() && t.getDate() < b.getDate())) age--; return age; };
  const fetchFullProfile = async email => {setModalData(null); setIsOpen(true); setLoadingDetails(true);const e = (email || '').toLowerCase().trim();const basic = patients.find(p => (p.email || '').toLowerCase().trim() === e); try {const [fRes, hRes, hidRes] = await Promise.all([
        axios.get('https://6808fb0f942707d722e09f1d.mockapi.io/FamilyData'),
        axios.get('https://680cc0c92ea307e081d4edda.mockapi.io/personalHealthDetails'),
        axios.get('https://6810972027f2fdac2411f6a5.mockapi.io/healthcard')
      ]);
      const family = fRes.data.filter(f => (f.email || '').toLowerCase().trim() === e);
      const health = hRes.data.find(h => (h.email || '').toLowerCase().trim() === e) || null;
      const healthIdData = hidRes.data.find(hid => (hid.email || '').toLowerCase().trim() === e);
      setModalData({ basic: { ...basic, healthId: healthIdData?.healthId || null }, family, health });
    } catch (err) { console.error(err); }
    setLoadingDetails(false);
  };
  const openEditModal = patient => {
    setEditForm({
      firstName: patient.firstName || '', lastName: patient.lastName || '', dob: patient.dob || '', gender: patient.gender || '', email: patient.email || '', phone: patient.phone || '', permanentAddress: patient.permanentAddress || '', aadhaar: patient.aadhaar || '', occupation: patient.occupation || '', id: patient.id
    }); setEditModal(true);
  };
  const closeEditModal = () => setEditModal(false);
  const handleEditChange = e => setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleEditSubmit = e => { e.preventDefault(); setPatients(prev => prev.map(p => (p.id === editForm.id ? { ...p, ...editForm } : p))); closeEditModal(); };
  const filtered = patients.filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase()) || p.phone?.includes(search));
  return <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">Manage Patients</h2>
    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or phone" className="border w-full px-3 py-2 mb-4 rounded" />
  {loading ? <p>Loading...</p> : (
        <table className="w-full border text-center">
  <thead className="bg-[#0E1630] text-white"><tr><th className="p-2">Name</th><th className="p-2">Age/Gender</th><th className="p-2">Phone</th> <th className="p-2">Address</th><th className="p-2">Edit Reason</th><th className="p-2">Allow /Reject</th> <th className="p-2">Actions</th> </tr></thead>
  <tbody>
    {filtered.map(p => (
      <tr key={p.id} className="">
        <td className="p-3">{p.firstName} {p.lastName}</td>
        <td className="p-3">{p.dob ? calculateAge(p.dob) + ' yrs' : 'N/A'} / {p.gender}</td>
        <td className="p-3 truncate max-w-[140px]">{p.phone}</td>
        <td className="p-3 max-w-[200px] break-words whitespace-pre-wrap">{p.permanentAddress}</td>
        <td className="p-3 max-w-[200px] break-words whitespace-pre-wrap">{randomReasonMap[p.id]}</td>
        <td className="p-3">
          <div className="flex justify-center gap-2 flex-wrap">
            <button onClick={() => alert('Edit allowed')} className="text-green-600 font-medium">Allow</button>
            <button onClick={() => alert('Edit rejected')} className="text-red-600 font-medium">Reject</button>
          </div>
        </td>
       <td className="p-3">
  <div className="flex justify-center items-center gap-2">
    <button
      onClick={() => fetchFullProfile(p.email)}
      className="border-2 border-yellow-400 text-sm px-3 py-1 rounded"
    >
      View
    </button>

    <button
      onClick={() => console.log('Delete clicked')}
      className="border-2 border-red-400 text-sm px-3 py-1 rounded"
    >
      Delete
    </button>
  </div>
</td>

      </tr>
    ))}
  </tbody>
</table>

      )}
    {isOpen && modalData && (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto">
          <div className="bg-white p-6 rounded-2xl w-full max-w-3xl relative mt-10 mb-10 mx-auto max-h-[90vh] overflow-y-auto shadow-lg">
            <button onClick={() => setIsOpen(false)} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-500">&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-[#0E1630]">Patient Details</h2>
            {loadingDetails ? <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0E1630]"></div></div> : (
              <div className="space-y-6">
                {modalData.basic && (
                  <div className="border p-4 rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold mb-3 text-[#0E1630] border-b pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><p><strong>Name:</strong> {modalData.basic.firstName} {modalData.basic.lastName}</p><p><strong>Gender:</strong> {modalData.basic.gender || 'N/A'}</p><p><strong>Age:</strong> {modalData.basic.dob ? calculateAge(modalData.basic.dob) + ' yrs' : 'N/A'}</p></div>
                      <div><p><strong>Email:</strong> {modalData.basic.email}</p><p><strong>Phone:</strong> {modalData.basic.phone}</p><p><strong>Address:</strong> {modalData.basic.permanentAddress}</p><p><strong>Health ID:</strong> {modalData.basic.healthId || <span className="text-red-500">Not Generated</span>}</p></div>
                    </div>
                  </div>
                )}
                {modalData.health && (
                  <div className="border p-4 rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold mb-3 text-[#0E1630] border-b pb-2">Health Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['height','weight','bloodGroup'].map((key,i) => (
                        <div key={i} className="bg-gray-50 p-3 rounded-md">
                          <span className="text-gray-500 text-sm">{key.charAt(0).toUpperCase()+key.slice(1).replace(/([A-Z])/g, ' $1')}</span><br/>
                          <span className="text-lg font-semibold">{modalData.health[key] || 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {modalData.family && modalData.family.length > 0 && (
                  <div className="border p-4 rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold mb-3 text-[#0E1630] border-b pb-2">Family Members</h3>
                    {modalData.family.map(f => (
                      <div key={f.id} className="border rounded-md p-3 mb-3">
                        <p><strong>Name:</strong> {f.name}</p><p><strong>Relationship:</strong> {f.relationship}</p><p><strong>Phone:</strong> {f.phone}</p><p><strong>Email:</strong> {f.email}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    {editModal && (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto">
          <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded-2xl w-full max-w-4xl relative mt-10 mb-10 mx-auto max-h-[90vh] overflow-y-auto shadow-lg">
            <button onClick={closeEditModal} type="button" className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-500">&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-[#0E1630]">Edit Patient</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="firstName" value={editForm.firstName || ''} onChange={handleEditChange} placeholder="First Name" required className="w-full p-3 rounded border" />
              <input type="text" name="lastName" value={editForm.lastName || ''} onChange={handleEditChange} placeholder="Last Name" required className="w-full p-3 rounded border" />
              <input type="date" name="dob" value={editForm.dob || ''} onChange={handleEditChange} required className="w-full p-3 rounded border" />
              <select name="gender" value={editForm.gender || ''} onChange={handleEditChange} required className="w-full p-3 rounded border">
                <option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
              </select>
              <input type="email" name="email" value={editForm.email || ''} onChange={handleEditChange} placeholder="Email" required className="w-full p-3 rounded border" />
              <input type="tel" name="phone" value={editForm.phone || ''} onChange={handleEditChange} placeholder="Phone" required className="w-full p-3 rounded border" />
              <input type="text" name="aadhaar" value={editForm.aadhaar || ''} readOnly placeholder="Aadhaar Number (readonly)" className="w-full p-3 rounded border bg-gray-100 cursor-not-allowed" />
              <input type="text" name="occupation" value={editForm.occupation || ''} onChange={handleEditChange} placeholder="Occupation" className="w-full p-3 rounded border" />
              <textarea name="permanentAddress" value={editForm.permanentAddress || ''} onChange={handleEditChange} placeholder="Permanent Address" required className="w-full p-3 rounded border resize-none md:col-span-2" rows={3}></textarea>
            </div>
            <div className="mt-6">
              <button type="submit" className="bg-[#0E1630] text-white px-6 py-3 rounded font-semibold hover:bg-[#0A1020] transition-colors w-full">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>;
};
export default PatientManagement;