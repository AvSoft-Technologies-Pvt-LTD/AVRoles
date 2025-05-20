// import React, { useState } from 'react';
// import { motion } from 'framer-motion';

// const Roles = () => {
//   const [roles, setRoles] = useState([
//     { id: 1, name: 'Super Admin', users: 2, permissions: 'Full Access' },
//     { id: 2, name: 'Hospital Admin', users: 15, permissions: 'Hospital Management' },
//     { id: 3, name: 'Doctor', users: 48, permissions: 'Patient Records, Appointments' },
//     { id: 4, name: 'Lab Manager', users: 12, permissions: 'Lab Reports, Test Management' },
//     { id: 5, name: 'Pharmacy Manager', users: 18, permissions: 'Inventory, Orders' }
//   ]);

//   const [selectedRole, setSelectedRole] = useState(null);

//   const permissions = [
//     'User Management',
//     'Role Management',
//     'Report Access',
//     'Financial Management',
//     'Patient Records',
//     'Appointment Management',
//     'Inventory Management',
//     'System Settings'
//   ];

//   return (
//     <div className="p-6 bg-white rounded-lg shadow-md">
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold text-gray-800 mb-2">Role Management</h1>
//         <p className="text-gray-600">Manage user roles and permissions across the platform</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-1">
//           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold text-gray-700">Roles</h2>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-3 py-1 bg-royal-blue-600 text-white rounded-lg hover:bg-royal-blue-700 transition-colors text-sm"
//               >
//                 Add Role
//               </motion.button>
//             </div>
            
//             <div className="space-y-2">
//               {roles.map((role) => (
//                 <motion.div
//                   key={role.id}
//                   whileHover={{ scale: 1.01 }}
//                   className={`p-3 rounded-lg cursor-pointer transition-all ${
//                     selectedRole?.id === role.id
//                       ? 'bg-royal-blue-50 border-2 border-royal-blue-200'
//                       : 'bg-white border border-gray-200 hover:border-royal-blue-200'
//                   }`}
//                   onClick={() => setSelectedRole(role)}
//                 >
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h3 className="font-medium text-gray-800">{role.name}</h3>
//                       <p className="text-sm text-gray-500">{role.users} users</p>
//                     </div>
//                     <div className="text-royal-blue-600">
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
//                       </svg>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-2">
//           {selectedRole ? (
//             <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold text-gray-800">{selectedRole.name}</h2>
//                 <div className="space-x-2">
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="px-4 py-2 bg-royal-blue-600 text-white rounded-lg hover:bg-royal-blue-700 transition-colors"
//                   >
//                     Save Changes
//                   </motion.button>
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-700 mb-3">Permissions</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {permissions.map((permission) => (
//                       <div
//                         key={permission}
//                         className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200"
//                       >
//                         <input
//                           type="checkbox"
//                           className="w-4 h-4 text-royal-blue-600 rounded border-gray-300 focus:ring-royal-blue-500"
//                         />
//                         <span className="text-gray-700">{permission}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-medium text-gray-700 mb-3">Role Details</h3>
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
//                       <input
//                         type="text"
//                         value={selectedRole.name}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-royal-blue-500 focus:border-royal-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                       <textarea
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-royal-blue-500 focus:border-royal-blue-500"
//                         rows="3"
//                       ></textarea>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-6">
//               <p className="text-gray-500">Select a role to view and edit details</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Roles;
// 
import React, { useState } from 'react';

