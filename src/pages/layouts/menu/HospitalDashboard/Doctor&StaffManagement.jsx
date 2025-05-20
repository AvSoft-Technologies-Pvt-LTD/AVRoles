import { useState, useEffect } from 'react'; 
import axios from 'axios';

const Input = ({ label, name, value, onChange, type = 'text', required, disabled }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label || name}</label>
    <input type={type} name={name} value={value} onChange={onChange} required={required} disabled={disabled} className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100" />
  </div>
);

const Select = ({ label, name, value, onChange, options = [], required, disabled }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label || name}</label>
    <select name={name} value={value} onChange={onChange} required={required} disabled={disabled} className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100">
      <option value="">Select {name}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const STAFF_TYPES = {
  doctors: { title: 'Doctors', headers: ['Name', 'Phone', 'Email', 'Specialization', 'Join Date', 'Actions'], specializations: { AYUSH: ['Homeopathy', 'Ayurveda', 'Unani', 'Siddha'], Allopathy: ['Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician'] } },
  nurses: { title: 'Nurses', headers: ['Name', 'Phone', 'Email', 'Designation', 'Join Date', 'Actions'] },
  otherStaff: { title: 'Other Staff', headers: ['Name', 'Role', 'Join Date', 'Actions'] }
};

const initialForm = { firstName: '', middleName: '', lastName: '', phone: '', aadhaar: '', gender: '', dob: '', email: '', password: '', confirmPassword: '', address: '', registrationNumber: '', practiceType: '', specialization: '', qualification: '', designation: '', department: '', role: '', salary: '', joiningDate: new Date().toISOString().split('T')[0], name: '', documents: [] };

