import React, { useEffect, useState } from "react";
import axios from "axios";

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-end z-50 pr-[18%]">

    <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl min-w-[300px] max-h-[80vh] overflow-y-auto relative">
      {children}
    </div>
  </div>
);

const statusColor = {
  approved: "text-green-400",
  pending: "text-yellow-400",
  rejected: "text-red-400",
};

const LabTable = () => {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [filter, setFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page
  useEffect(() => {
    axios.get("https://mocki.io/v1/00d6ce96-c961-491c-9cfe-01cb3b9a30a9")
      .then(res => setLabs(res.data))
      .catch(console.error);
  }, []);

  const handleApprove = () => {
    setLabs(prev => prev.map(lab =>
      lab.centerName === selectedLab.centerName ? { ...lab, status: "approved" } : lab
    ));
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      setSelectedLab(null);
    }, 2000);
  };

  const confirmReject = () => {
    setLabs(prev => prev.map(lab =>
      lab.centerName === selectedLab.centerName
        ? { ...lab, status: "rejected", rejectionReason, rejectionDate: new Date().toLocaleDateString() }
        : lab
    ));
    setShowRejectModal(false);
    setSelectedLab(null);
    setRejectionReason("");
  };

  const handleEdit = () => {
    setLabs(prev => prev.map(lab => lab.labId === selectedLab.labId ? { ...selectedLab } : lab));
    setShowEditModal(false);
    setSelectedLab(null);
  };

  const handleChange = (field, e) => {
    setSelectedLab(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleDelete = () => {
    setLabs(prev => prev.filter(lab => lab.centerName !== selectedLab.centerName));
    setDeleteConfirm(false);
    setSelectedLab(null);
  };


  const filteredLabs = labs
    .filter((lab) => filter === "all" || lab.status === filter)
    .filter((lab) =>
      (lab.centerName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (lab.ownerName?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );
  // Calculate total pages
  const totalPages = Math.ceil(filteredLabs.length / itemsPerPage);
  // Get current labs for the current page
  const currentLabs = filteredLabs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-4 overflow-x-auto">
  <h2 className="text-2xl font-bold mb-4">Labs List</h2> {/* Enhanced heading */}
  <div className="flex gap-3 mb-4">
    <input
      type="text"
      placeholder="Search by lab or owner name..."
      className="border px-3 py-2 rounded w-64"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <select
      className="border rounded px-3 py-2 w-40"
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
    >
      {["all", "pending", "approved", "rejected"].map((f) => (
        <option key={f} value={f}>
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </option>
      ))}
    </select>
  </div>

      <table className="min-w-full bg-white shadow rounded-lg border">
        <thead className="bg-slate-900 text-white">
          <tr>
            <th className="p-3 text-left">Lab Id</th>
            <th className="p-3 text-left">Lab Name</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredLabs.map((lab, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="p-3">{lab.labId}</td>
              <td className="p-3">{lab.centerName}</td>
              <td className="p-3">{lab.centerType}</td>
              <td className="p-3">{lab.location}</td>
              <td className="p-3"><span className={statusColor[lab.status]}>{lab.status}</span></td>
            <td className="space-x-2">
  <button
    onClick={() => {
      setSelectedLab(lab);
      setShowViewModal(true);
    }}
    className="border-2 border-yellow-500 text-yellow-500 px-2 py-1 rounded"
  >
    View
  </button>

  {lab.status !== "pending" && (
    <>
      <button
        onClick={() => {
          setSelectedLab(lab);
          setShowEditModal(true);
        }}
        className="border-2 border-black-500 text-black-500 px-2 py-1 rounded"
      >
        Edit
      </button>

      <button
        onClick={() => {
          setSelectedLab(lab);
          setDeleteConfirm(true);
        }}
        className="border-2 border-red-500 text-red-500 px-2 py-1 rounded"
      >
        Delete
      </button>
    </>
  )}
</td>

            </tr>
          ))}
        </tbody>
      </table>
{/* Pagination Controls */}
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
      {/* View Modal */}
      {selectedLab && showViewModal && (
        <Modal onClose={() => setShowViewModal(false)}>
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-end p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mr-[10%] p-8 max-h-[90vh] overflow-y-auto relative">
              <button onClick={() => setShowViewModal(false)} className="absolute top-5 right-5 text-2xl">✕</button>
              <h2 className="text-3xl font-bold text-yellow-500 border-b pb-3 mb-3">Lab Full Details</h2>

              <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-base">
                  <p><b>Lab Name:</b> {selectedLab.centerName}</p>
                  <p><b>Owner:</b> {selectedLab.ownerName}</p>
                  <p><b>Phone:</b> {selectedLab.phoneNumber}</p>
                  <p><b>Email:</b> {selectedLab.email}</p>
                  <p><b>Type:</b> {selectedLab.centerType}</p>
                  <p><b>Location:</b> {selectedLab.location}</p>
                  <p><b>GST Number:</b> {selectedLab.gstNumber}</p>
                  <p><b>Registration Number:</b> {selectedLab.registrationNumber}</p>
                  <p><b>License Number:</b> {selectedLab.licenseNumber}</p>
                </div>
              </section>

              <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Services</h3>
                <p><b>Available Tests:</b> {selectedLab.availableTests?.join(", ")}</p>
                <p><b>Special Services:</b> {selectedLab.specialServices?.join(", ")}</p>
              </section>

              <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedLab.certificates && Object.entries(selectedLab.certificates).map(([key, value], i) => (
                    <div key={i} className="border rounded-lg p-3 bg-white shadow truncate">
                      <p> {value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Status</h3>
                <p><span className={`px-2 py-1 rounded text-xs ${statusColor[selectedLab.status]}`}>{selectedLab.status}</span></p>
                {selectedLab.rejectionReason && (
                  <div className="bg-red-50 p-4 mt-2 text-red-700">
                    <p><b>Reason:</b> {selectedLab.rejectionReason}</p>
                    <p><b>Date:</b> {selectedLab.rejectionDate}</p>
                  </div>
                )}
              </section>

              {selectedLab.status === "pending" && (
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <button onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white px-7 py-2 rounded-lg">Approve</button>
                  <button onClick={() => setShowRejectModal(true)} className="bg-red-600 hover:bg-red-700 text-white px-7 py-2 rounded-lg">Reject</button>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

{selectedLab && showEditModal && (
  <Modal onClose={() => setShowEditModal(false)}>
    <form onSubmit={handleEdit} className="space-y-6 p-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Lab Details</h3>

      {/* Basic Info + Available Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
        {[
          { label: "Lab Name", field: "centerName", type: "text" },
          { label: "Owner Name", field: "ownerName", type: "text" },
          { label: "Phone Number", field: "phoneNumber", type: "text" },
          { label: "Email", field: "email", type: "email" },
          { label: "Center Type", field: "centerType", type: "text" },
          { label: "Location", field: "location", type: "text" },
          { label: "GST Number", field: "gstNumber", type: "text" },
          { label: "Registration Number", field: "registrationNumber", type: "text" },
          { label: "License Number", field: "licenseNumber", type: "text" },
        ].map(({ label, field, type }) => (
          <div key={field}>
            <label className="block mb-1 text-gray-700">{label}</label>
            <input
              type={type}
              value={selectedLab[field]}
              onChange={e => handleChange(field, e)}
              placeholder={label}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 focus:outline-none"
            />
          </div>
        ))}

        {/* Available Tests beside License Number */}
        <div>
          <label className="block mb-1 text-gray-700">Available Tests</label>
          <select
            onChange={e => handleDropdownSelect('availableTests', e)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 focus:outline-none"
          >
            <option value="">Add Test</option>
            {["Blood Test", "X-Ray", "MRI", "CT Scan"].map((test, idx) => (
              <option key={idx} value={test}>{test}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Special Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
        <div>
          <label className="block mb-1 text-gray-700">Special Services</label>
          <select
            onChange={e => handleDropdownSelect('specialServices', e)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 focus:outline-none"
          >
            <option value="">Add Service</option>
            {["Home Sample Collection", "Emergency Test", "24x7 Support", "Online Reports"].map((service, idx) => (
              <option key={idx} value={service}>{service}</option>
            ))}
          </select>
        </div>
      </div>

    

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => setShowEditModal(false)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-xl transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-xl transition"
        >
          Save Changes
        </button>
      </div>
    </form>
  </Modal>
)}





      {/* Approve Success Modal */}
      {showModal && (
        <Modal>
          <div className="text-center">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-2xl font-semibold text-green-700 mb-2">Lab Approved!</h3>
            <p className="text-gray-700">The lab has been successfully approved.</p>
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedLab && (
        <Modal>
          <h3 className="text-lg font-semibold mb-4">Reject {selectedLab.centerName}</h3>
          <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Enter reason" className="w-full border p-2 rounded mb-3" rows={4} />
          {!rejectionReason.trim() && <p className="text-red-600 mb-3">Reason is required</p>}
          <div className="flex justify-end gap-4">
            <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button onClick={confirmReject} className="px-4 py-2 bg-yellow-400 rounded" disabled={!rejectionReason.trim()}>Submit</button>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteConfirm && selectedLab && (
        <Modal>
          <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
          <p className="mb-4">Are you sure you want to delete <strong>{selectedLab.centerName}</strong>?</p>
          <div className="flex justify-end gap-4">
            <button onClick={() => { setDeleteConfirm(false); setSelectedLab(null); }} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">Yes, Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LabTable;
