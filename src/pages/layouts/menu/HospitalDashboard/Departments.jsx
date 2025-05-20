import React, { useEffect, useState } from 'react';
const API_URL = 'https://6825b85c0f0188d7e72e26eb.mockapi.io/departments';
 function Department() {
  const [departments, setDepartments] = useState([]), [formOpen, setFormOpen] = useState(false), [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', head: '', infra: '', staff: '', generalBeds: '', privateBeds: '', icuBeds: '' });
  const fetchDepartments = async () => {
    try { const res = await fetch(API_URL); setDepartments(await res.json()); }
    catch (err) { console.error('Fetch error', err); }
  };
  useEffect(() => { fetchDepartments(); }, []);
  const handleSubmit = async () => {
    const payload = {
      id: formData.id,
      name: formData.name,
      head: formData.head,
      infra: formData.infra,
      staff: formData.staff,
      wards: {
        general: formData.generalBeds,
        private: formData.privateBeds,
        icu: formData.icuBeds
      }
    };
    try {
      const res = await fetch(isEditMode ? `${API_URL}/${formData.id}` : API_URL, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save');
      fetchDepartments(); resetForm();
    } catch (err) {
      console.error('Save error', err);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Confirm delete?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchDepartments();
    } catch (err) {
      console.error('Delete error', err);
    }
  };
  const handleEdit = (d) => {
    setFormData({
      id: d.id,
      name: d.name,
      head: d.head,
      infra: d.infra,
      staff: d.staff,
       generalBeds: d.generalBeds,
      privateBeds: d.privateBeds,
      icuBeds: d.icuBeds
    });
    setIsEditMode(true); setFormOpen(true);
  };
  const resetForm = () => {
    setFormData({ id: '', name: '', head: '', infra: '', staff: '', generalBeds: '', privateBeds: '', icuBeds: '' });
    setIsEditMode(false); setFormOpen(false);
  };
  return (
    <div className="p-6">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-semibold">Departments</h2>
        <button onClick={() => { resetForm(); setFormOpen(true); }} className="bg-[#0E1630] text-white px-4 py-2 rounded hover:bg-[#F4C430] ">+ Add Department</button>
      </div>
      <div className="overflow-x-auto shadow border rounded">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>{['Dept.ID', ' Department Name', 'Head of Department ', 'Infra', 'Staff', 'Wards', 'Actions'].map((h, i) => <th key={i} className="px-4 py-2 bg-[#0E1630] text-white ">{h}</th>)}</tr>
          </thead>
          <tbody>
            {departments.map(d => (
              <tr key={d.id} className="border-t text-center">
                <td className="px-4 py-2">{d.id}</td>
                <td className="px-4 py-2">{d.name}</td>
                <td className="px-4 py-2">{d.head}</td>
                <td className="px-4 py-2">{d.infra}</td>
                <td className="px-4 py-2">{d.staff}</td>
                <td className="px-4 py-2 text-xs">Gen: {d.wards.general}, Priv: {d.wards.private}, ICU: {d.wards.icu}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(d)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">{isEditMode ? 'Edit Department' : 'Add New Department'}</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Department ID', 'id', isEditMode],
                ['Name', 'name'],
                ['Head', 'head'],
                ['Infrastructure', 'infra'],
                ['Staff Names', 'staff'],
                ['General Beds', 'generalBeds'],
                ['Private Beds', 'privateBeds'],
                ['ICU Beds', 'icuBeds']
              ].map(([label, name, disabled = false]) => (
                <div key={name} className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium">{label}</label>
                  <input type="text" disabled={disabled} className="mt-1 w-full border px-3 py-1.5 rounded" value={formData[name]} onChange={e => setFormData(p => ({ ...p, [name]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={resetForm} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{isEditMode ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Department;