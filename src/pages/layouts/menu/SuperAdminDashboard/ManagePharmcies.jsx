import React, { useState, useEffect, useRef, memo } from 'react';
import axios from 'axios';
const Modal = ({ children, onClose }) => {
  const ref = useRef();
  useEffect(() => {
    const handler = e => ref.current && !ref.current.contains(e.target) && onClose();
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);
  return <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"><div ref={ref} className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full">{children}</div></div>;
};
const PharmacyApprovedModal = memo(({ onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 2000); return () => clearTimeout(t); }, [onClose]);
  return <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"><div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center"><svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg><h3 className="text-2xl font-semibold text-green-700 mb-2">Pharmacy Approved!</h3><button onClick={onClose} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Close</button></div></div>;
});
export default function PharmacyList() {
  const [pharmacies, setPharmacies] = useState([]), [search, setSearch] = useState(''), [filterStatus, setFilterStatus] = useState('All'), [sel, setSel] = useState(null), [rejModal, setRejModal] = useState(false), [rejReason, setRejReason] = useState(''), [err, setErr] = useState(''), [successMsg, setSuccessMsg] = useState(''), [deleteConfirm, setDeleteConfirm] = useState(false), [pharmacyToDelete, setPharmacyToDelete] = useState(null), [showApprovedModal, setShowApprovedModal] = useState(false), [editModal, setEditModal] = useState(false), [editForm, setEditForm] = useState({});
  useEffect(() => { axios.get('https://mocki.io/v1/738614f4-5d55-41f4-b002-fe5e825d561b').then(res => setPharmacies(res.data.pharmacies || res.data)).catch(console.error); }, []);
  const closeAll = () => { setSel(null); setRejModal(false); setRejReason(''); setErr(''); setEditModal(false); setEditForm({}); };
  const updateStatus = (id, status, reason = '') => { setPharmacies(p => p.map(x => x.id === id ? { ...x, status, reason } : x)); closeAll(); if (status === 'Approved') { setSuccessMsg('Pharmacy approved successfully!'); setShowApprovedModal(true); setTimeout(() => setSuccessMsg(''), 3000); }};
  const submitRej = () => rejReason.trim() ? updateStatus(sel.id, 'Rejected', rejReason.trim()) : setErr('Please enter a rejection reason.');
  const confirmDelete = p => { setPharmacyToDelete(p); setDeleteConfirm(true); };
  const handleDelete = () => { setPharmacies(p => p.filter(x => x.id !== pharmacyToDelete.id)); setDeleteConfirm(false); setPharmacyToDelete(null); };
  const openEditModal = p => { setEditForm(p); setEditModal(true); };
  const handleEditChange = e => setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleEditSubmit = e => { e.preventDefault(); setPharmacies(p => p.map(x => x.id === editForm.id ? { ...editForm } : x)); closeAll(); setSuccessMsg('Pharmacy updated successfully!'); setTimeout(() => setSuccessMsg(''), 3000); };
  const filtered = pharmacies.filter(p => p.pharmacyName.toLowerCase().includes(search.toLowerCase()) && (filterStatus === 'All' || p.status === filterStatus));
  return (
    <div className="p-4 w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Pharmacy Management</h2>
      {successMsg && <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-center">{successMsg}</div>}
      <div className="flex gap-4 mb-6">
        <input placeholder="Search pharmacy name..." value={search} onChange={e => setSearch(e.target.value)} className="border px-4 py-2 rounded w-full max-w-sm" />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border px-4 py-2 rounded">{['All', 'Pending', 'Approved', 'Rejected'].map(s => <option key={s}>{s}</option>)}</select>
      </div>
      {!filtered.length ? <p className="text-gray-500">No pharmacies found.</p> : (
        <table className="min-w-full bg-white border">
          <thead className="bg-[#0E1630] text-white"><tr>{['Pharmacy ID', 'Pharmacy Name', 'Phone No.', 'Registration No.', 'Pharmacy Type', 'Status', 'Action'].map(h => <th key={h} className="p-2 text-left">{h}</th>)}</tr></thead>
          <tbody>{filtered.map(p => (
            <tr key={p.id} className=""><td className="p-2">{p.id}</td><td className="p-2">{p.pharmacyName}</td><td className="p-2">{p.phone}</td><td className="p-2">{p.registrationNumber}</td><td className="p-2">{p.pharmacyType.join(', ')}</td><td className={`p-2 font-semibold ${p.status === 'Approved' ? 'text-green-600' : p.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{p.status}</td><td className="p-2 flex justify-center gap-2 flex-wrap">
                <button onClick={() => setSel(p)} className="border-2 border-yellow-400 px-2 py-1 rounded">View</button>
                {(p.status === 'Approved') && (<> <button onClick={() => openEditModal(p)} className="border-2 border-blue-500 text-blue-600 px-2 py-1  rounded">Edit</button> <button onClick={() => confirmDelete(p)} className="border-2 border-red-500 text-red-600 px-2 py-1 rounded">Delete</button></>)}
                {p.status === 'Rejected' && <button onClick={() => confirmDelete(p)} className="border-2 border-red-500 text-red-600 px-2 py-1 rounded">Delete</button>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      )}
      {sel && !rejModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-auto p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <button onClick={closeAll} className="absolute top-5 right-5 text-gray-600 text-2xl">✕</button>
            <h2 className="text-3xl font-bold text-yellow-500 border-b pb-3">Pharmacy Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded border">
              {[['Pharmacy Name', sel.pharmacyName], ['Owner Name', sel.ownerName], ['Phone No.', sel.phone], ['Email', sel.email], ['Location', sel.location], ['Aadhaar', 'XXXX XXXX XXXX']].map(([k, v], i) => <p key={i}><strong>{k}:</strong> {v}</p>)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded border">
              {[['Pharmacy Type', sel.pharmacyType.join(', ')], ['License No.', sel.licenseNumber], ['Registration No.', sel.registrationNumber], ['Services Offered', sel.servicesOffered.join(', ')]].map(([k, v], i) => <p key={i}><strong>{k}:</strong> {v}</p>)}
            </div>
            {sel.documents && Object.keys(sel.documents).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-gray-50 p-6 rounded border">
                {Object.entries(sel.documents).map(([doc, uploaded], i) => (
                  <div key={i} className="p-4 bg-white border rounded shadow">
                    <p className="font-medium mb-2">:page_facing_up: {doc.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</p>
                    {uploaded ? <a href={sel.documentUrls?.[doc] || '#'} className="text-yellow-600 underline text-xs" target="_blank" rel="noreferrer">View</a> : <p className="text-gray-400 italic text-xs">Not available</p>}
                  </div>
                ))}
              </div>
            )}
            <div className="bg-gray-50 p-6 rounded border">
              <p><strong>Status:</strong> <span className={`font-semibold ${sel.status === 'Approved' ? 'text-green-600' : sel.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{sel.status}</span></p>
              {sel.status === 'Pending' && <div className="mt-4 flex flex-wrap gap-3 justify-center"><button onClick={() => updateStatus(sel.id, 'Approved')} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">Approve</button><button onClick={() => setRejModal(true)} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">Reject</button></div>}
              {sel.status === 'Rejected' && <p className="mt-4 font-semibold text-red-700">Reason: <span className="italic font-normal">{sel.reason || 'N/A'}</span></p>}
            </div>
          </div>
        </div>
      )}
      {rejModal && (
        <Modal onClose={closeAll}>
          <h3 className="text-xl font-semibold mb-3 text-red-600">Reject Pharmacy</h3>
          <textarea value={rejReason} onChange={e => { setErr(''); setRejReason(e.target.value); }} rows={4} placeholder="Enter reason for rejection..." className="w-full border rounded p-2" />
          {err && <p className="text-red-500 mt-2">{err}</p>}
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={closeAll} className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button onClick={submitRej} className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
          </div>
        </Modal>
      )}
      {deleteConfirm && (
        <Modal onClose={() => setDeleteConfirm(false)}>
          <h3 className="text-xl font-semibold mb-4 text-red-700">Confirm Delete</h3>
          <p>Are you sure you want to delete <strong>{pharmacyToDelete.pharmacyName}</strong>?</p>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setDeleteConfirm(false)} className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button onClick={handleDelete} className="px-5 py-2 bg-red-700 text-white rounded hover:bg-red-800">Delete</button>
          </div>
        </Modal>
      )}
     {editModal && (
        <Modal onClose={closeAll}>
          <h3 className="text-lg font-semibold mb-4">Edit Pharmacy</h3>
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['pharmacyName', 'ownerName', 'phone', 'email', 'location', 'licenseNumber', 'registrationNumber'].map(f => (
                <div key={f}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.replace(/([A-Z])/g, ' $1')}</label>
                  <input name={f} value={editForm[f] || ''} onChange={handleEditChange} className="w-full border rounded px-4 py-2" />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4">
              <button type="button" onClick={closeAll} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
              <button type="submit" className="bg-yellow-500 text-white px-6 py-2 rounded">Save</button>
            </div>
          </form>
        </Modal>
      )}
      {showApprovedModal && <PharmacyApprovedModal onClose={() => setShowApprovedModal(false)} />}
    </div>
  );
}