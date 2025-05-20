import React, { useState } from 'react';

const InputField = ({ label, type, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-royal-blue-500 focus:border-royal-blue-500"
    />
  </div>
);

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'security', label: 'Security' },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure and manage system-wide settings</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 flex space-x-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-royal-blue-600 border-b-2 border-royal-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">General Settings</h2>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Full Name" type="text" placeholder="Super Admin Name" />
              <InputField label="Email Address" type="email" placeholder="support@example.com" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Current Password" type="password" placeholder="••••••••" />
              <InputField label="New Password" type="password" placeholder="••••••••" />
              <div className="md:col-span-2">
                <InputField label="Confirm New Password" type="password" placeholder="••••••••" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-royal-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royal-blue-600" />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
