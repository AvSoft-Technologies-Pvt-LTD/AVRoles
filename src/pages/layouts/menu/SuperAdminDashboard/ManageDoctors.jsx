


import React, { useEffect, useState } from "react";
import axios from "axios";

const Modal = ({ children }) => <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"><div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl min-w-[350px] max-h-[80vh] overflow-y-auto relative">{children}</div></div>;
const statusColor = { approved: "text-green-400", pending: "text-yellow-400", rejected: "text-red-400" };

const DoctorTable = () => {
   const itemsPerPage = 5;const [currentPage, setCurrentPage] = useState(1);const [doctors, setDoctors] = useState([]), [selectedDoctor, setSelectedDoctor] = useState(null), [filter, setFilter] = useState("all"), [searchQuery, setSearchQuery] = useState(""), [showModal, setShowModal] = useState(false), [deleteConfirm, setDeleteConfirm] = useState(false), [showRejectModal, setShowRejectModal] = useState(false), [rejectionReason, setRejectionReason] = useState(""), [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => { axios.get("https://mocki.io/v1/e3c8154d-f562-40cc-81e7-be6d74695d06").then(res => setDoctors(res.data)).catch(console.error); }, []);

  const handleApprove = () => { setDoctors(prev => prev.map(doc => doc.id === selectedDoctor.id ? { ...doc, status: "approved" } : doc)); setShowModal(true); setTimeout(() => { setShowModal(false); setSelectedDoctor(null); }, 2000); };
  const confirmReject = () => { setDoctors(prev => prev.map(doc => doc.id === selectedDoctor.id ? { ...doc, status: "rejected", rejectionReason, rejectionDate: new Date().toLocaleDateString() } : doc)); setShowRejectModal(false); setSelectedDoctor(null); setRejectionReason(""); };
  const handleDelete = () => { setDoctors(prev => prev.filter(doc => doc.id !== selectedDoctor.id)); setDeleteConfirm(false); setSelectedDoctor(null); };
  const handleEdit = (e) => { e.preventDefault(); setDoctors(prev => prev.map(doc => doc.id === selectedDoctor.id ? selectedDoctor : doc)); setShowEditModal(false); setSelectedDoctor(null); };
// Calculate paginated data
 const filteredDoctors = doctors.filter(doc => {
    const matchesFilter = filter === "all" || doc.status === filter;
    const matchesSearch = doc.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Freelancer Doctor List</h2>
      <div className="flex gap-3 mb-4">
        <input type="text" placeholder="Search..." className="border px-3 py-2 rounded w-64" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        <select className="border px-3 py-2 w-40 rounded" value={filter} onChange={e => setFilter(e.target.value)}>{["all", "pending", "approved", "rejected"].map(f => <option key={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}</select>
      </div>
      <table className="min-w-full bg-white shadow rounded-lg border">
        <thead className="bg-slate-900 text-white"><tr>{["Dr ID", "Name", "Phone", "Type", "Specialization", "Location", "Status", "Action"].map((h, i) => <th key={i} className="p-3 text-left">{h}</th>)}</tr></thead>
        <tbody>
          {filteredDoctors.map(doc => (
            <tr key={doc.id} className="hover:bg-gray-50">
              <td className="p-3">{doc.id}</td>
              <td className="p-3">{`${doc.firstName} ${doc.middleName} ${doc.lastName}`}</td>
              <td className="p-3">{doc.phone}</td>
              <td className="p-3">{doc.doctorType}</td>
              <td className="p-3">{doc.specializationType}</td>
              <td className="p-3">{doc.location}</td>
              <td className="p-3"><span className={statusColor[doc.status]}>{doc.status}</span></td>
              <td className="p-3 space-x-1">
                <button onClick={() => { setSelectedDoctor(doc); setShowEditModal(false); }} className="border text-yellow-500 px-2 py-1 rounded">View</button>
                {doc.status !== "pending" && <>
                  <button onClick={() => { setSelectedDoctor(doc); setShowEditModal(true); }} className="border text-black px-2 py-1 rounded">Edit</button>
                  <button onClick={() => { setSelectedDoctor(doc); setDeleteConfirm(true); }} className="border text-red-500 px-2 py-1 rounded">Delete</button>
                </>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
 {/* Pagination Controls */}
    <div className="flex justify-end items-center mt-4">
  <div className="flex items-center gap-2">
    <button
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
    >
      Previous
    </button>
    <span>Page {currentPage} of {totalPages}</span>
    <button
      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
</div>

           {selectedDoctor && !deleteConfirm && !showEditModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mr-[10%] p-8 max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => {
              setSelectedDoctor(null); // Close the modal
              setShowEditModal(false); // Ensure edit modal is closed if it was open
            }} className="absolute top-5 right-5 text-2xl">✕</button>
            <h2 className="text-3xl font-extrabold text-yellow-500 border-b pb-3 mb-3">Doctor Full Details</h2>
            {/* Personal Info */}
            <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-base">
                <p><b>ID:</b> {selectedDoctor.id}</p>
                <p><b>Name:</b> {`${selectedDoctor.firstName} ${selectedDoctor.middleName} ${selectedDoctor.lastName}`}</p>
                <p><b>Phone:</b> {selectedDoctor.phone}</p>
                <p><b>Email:</b> {selectedDoctor.email}</p>
                <p><b>Gender:</b> {selectedDoctor.gender}</p>
                <p><b>Location:</b> {selectedDoctor.location}</p>
                <p><b>Aadhaar:</b> {selectedDoctor.aadhaar}</p>
              </div>
            </section>
{/* Professional Info */}
            <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Professional Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-base">
                <p><b>Doctor Type:</b> {selectedDoctor.doctorType}</p>
                <p><b>Specialization:</b> {Array.isArray(selectedDoctor.specializationType) ? selectedDoctor.specializationType.join(", ") : selectedDoctor.specializationType}</p>
                <p><b>Qualification:</b> {selectedDoctor.qualification}</p>
                <p><b>Registration No.:</b> {selectedDoctor.registrationNo}</p>
                <p><b>Associated Hospital:</b> {selectedDoctor.associatedHospital?.value === "Yes" ? selectedDoctor.associatedHospital.name : "None"}</p>
                <p><b>Associated Clinic:</b> {selectedDoctor.associatedClinic?.value === "Yes" ? selectedDoctor.associatedClinic.name : "None"}</p>
                <p><b>AYUSH Specialization:</b> {selectedDoctor.ayushSpecialization?.length > 0 ? selectedDoctor.ayushSpecialization.join(", ") : "None"}</p>
                {selectedDoctor.totalAppointments !== undefined && <p><b>Total Appointments:</b> {selectedDoctor.totalAppointments}</p>}
                {selectedDoctor.commission !== undefined && <p><b>Commission:</b> ₹{selectedDoctor.commission}</p>}
              </div>
            </section>
 {/* Documents */}
            {selectedDoctor.documents?.length > 0 && (
              <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {selectedDoctor.documents.map((doc, i) => (
                    <div key={i} className="border rounded-lg p-4 bg-white shadow hover:shadow-md cursor-pointer truncate">
                      <p className=" mb-2 flex items-center gap-2">📄 {typeof doc === "string" ? doc : doc.name || `Document ${i + 1}`}</p>
                      {typeof doc === "object" && doc.url && <a href={doc.url} target="_blank" rel="noreferrer" className="text-yellow-600 hover:text-yellow-800 underline text-xs">View Document</a>}
                    </div>
                  ))}
                </div>
              </section>
            )}
 {/* Status & Actions */}
            {(selectedDoctor.status || selectedDoctor.rejectionReason) && (
              <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Status</h3>
                {selectedDoctor.status && <p><span className={`px-2 py-1 rounded text-xs ${statusColor[selectedDoctor.status]}`}>{selectedDoctor.status}</span></p>}
                {selectedDoctor.rejectionReason && <div className="bg-red-50 p-4 mt-2 text-red-700"><p><b>Reason:</b> {selectedDoctor.rejectionReason}</p><p><b>Date:</b> {selectedDoctor.rejectionDate}</p></div>}
              </section>
            )}
 {selectedDoctor.status === "pending" && (
              <div className="flex justify-end gap-4 pt-4 border-t">
                <button onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white px-7 py-2 rounded-lg">Approve</button>
                <button onClick={() => setShowRejectModal(true)} className="bg-red-600 hover:bg-red-700 text-white px-7 py-2 rounded-lg">Reject</button>
              </div>
            )}
          </div>
        </div>
      )}

     {showEditModal && selectedDoctor && (
  <Modal onClose={() => setShowEditModal(false)}>
    <form onSubmit={handleEdit} className="space-y-6 p-4">
      <h3 className="text-xl  text-gray-800 mb-4">Edit Doctor Information</h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
 {/* Personal Info */}
        {[  { label: 'First Name', field: 'firstName' }, { label: 'Middle Name', field: 'middleName' }, { label: 'Last Name', field: 'lastName' }, { label: 'Phone', field: 'phone' }, { label: 'Email', field: 'email', type: 'email' },{ label: 'Gender', field: 'gender' }, { label: 'Location', field: 'location' },  { label: 'Aadhaar', field: 'aadhaar' }].map(({ label, field, type = 'text' }) => (
          <div key={field}>
            <label className="block text-sm  text-gray-700 mb-1">{label}</label>
            <input  type={type} name={field} value={selectedDoctor[field] || ''}  onChange={(e) => setSelectedDoctor({ ...selectedDoctor, [field]: e.target.value })} className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-yellow-500 focus:ring-yellow-500 focus:outline-none"  />
          </div>
        ))}

        {/* Professional Info */}
        {[
          { label: 'Doctor Type', field: 'doctorType' }, { label: 'Specialization (comma-separated)', field: 'specializationType', transform: (v) => v.split(',').map((s) => s.trim()), format: (v) => Array.isArray(v) ? v.join(', ') : v  },  { label: 'Qualification', field: 'qualification' }, { label: 'Registration Number', field: 'registrationNo' },  { label: 'Associated Hospital', field: 'associatedHospital',  nested: true }, { label: 'Associated Clinic',field: 'associatedClinic', nested: true },  { label: 'AYUSH Specialization', field: 'ayushSpecialization', transform: (v) => v.split(',').map((s) => s.trim()),  format: (v) => Array.isArray(v) ? v.join(', ') : v  }, {  label: 'Commission (%)',  field: 'commission',  type: 'number',  transform: (v) => parseFloat(v)  }
        ].map(({ label, field, type = 'text', transform, format, nested }) => (
          <div key={field}>
            <label className="block text-sm  text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              name={field}
              value={
                nested
                  ? selectedDoctor[field]?.name || ''
                  : format
                    ? format(selectedDoctor[field])
                    : selectedDoctor[field] || ''
              }
              onChange={(e) =>
                setSelectedDoctor((prev) => ({
                  ...prev,
                  [field]: transform
                    ? transform(e.target.value)
                    : nested
                      ? { value: e.target.value ? "Yes" : "No", name: e.target.value }
                      : e.target.value
                }))
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-yellow-500 focus:ring-yellow-500 focus:outline-none"
            />
          </div>
        ))}
      </div>
<div className="flex justify-end gap-4 pt-6">
      <button type="button" onClick={() => {setShowEditModal(false);setSelectedDoctor(null); }} className="bg-gray-200 hover:bg-gray-300 text-gray-800  px-5 py-2 rounded-xl transition">Cancel</button>
 <button type="submit"  className="bg-yellow-500 hover:bg-yellow-600 text-white  px-6 py-2 rounded-xl transition" > Save Changes </button>
      </div> </form> </Modal>)}

      {showModal && <Modal><div className="text-center"><svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg><h3 className="text-2xl text-green-700 mb-2">Doctor Approved!</h3><p>The doctor has been successfully approved.</p></div></Modal>}
      {showRejectModal && <Modal><h3 className="mb-2 font-bold">Reject {selectedDoctor.firstName}</h3><textarea rows={3} value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} placeholder="Reason" className="w-full border p-2 rounded mb-2" /><div className="flex justify-end gap-3"><button onClick={() => setShowRejectModal(false)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button><button onClick={confirmReject} disabled={!rejectionReason.trim()} className="bg-yellow-400 px-4 py-2 rounded">Submit</button></div></Modal>}
      {deleteConfirm && <Modal><h3 className="font-bold mb-2">Confirm Deletion</h3><p>Are you sure to delete <b>{selectedDoctor.firstName} {selectedDoctor.lastName}</b>?</p><div className="flex justify-end gap-4 mt-4"><button onClick={() => { setDeleteConfirm(false); setSelectedDoctor(null); }} className="bg-gray-200 px-4 py-2 rounded">Cancel</button><button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button></div></Modal>}
    </div>
  );
};

export default DoctorTable;
