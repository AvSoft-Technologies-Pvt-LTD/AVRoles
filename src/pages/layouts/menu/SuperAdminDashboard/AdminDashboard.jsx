import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  RiUser3Fill,
  RiHospitalFill,
  RiStethoscopeFill,
  RiFlaskFill,
  RiStoreFill,
  RiMoneyDollarCircleFill,
} from "react-icons/ri";

const SuperAdminDashboardOverview = () => {
  const [userSummary, setUserSummary] = useState({});
  const [revenue, setRevenue] = useState({});
  const [pendingRegistrations, setPendingRegistrations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, revenueRes, pendingRegistrationsRes] = await Promise.all([
          axios.get("https://mocki.io/v1/74d15665-16d3-4c26-8736-343520e846a5"),
          axios.get("https://mocki.io/v1/6213ab4b-3ae1-484f-92c4-6dafa5872cf8"),
          axios.get("https://mocki.io/v1/10d5a076-bf81-4da1-9c6b-b1b907ff5609"),
        ]);
        setUserSummary(summaryRes.data);
        setRevenue(revenueRes.data);
        setPendingRegistrations(pendingRegistrationsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const summaryCards = [
    { label: "Patients", icon: <RiUser3Fill size={24} />, count: userSummary.patients },
    { label: "Doctors", icon: <RiStethoscopeFill size={24} />, count: userSummary.doctors },
    { label: "Hospitals", icon: <RiHospitalFill size={24} />, count: userSummary.hospitals },
    { label: "Labs", icon: <RiFlaskFill size={24} />, count: userSummary.labs },
    { label: "Pharmacies", icon: <RiStoreFill size={24} />, count: userSummary.pharmacies },
  ];

  if (loading) return <div className="p-6 text-center text-gray-600">Loading Dashboard...</div>;

  return (
    <div className="bg-[#F9FAFB] min-h-screen p-6 text-[#0E1630] space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {summaryCards.map((card, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-300 border-l-4 border-[#F4C430] flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 text-[#F4C430] font-semibold">
              {card.icon}
              <span className="text-[#0E1630]">{card.label}</span>
            </div>
            <h3 className="mt-3 text-3xl font-bold text-[#0E1630]">{card.count || 0}</h3>
          </div>
        ))}
      </div>

      {/* Revenue Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold text-[#0E1630] mb-4 flex items-center gap-2">
          <RiMoneyDollarCircleFill className="text-[#F4C430]" /> Revenue Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <h4 className="text-2xl font-bold text-[#0E1630]">₹{revenue.total || 0}</h4>
          </div>
          <div>
            <p className="text-gray-500 text-sm">This Month</p>
            <h4 className="text-2xl font-bold text-[#0E1630]">₹{revenue.month || 0}</h4>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Today</p>
            <h4 className="text-2xl font-bold text-[#0E1630]">₹{revenue.today || 0}</h4>
          </div>
        </div>
      </div>

      {/* Pending Registrations */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold text-[#0E1630] mb-4">Pending Registrations</h3>
        {Object.keys(pendingRegistrations).length ? (
          <ul className="divide-y divide-gray-200">
            {Object.entries(pendingRegistrations).map(([role, count]) => (
              <li key={role} className="flex justify-between py-2 text-sm">
                <span className="capitalize text-gray-600">{role}</span>
                <span className="font-bold text-[#0E1630]">{count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No pending registrations.</p>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboardOverview;
