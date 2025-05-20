import React, { useState, useCallback, useMemo } from 'react';

const HospitalComponent = () => {
  const [state, setState] = useState({
    hospitals: [
      { id: 1, name: 'Sunrise Hospital', ceo: 'Dr. Anjali Mehta', registrationNumber: 'MH-HOSP-001', phone: '9876543210', email: 'sunrise@example.com', city: 'Mumbai', state: 'Maharashtra', type: 'Private', gst: '27AABCU9603R1Z2', labInbuilt: true, labGst: '27LAB1234R1Z9', pharmacyInbuilt: false, status: 'pending', rejectionReason: '', documents: [{ name: "Registration Certificate", url: "https://example.com/doc1.pdf" }, { name: "ISO Certification", url: "https://example.com/doc3.pdf" }] },
      { id: 2, name: 'Apollo Healthcare', ceo: 'Dr. Rajiv Khanna', registrationNumber: 'DL-HOSP-202', phone: '9871234560', email: 'apollo@example.com', city: 'Delhi', state: 'Delhi', type: 'Trust', gst: '07AAACA1234R1Z8', labInbuilt: true, labGst: '07LAB5678R1Z6', pharmacyInbuilt: true, pharmacyGst: '07PHAR4567R1Z3', status: 'approved', rejectionReason: '', documents: [{ name: "Registration Certificate", url: "https://example.com/doc1.pdf" }, { name: "ISO Certification", url: "https://example.com/doc3.pdf" }] },
      { id: 3, name: 'Green Life Hospital', ceo: 'Dr. Neha Sharma', registrationNumber: 'KA-HOSP-107', phone: '9765432180', email: 'greenlife@example.com', city: 'Bangalore', state: 'Karnataka', type: 'Public', gst: '29ABCDG1234H1Z5', labInbuilt: false, pharmacyInbuilt: true, pharmacyGst: '29PHARM1234Z9R1', status: 'pending', rejectionReason: '', documents: [{ name: "Registration Certificate", url: "https://example.com/doc1.pdf" }, { name: "ISO Certification", url: "https://example.com/doc3.pdf" }] }
    ],
    filter: 'all',
    selectedHospital: null,
    showDetailModal: false,
    showRejectModal: false,
    showDeleteModal: false,
    showEditModal: false,
    rejectionReason: '',
    showSuccessPopup: false,
    searchQuery: '',
    editForm: {}
  });

  const updateState = useCallback((updates) => setState(prev => ({ ...prev, ...updates })), []);

  const filteredHospitals = useMemo(() => state.hospitals.filter(hospital => {
    const matchesFilter = state.filter === 'all' || hospital.status === state.filter;
    const matchesSearch = state.searchQuery === '' || Object.values(hospital).some(value => String(value).toLowerCase().includes(state.searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  }), [state.hospitals, state.filter, state.searchQuery]);

  const updateStatus = useCallback((id, status, reason = '') => {
    setState(prev => ({ ...prev, hospitals: prev.hospitals.map(hospital => hospital.id === id ? { ...hospital, status, rejectionReason: status === 'rejected' ? reason : '' } : hospital), showRejectModal: false, showDetailModal: false, rejectionReason: '', showSuccessPopup: status === 'approved' }));
    if (status === 'approved') setTimeout(() => updateState({ showSuccessPopup: false }), 2000);
  }, [updateState]);

  const deleteHospital = useCallback((id) => setState(prev => ({ ...prev, hospitals: prev.hospitals.filter(hospital => hospital.id !== id), showDeleteModal: false })), []);

  const handleEdit = useCallback((hospital) => updateState({ editForm: hospital, showEditModal: true, showDetailModal: false }), [updateState]);

  const handleEditSubmit = useCallback((e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, hospitals: prev.hospitals.map(hospital => hospital.id === prev.editForm.id ? { ...hospital, ...prev.editForm } : hospital), showEditModal: false, showSuccessPopup: true }));
    setTimeout(() => updateState({ showSuccessPopup: false }), 2000);
  }, [updateState]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, editForm: { ...prev.editForm, [name]: value } }));
  }, []);

  const ModalCloseButton = useCallback(({ onClose }) => (
    <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300" aria-label="Close modal">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  ), []);

  const openDetailModal = (hospital) => updateState({ selectedHospital: hospital, showDetailModal: true });
  const openRejectModal = (hospital) => updateState({ selectedHospital: hospital, showRejectModal: true });
  const openDeleteModal = (hospital) => updateState({ selectedHospital: hospital, showDeleteModal: true });

  const renderModal = (isOpen, title, children) => isOpen && (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 p-8 space-y-6 max-h-[90vh] overflow-y-auto relative">
        <ModalCloseButton onClose={() => updateState({ [title]: false })} />
        <h2 className="text-2xl font-bold text-gray-800 pr-8">{title === 'showDetailModal' ? 'Hospital Details' : title === 'showEditModal' ? 'Edit Hospital' : title === 'showRejectModal' ? 'Reject Hospital' : 'Delete Hospital'}</h2>
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-4 rounded-xl w-full max-w-7xl mx-auto m-2">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Hospitals</h2>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-64">
          <input type="text" placeholder="Search..." value={state.searchQuery} onChange={(e) => updateState({ searchQuery: e.target.value })} className="w-full border rounded-lg pl-8 pr-2 py-2 text-lg" />
          <svg className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select value={state.filter} onChange={(e) => updateState({ filter: e.target.value })} className="border rounded-lg px-3 py-2 text-lg">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {state.showSuccessPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-[300px] text-center animate-bounce-in">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-green-700 mb-2">Success!</h2>
            <p className="text-gray-600">Operation completed successfully.</p>
          </div>
        </div>
      )}

      <div className="overflow-auto border border-gray-200 rounded-lg">
        <table className="w-full text-left table-auto">
          <thead className="bg-[#0E1630] text-[#ffffff] font-semibold">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Phone No.</th>
              <th className="px-4 py-3">Registration No.</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHospitals.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-4 text-gray-600 italic">No hospitals found.</td></tr>
            ) : (
              filteredHospitals.map((hospital) => (
                <tr key={hospital.id} className="border-t ">
                  <td className="px-4 py-2">{hospital.id}</td>
                  <td className="px-4 py-2">{hospital.name}</td>
                  <td className="px-4 py-2">{hospital.city}</td>
                  <td className="px-4 py-2">{hospital.phone}</td>
                  <td className="px-4 py-2">{hospital.registrationNumber}</td>
                  <td className="px-4 py-2">
                    <span className={`font-medium ${hospital.status === 'approved' ? 'text-green-600' : hospital.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {hospital.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button onClick={() => openDetailModal(hospital)} className="border-2 border-[#F4C430] text-[#F4C430] px-2 py-1 rounded">View </button>
                    {hospital.status === 'approved' && (
                      <button onClick={() => handleEdit(hospital)} className="border-2 border-black-500 text-black-500 px-2 py-1 rounded ">Edit</button>
                    )}
                    {(hospital.status === 'approved' || hospital.status === 'rejected') && (
                      <button onClick={() => openDeleteModal(hospital)} className="border border-red-500 text-red-500 px-2 py-1 rounded ">Delete</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {renderModal(state.showDetailModal, 'showDetailModal', state.selectedHospital && (
        <>
          <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-base">
              {Object.entries({
                'Hospital Name': state.selectedHospital.name,
                'CEO Name': state.selectedHospital.ceo,
                'Registration No.': state.selectedHospital.registrationNumber,
                'Hospital Type': state.selectedHospital.type,
                'Phone': state.selectedHospital.phone,
                'Email': state.selectedHospital.email,
                'City': state.selectedHospital.city,
                'State': state.selectedHospital.state,
                'Main GST Number': state.selectedHospital.gst
              }).map(([key, value]) => (
                <p key={key} className={key === 'Main GST Number' ? 'sm:col-span-2' : ''}>
                  <span className="font-semibold">{key}:</span> {value}
                </p>
              ))}
            </div>
          </section>
          <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Inbuilt Facilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-base">
              <p><span className="font-semibold">Lab Inbuilt:</span> {state.selectedHospital.labInbuilt ? "Yes" : "No"}</p>
              {state.selectedHospital.labInbuilt && <p><span className="font-semibold">Lab GST Number:</span> {state.selectedHospital.labGst}</p>}
              <p><span className="font-semibold">Pharmacy Inbuilt:</span> {state.selectedHospital.pharmacyInbuilt ? "Yes" : "No"}</p>
              {state.selectedHospital.pharmacyInbuilt && <p><span className="font-semibold">Pharmacy GST Number:</span> {state.selectedHospital.pharmacyGst}</p>}
            </div>
          </section>
          {state.selectedHospital.documents?.length > 0 && (
            <section className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                {state.selectedHospital.documents.map((doc, i) => (
                  <div key={i} className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition-shadow cursor-pointer truncate">
                    <p className="font-medium mb-2 flex items-center gap-2"><span role="img" aria-label="document">📄</span> {doc.name || `Document ${i + 1}`}</p>
                    <a href={doc.url} target="_blank" rel="noreferrer" className="text-yellow-600 hover:text-yellow-800 underline text-xs">View Document</a>
                  </div>
                ))}
              </div>
            </section>
          )}
          {state.selectedHospital.status === 'pending' && (
            <section className="flex justify-end gap-4 pt-4 border-t border-gray-300">
              <button onClick={() => updateStatus(state.selectedHospital.id, 'approved')} className="bg-green-600 hover:bg-green-700 text-white px-7 py-2 rounded-lg font-semibold transition-colors duration-300">Approve</button>
              <button onClick={() => { updateState({ showDetailModal: false }); openRejectModal(state.selectedHospital); }} className="bg-red-600 hover:bg-red-700 text-white px-7 py-2 rounded-lg font-semibold transition-colors duration-300">Reject</button>
            </section>
          )}
        </>
      ))}

      {renderModal(state.showEditModal, 'showEditModal', (
   <form onSubmit={handleEditSubmit} className="space-y-6 p-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {Object.entries({
      name: 'Hospital Name',
      ceo: 'CEO Name',
      registrationNumber: 'Registration Number',
      type: 'Hospital Type',
      phone: 'Phone',
      email: 'Email',
      city: 'City',
      state: 'State',
      gst: 'GST Number',
      labGst: 'Lab GST Number',
      pharmacyGst: 'Pharmacy GST Number'
    }).map(([field, label]) => (
      <div key={field}>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
        <input
          type={field === 'email' ? 'email' : 'text'}
          name={field}
          value={state.editForm[field] || ''}
          onChange={handleInputChange}
          className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-yellow-500 focus:ring-yellow-500 focus:outline-none"
        />
      </div>
    ))}

    <div className="md:col-span-2 flex flex-col md:flex-row gap-6 mt-2">
      <div className="flex-1">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Lab Inbuilt</label>
        <select
          name="labInbuilt"
          value={state.editForm.labInbuilt}
          onChange={handleInputChange}
          className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-yellow-500 focus:ring-yellow-500 focus:outline-none"
        >
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Pharmacy Inbuilt</label>
        <select
          name="pharmacyInbuilt"
          value={state.editForm.pharmacyInbuilt}
          onChange={handleInputChange}
          className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-yellow-500 focus:ring-yellow-500 focus:outline-none"
        >
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </div>
    </div>
  </div>

  <div className="flex justify-end gap-4 pt-6">
    <button
      type="button"
      onClick={() => updateState({ showEditModal: false })}
      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-5 py-2 rounded-xl transition"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-6 py-2 rounded-xl transition"
    >
      Save Changes
    </button>
  </div>
</form>

      ))}

      {renderModal(state.showRejectModal, 'showRejectModal', state.selectedHospital && (
        <>
          <p className="mb-2">Please provide a reason for rejection:</p>
          <textarea className="w-full border p-2 rounded" rows={3} value={state.rejectionReason} onChange={(e) => updateState({ rejectionReason: e.target.value })} />
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => updateState({ showRejectModal: false })} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
            <button onClick={() => updateStatus(state.selectedHospital.id, 'rejected', state.rejectionReason)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" disabled={!state.rejectionReason.trim()}>Confirm Reject</button>
          </div>
        </>
      ))}

      {renderModal(state.showDeleteModal, 'showDeleteModal', state.selectedHospital && (
        <>
          <p className="mb-4">Are you sure you want to delete {state.selectedHospital.name}? This action cannot be undone.</p>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => updateState({ showDeleteModal: false })} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
            <button onClick={() => deleteHospital(state.selectedHospital.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Confirm Delete</button>
          </div>
        </>
      ))}
    </div>
  );
};

export default HospitalComponent;