const rolePermissions = {
  superAdmin: [
    'View & Edit All Modules',
    'Approve/Reject Doctors',
    'Approve/Reject Hospitals',
    'Approve/Reject Pharmacies',
    'Approve/Reject Labs',
    'Manage All Patients',
    'Manage All Transactions',
    'Access Settings',
    'Access Billing & Reports',
    'Manage Sub Admins',
    'System Configuration',
  ],
  subAdmin: [
    'View & Edit All Modules',
    'Approve/Reject Doctors',
    'Approve/Reject Hospitals',
     'Approve/Reject Pharmacies',
    'Approve/Reject Labs',
    'Manage All Patients',
    'Access Billing Info',
    'View Transactions',
    'Limited Access to Settings',
    'Generate Reports'
  ],
  patient: [
    'Book Appointments',
    'Download Health Card',
    'View/Upload Reports',
    
    'View Transactions',
    'Add Presptions',
    'Tracking Delievry'
    ],
  hospital: [
    'Add/Edit Assosiated Doctors',
    'Add/Edit Staffs',
    'Add/Edit Departments',
    'Manage Patients',
    'Add Patients in OPD',
    'Assign Departments to Doctors',
    'Billing & Payments',
     'View & Manage All Appointments',
    'View Reports',
    'View Prescrptions',
  ],
  freelancerDoctor: [
    'Access Patient History',
    'Prescribe Medications',
    'Request Lab Tests',
     'View Appointments',
     'Refer Labs',
    'Access Payments',
  ],
  avSwasthyaDoctor: [
    'Access Patient History',
  'Prescribe Medications',
     'View Appointments',
    'Prescribe Medication',
  ],
  pharmacy: [
    'View Prescriptions',
    'Add Medications',
    'Manage Inventory',
    'Track Orders',
    'Handle Delivery',
    'Generate Reports',
  ],
  lab: [
     'Add Test/Scans',
    'Upload Reports',
    'View Prescriptions',
    'Manage Inventory',
    'Manage Appointments',
    'Generate Bills',
    'Track Test Deliveries',
    'View Appointments',
  ],
};

const roleLabels = {
  superAdmin: 'Super Admin',
  subAdmin: 'Sub Admin',
  patient: 'Patient',
  hospital: 'Hospital',
  freelancerDoctor: 'Freelancer Doctor',
  avSwasthyaDoctor: 'AV Swasthya Doctor',
  pharmacy: 'Pharmacy',
  lab: 'Lab / Scan Center',
};

const UserRolePermissionManager = () => {
  const [selectedRole, setSelectedRole] = useState('patient');
  const [availablePermissions, setAvailablePermissions] = useState(rolePermissions['patient']);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [assignedRoles, setAssignedRoles] = useState([]);

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    setAvailablePermissions(rolePermissions[role]);
    setSelectedPermissions([]);
  };

  const togglePermission = (perm) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const addRoleWithPermissions = () => {
    if (selectedPermissions.length === 0) {
      alert('Please select at least one permission.');
      return;
    }

    setAssignedRoles((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: selectedRole,
        permissions: selectedPermissions,
      },
    ]);
    setSelectedPermissions([]);
  };

  const removeRole = (id) => {
    setAssignedRoles((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <div className="w-full mx-auto mt-6 max-w-6xl px-4 text-[17px] text-black">
      <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center tracking-wide">
          Assign Permissions to User Types
        </h2>

        {/* Role Dropdown */}
        <div className="mb-6 max-w-sm">
          <label className="block font-semibold mb-2">
            Choose User Type
          </label>
          <select
            value={selectedRole}
            onChange={handleRoleChange}
            className="w-full p-3 border rounded-lg bg-white font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700"
          >
            {Object.entries(roleLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Permissions List */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-lg">
            Select Module Permissions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {availablePermissions.map((perm, index) => (
              <label
                key={index}
                className="flex items-start space-x-2 bg-gray-50 border border-gray-200 rounded-lg p-2 hover:bg-gray-100 transition"
              >
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(perm)}
                  onChange={() => togglePermission(perm)}
                  className="accent-black mt-1"
                />
                <span className="text-sm">{perm}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Add Button */}
        <div className="text-right">
          <button
            onClick={addRoleWithPermissions}
            className="bg-[#f4c430] text-black font-semibold px-6 py-2 rounded-lg hover:bg-yellow-400 transition"
          >
            Add Role
          </button>
        </div>
      </div>

      {/* Assigned Roles Table */}
      {assignedRoles.length > 0 && (
        <div className="mt-10 bg-white shadow-md border rounded-2xl overflow-hidden">
          <div className="p-4 bg-gray-100 border-b text-lg font-semibold">
            Assigned Roles with Permissions
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-base text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3">User Type</th>
                  <th className="px-4 py-3">Permissions</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignedRoles.map((entry) => (
                  <tr key={entry.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{roleLabels[entry.role]}</td>
                    <td className="px-4 py-3">
                      <ul className="list-disc ml-5 space-y-1">
                        {entry.permissions.map((perm, idx) => (
                          <li key={idx}>{perm}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeRole(entry.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRolePermissionManager;

