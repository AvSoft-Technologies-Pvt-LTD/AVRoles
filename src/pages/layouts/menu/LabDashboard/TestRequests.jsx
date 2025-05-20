import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const LabAppointmentPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdates, setStatusUpdates] = useState({}); // to hold dropdown values per appointment

  const statuses = [
    "Appointment Confirmed",
    "Technician On the Way",
    "Sample Collected",
    "Test Processing",
    "Report Ready",
  ];

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("https://680b3642d5075a76d98a3658.mockapi.io/Lab/payment");
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = (appointmentId, newStatus) => {
    setStatusUpdates((prev) => ({ ...prev, [appointmentId]: newStatus }));
  };

  const handleUpdateStatus = async (appointmentId) => {
    const newStatus = statusUpdates[appointmentId];
    if (!newStatus) {
      alert("Please select a status first.");
      return;
    }

    try {
      await axios.put(`https://680b3642d5075a76d98a3658.mockapi.io/Lab/payment/${appointmentId}`, {
        status: newStatus,
      });
      alert("Status updated successfully.");
      fetchAppointments(); // Refresh the appointment list
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  if (loading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Lab Appointment Management</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b bg-gray-100 text-left">
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Booking ID</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Patient Name</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Test</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Date & Time</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Payment Status</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
              <th className="py-3 px-4 text-sm font-semibold text-gray-600">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-800">{appointment.bookingId}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{appointment.patientName}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{appointment.testTitle}</td>
                <td className="py-3 px-4 text-sm text-gray-800">
                  {new Date(appointment.date).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-gray-800">{appointment.paymentStatus}</td>
                <td className="py-3 px-4 text-sm">
                  <Link
                    to={`/dashboard/track-appointment/${appointment.bookingId}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View Details
                  </Link>
                </td>
                <td className="py-3 px-4 text-sm">
                  <select
                    value={statusUpdates[appointment.id] || appointment.status || ""}
                    onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                    className="border border-gray-300 px-2 py-1 rounded mr-2"
                  >
                    <option value="">-- Select --</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleUpdateStatus(appointment.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabAppointmentPage;


