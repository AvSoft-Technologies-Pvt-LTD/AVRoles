import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Plus } from 'lucide-react';

const LabManagement = ({ hospitalId }) => {
  const [labs, setLabs] = useState([]); // Initialize labs as an empty array
  const [newLab, setNewLab] = useState(initialLabState(hospitalId));
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  function initialLabState(hospitalId) {
    return {centerName: '',ownerName: '',phoneNumber: '',email: '',location: '',registrationNumber: '',licenseNumber: '',hospitalId: hospitalId || ''};}
  useEffect(() => {
    fetchLabs();
  }, []);
  const fetchLabs = async () => {
    try {
      const storedLabs = localStorage.getItem('labs');
      if (storedLabs) {
        const labsData = JSON.parse(storedLabs);
        setLabs(Array.isArray(labsData) ? labsData : []); // Ensure it's an array
      } else {
        const res = await axios.get(`https://680cc0c92ea307e081d4edda.mockapi.io/labhospital?hospitalId=${hospitalId}`);
        setLabs(Array.isArray(res.data) ? res.data : []); // Ensure it's an array
      }
    } catch (error) {
      console.error('Error fetching labs:', error);
      setLabs([]); 
    }
  };
  const handleChange = (e) => {
    setNewLab({ ...newLab, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    try {
      let updatedLabs;

      if (editIndex !== null) {
        const updatedLab = { ...labs[editIndex], ...newLab };
        await axios.put(`https://680cc0c92ea307e081d4edda.mockapi.io/labhospital/${labs[editIndex].id}`, updatedLab);
        updatedLabs = [...labs];
        updatedLabs[editIndex] = updatedLab;
        setLabs(updatedLabs);
        setEditIndex(null);
      } else {
        const res = await axios.post('https://680cc0c92ea307e081d4edda.mockapi.io/labhospital', newLab);
        updatedLabs = [...labs, res.data];
        setLabs(updatedLabs);
      }
      localStorage.setItem('labs', JSON.stringify(updatedLabs));
      fetchLabs(); 
      setNewLab(initialLabState(hospitalId));
      setShowModal(false);
    } catch (error) {
      console.error('Error saving lab:', error);
    }
  };

  // Handle editing a lab
  const handleEdit = (index) => {
    setEditIndex(index);
    setNewLab(labs[index]);
    setShowModal(true);
  };

  // Handle deleting a lab
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lab?')) return;  
    try {
      const response = await axios.delete(`https://680cc0c92ea307e081d4edda.mockapi.io/labhospital/${id}`);
      console.log('Lab deleted:', response.data);
      const updatedLabs = labs.filter(lab => lab.id !== id);
      setLabs(updatedLabs);
      localStorage.setItem('labs', JSON.stringify(updatedLabs));
    } catch (error) {
      console.error('Error deleting lab:', error);
    }
  };
  

  return (
    <div className="p-6 bg-[#f5f9fc] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#0e1630]">Hospital-Associated Labs</h2>
        <button className="bg-[#0e1630] text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-sky-700"onClick={() => {
            setNewLab(initialLabState(hospitalId));
            setShowModal(true);
            setEditIndex(null);
          }}
        >
          <Plus size={16} /> Add Lab
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-sky-100 text-[#0e1630] font-semibold">
            <tr>
              <th className="py-3 px-4 text-left">Center Name</th>
              <th className="py-3 px-4 text-left">Owner</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Location</th>
              <th className="py-3 px-4 text-left">Reg. No.</th>
              <th className="py-3 px-4 text-left">License No.</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {labs.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-500">
                  No labs found
                </td>
              </tr>
            ) : (
              labs.map((lab, index) => (
                <tr key={lab.id} className="border-t">
                  <td className="py-3 px-4">{lab.centerName}</td>
                  <td className="py-3 px-4">{lab.ownerName}</td>
                  <td className="py-3 px-4">{lab.phoneNumber}</td>
                  <td className="py-3 px-4">{lab.email}</td>
                  <td className="py-3 px-4">{lab.location}</td>
                  <td className="py-3 px-4">{lab.registrationNumber}</td>
                  <td className="py-3 px-4">{lab.licenseNumber}</td>
                  <td className="py-3 px-4 text-center flex justify-center gap-2">
                    <button onClick={() => handleEdit(index)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center gap-1">
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(lab.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1">
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
            <h3 className="text-xl font-semibold text-sky-700 mb-4">{editIndex !== null ? 'Edit Lab' : 'Add New Lab'}</h3>
            <div className="grid grid-cols-2 gap-4">
              {['centerName', 'ownerName', 'phoneNumber', 'email', 'location', 'registrationNumber', 'licenseNumber'].map(field => (
                <input
                  key={field}
                  name={field}
                  value={newLab[field]}
                  onChange={handleChange}
                  placeholder={field.replace(/([A-Z])/g, ' $1')}
                  className="border p-2 rounded focus:outline-sky-500"
                />
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onClick={handleSave}>
                Save
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LabManagement;