function App() {
  const [activeTab, setActiveTab] = useState('doctors'); 
  const [staffData, setStaffData] = useState({}); 
  const [formData, setFormData] = useState(initialForm); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [mode, setMode] = useState('add'); 
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false); // New state for verification

  const is = (type) => activeTab === type;

  useEffect(() => { fetchStaffData(); }, []);

  const fetchStaffData = async () => {
    try {
      const { data } = await axios.get('https://6814aa91225ff1af16299ed8.mockapi.io/staff-list');
      setStaffData({
        doctors: data.filter(i => i.specialization), 
        nurses: data.filter(i => i.designation && !i.specialization), 
        otherStaff: data.filter(i => i.role && !i.specialization && !i.designation)
      });
    } catch (error) {
      handleError('Failed to load staff data', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fullName = `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim();
      const payload = { ...formData, name: fullName };
      const url = `https://6814aa91225ff1af16299ed8.mockapi.io/staff-list${mode === 'edit' ? `/${formData.id}` : ''}`;
      const method = mode === 'edit' ? axios.put : axios.post;
      await method(url, payload);
      setMessage(`Staff ${mode === 'edit' ? 'updated' : 'added'} successfully`);
      
      // Set verified state if adding a doctor
      if (mode === 'add' && activeTab === 'doctors') {
        setIsVerified(true);
      }

      fetchStaffData(); 
      closeModal();
    } catch (error) {
      handleError('Failed to save staff data', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await axios.delete(`https://6814aa91225ff1af16299ed8.mockapi.io/staff-list/${id}`);
      fetchStaffData(); 
      setMessage('Staff deleted successfully');
    } catch (error) {
      handleError('Failed to delete staff', error);
    }
  };

  const handleError = (userMessage, error) => {
    console.error(userMessage, error);
    setMessage(userMessage);
  };

  const closeModal = () => { 
    setIsModalOpen(false); 
    setFormData(initialForm); 
    setMode('add'); 
    setIsVerified(false); // Reset verified state on close
  };

  const renderRow = (label, value) => (
    <div className="flex justify-between py-3 border-b border-yellow-100">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-yellow-800">{value || 'Not Provided'}</span>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-4 overflow-hidden text-sm">
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white p-4 rounded-md shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`} alt={formData.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">{formData.name}</h2>
            <p className="text-yellow-100">{is('doctors') ? formData.specialization : is('nurses') ? formData.designation : formData.role}</p>
            {isVerified && ( // Conditionally render the verified tag
              <span className="text-green-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm5 7l-6 6-3-3 1.41-1.41L10 10.17l5.59-5.59L15 7z"/></svg>
                Verified
              </span>
            )}
            <p className="text-yellow-200 text-xs mt-1">Joined: {formData.joiningDate || 'Not Provided'}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-md shadow border border-yellow-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1 bg-yellow-100 rounded-md">
              <svg className="w-4 h-4 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-800">Personal Information</h3>
          </div>
          <div className="space-y-2">
            {renderRow('Gender', formData.gender)}
            {renderRow('Date of Birth', formData.dob)}
            {renderRow('Phone', formData.phone)}
            {renderRow('Email', formData.email)}
            {renderRow('Address', formData.address)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-md shadow border border-yellow-100">
          <div className="flex items-center gap-2mb-3">
            <div className="p-1 bg-yellow-100 rounded-md">
              <svg className="w-4 h-4 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-800">Professional Details</h3>
          </div>
          <div className="space-y-2">
            {is('doctors') && (
              <>
                {renderRow('Registration Number', formData.registrationNumber)}
                {renderRow('Practice Type', formData.practiceType)}
                {renderRow('Qualification', formData.qualification)}
              </>
            )}
            {is('nurses') && (
              <>
                {renderRow('Department', formData.department)}
                {renderRow('Designation', formData.designation)}
              </>
            )}
            {is('otherStaff') && (
              <>
                {renderRow('Role', formData.role)}
                {renderRow('Salary', formData.salary)}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required disabled={mode === 'view'} />
        <Input label="Middle Name" name="middleName" value={formData.middleName} onChange={handleInputChange} disabled={mode === 'view'} />
        <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required disabled={mode === 'view'} />
      </div>
      {is('doctors') && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} disabled={mode === 'view'} required />
            <Input label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleInputChange} disabled={mode === 'view'} required />
            <Input label="Aadhaar Number" name="aadhaar" value={formData.aadhaar} onChange={handleInputChange} disabled={mode === 'view'} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} disabled={mode === 'view'} required />
            <Input label="Email ID" type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={mode === 'view'} required />
            <Input label="Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} disabled={mode === 'view'} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Qualification" name="qualification" value={formData.qualification} onChange={handleInputChange} disabled={mode === 'view'} required />
            <Select label="Practice Type" name="practiceType" value={formData.practiceType} onChange={handleInputChange} options={Object.keys(STAFF_TYPES.doctors.specializations)} disabled={mode === 'view'} required />
            {formData.practiceType && (
              <Select label="Specialization" name="specialization" value={formData.specialization} onChange={handleInputChange} options={STAFF_TYPES.doctors.specializations[formData.practiceType]} disabled={mode === 'view'} required />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Location" name="location" value={formData.location} onChange={handleInputChange} disabled ={mode === 'view'} required />
            <Input label="Upload Documents" type="file" name="documents" multiple onChange={handleFileChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm" disabled={mode === 'view'} />
            {formData.documents?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Uploaded Documents:</h3>
                <ul className="list-disc pl-5 mt-2">
                  {formData.documents.map((file, idx) => (
                    <li key={idx} className="text-sm text-gray-700">{file.name}</li>
                  ))}
                </ul>
              </div>  
            )}
          </div>
        </>
      )}
      {is('nurses') && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} disabled={mode === 'view'} required />
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={mode === 'view'} required />
            <Input label="Aadhaar Number" name="aadhaar" value={formData.aadhaar} onChange={handleInputChange} disabled={mode === 'view'} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleInputChange} disabled={mode === 'view'} required />
            <Select label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} options={['Male', 'Female', 'Other']} disabled={mode === 'view'} required />
            <Input label="Designation" name="designation" value={formData.designation} onChange={handleInputChange} disabled={mode === 'view'} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Department" name="department" value={formData.department} onChange={handleInputChange} disabled={mode === 'view'} required />
            <Input label="Location" name="location" value={formData.location} onChange={handleInputChange} disabled={mode === 'view'} required />
            <Input label="Upload Documents" type="file" name="documents" multiple onChange={handleFileChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm" disabled={mode === 'view'} />
            {formData.documents?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Uploaded Documents:</h3>
                <ul className="list-disc pl-5 mt-2">
                  {formData.documents.map((file, idx) => (
                    <li key={idx} className="text-sm text-gray-700">{file.name}</li>
                  ))}
                </ul>
              </div>  
            )}
          </div>
        </>
      )}
      {is('otherStaff') && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Role" name="role" value={formData.role} onChange={handleInputChange} disabled={mode === 'view'} required options={['Cleaner', "Sweeper's", 'Technician', 'Other']} />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleInputChange} disabled={mode === 'view'} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Aadhaar Number" name="aadhaar" value={formData.aadhaar} onChange={handleInputChange} disabled={mode === 'view'} required />
            <Input label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleInputChange} disabled={mode === 'view'} required />
            <Select label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} options={['Male', 'Female', 'Other']} disabled={mode === 'view'} required />
          </div>     
          <div className="grid grid-cols-2 gap-4">
            <Input label="Department" name="department" value={formData.department} onChange={handleInputChange} disabled={mode === 'view'} required />
            <Input label="Salary" name="salary" value={formData.salary} onChange={handleInputChange} disabled={mode === 'view'} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} disabled={mode === 'view'} required />
            <Input label="Location" name="location" value={formData.location} onChange={handleInputChange} disabled={mode === 'view'} required />
            <Input label="Upload Documents" type="file" name="documents" multiple onChange={handleFileChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm" disabled={mode === 'view'} />
            {formData.documents?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Uploaded Documents:</h3>
                <ul className="list-disc pl-5 mt-2">
                  {formData.documents.map((file, idx) => (
                    <li key={idx} className="text-sm text-gray-700">{file.name}</li>
                  ))}
                </ul>
              </div>  
            )}
          </div>
        </>
      )}
    </div>
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, documents: [...(prev.documents || []), ...files] })); 
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            {Object.keys(STAFF_TYPES).map(type => (
              <button key={type} onClick={() => setActiveTab(type)} className={`px-4 py-2 rounded-md ${activeTab === type ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                {STAFF_TYPES[type].title}
              </button>
            ))}
          </div>
          <button onClick={() => { setMode('add'); setIsModalOpen(true); }} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Add {STAFF_TYPES[activeTab].title.slice(0, -1)}
          </button>
        </div>
        {message && (
          <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-md">
            {message}
          </div>
        )}
       <div className="bg-white rounded-lg shadow overflow-hidden">
  <div className="overflow-x-auto">
    <table className="min-w-full table-fixed">
      <thead className="bg-gray-50">
        <tr>
          {STAFF_TYPES[activeTab].headers.map(header => (
            <th key={header} className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white">
        {staffData[activeTab]?.map(staff => (
          <tr key={staff.id}>
            <td className="p-2 whitespace-nowrap">{staff.name}</td>
            {activeTab !== 'otherStaff' && (
              <>
                <td className="p-2 whitespace-nowrap">{staff.phone}</td>
                <td className="p-2 whitespace-nowrap">{staff.email}</td>
              </>
            )}
            <td className="p-2 whitespace-nowrap">{staff.specialization || staff.designation || staff.role}</td>
            <td className="p-2 whitespace-nowrap">{staff.joiningDate}</td>
            <td className="p-2 whitespace-nowrap">
              <div className="flex gap-1">
                <button onClick={() => { setFormData(staff); setMode('view'); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                <button onClick={() => { setFormData(staff); setMode('edit'); setIsModalOpen(true); }} className="text-yellow-600 hover:text-yellow-800 text-sm">Edit</button>
                <button onClick={() => handleDelete(staff.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">{mode === 'view' ? 'View' : mode === 'edit' ? 'Edit' : 'Add'} {STAFF_TYPES[activeTab].title.slice(0, -1)}</h2>
              <form onSubmit={handleSubmit}>
                {mode === 'view' ? renderProfile() : renderForm()}
                <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={closeModal} className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Close</button>
                  {mode !== 'view' && (
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{mode === 'edit' ? 'Update' : 'Submit'}</button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  
  );
}

export default App;