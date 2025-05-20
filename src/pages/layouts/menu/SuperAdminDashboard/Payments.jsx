import React, { useState, useEffect } from "react";

const revenueData = [
  { id: "HSP001", name: "Hospital A", entity: "Hospital", type: "credited", amount: 50000, date: "2025-05-15" },
  { id: "PHM002", name: "Pharmacy B", entity: "Pharmacy", type: "credited", amount: 10000, date: "2025-05-16" },
  { id: "LAB003", name: "Lab X", entity: "Lab", type: "credited", amount: 30000, date: "2025-05-17" },
  { id: "HSP001", name: "Hospital A", entity: "Hospital", type: "credited", amount: 5000, date: "2025-05-18" },
  { id: "PHM003", name: "Pharmacy C", entity: "Pharmacy", type: "credited", amount: 12000, date: "2025-05-18" },
  { id: "LAB004", name: "Lab Y", entity: "Lab", type: "credited", amount: 7000, date: "2025-05-18" },
  { id: "DR001", name: "Dr. Smith", entity: "Freelancer Doctor", type: "credited", amount: 15000, date: "2025-05-19", freelancer: true },
  { id: "DR002", name: "Dr. Jane", entity: "Freelancer Doctor", type: "credited", amount: 20000, date: "2025-05-20", freelancer: true },
  { id: "AVD001", name: "Dr. AV Swasthya", entity: "AV Swasthya Dr", type: "debited", amount: 8000, date: "2025-05-21" },
  { id: "AVD002", name: "Dr. AV Swasthya", entity: "AV Swasthya Dr", type: "debited", amount: 5000, date: "2025-05-22" }
];

const Card = ({ title, value, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md`}>
    <p className="text-sm text-gray-600 mb-2">{title}</p>
    <h2 className={`text-2xl font-semibold text-${color}-700`}>₹ {value.toLocaleString()}</h2>
  </div>
);

const SuperAdminRevenue = () => {
  const [entityType, setEntityType] = useState("All"),
        [startDate, setStartDate] = useState(""),
        [endDate, setEndDate] = useState(""),
        [searchQuery, setSearchQuery] = useState(""),
        [page, setPage] = useState(1);

  const filtered = revenueData.filter(({ entity, date, name, id }) =>
    (entityType === "All" || entity === entityType) &&
    (!startDate || date >= startDate) &&
    (!endDate || date <= endDate) &&
    (name.toLowerCase().includes(searchQuery.toLowerCase()) || id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const credited = filtered.filter(d => d.type === "credited").reduce((a, { amount }) => a + amount, 0),
        debited = filtered.filter(d => d.type === "debited").reduce((a, { amount }) => a + amount, 0);

  const itemsPerPage = 5,
        totalPages = Math.ceil(filtered.length / itemsPerPage),
        paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  return (
    <div className="p-6 space-y-8 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Revenue</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card title="Total Credited" value={credited}  />
        <Card title="Total Debited" value={debited} />
        <Card title="Net Revenue" value={credited - debited}  />
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={entityType}
          onChange={e => setEntityType(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {["All", "Hospital", "Pharmacy", "Lab", "AV Swasthya Dr", "Freelancer Doctor"].map(opt => (
            <option key={opt} value={opt}>
              {opt === "All" ? "All Entities" : opt}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* 🔍 Updated Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-300 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-900 text-white text-left">
            <tr>
              {["ID", "Name", "Entity", "Type", "Amount (₹)", "Date"].map((h, i) => (
                <th key={i} className="p-4 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.length ? paginated.map((d, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-4 whitespace-nowrap">{d.id}</td>
                <td className="p-4 whitespace-nowrap">{d.name}</td>
                <td className="p-4 whitespace-nowrap">{d.entity}</td>
                <td className={`p-4 whitespace-nowrap capitalize ${d.type === "credited" ? "text-green-600" : "text-red-600"}`}>{d.type}</td>
                <td className="p-4 whitespace-nowrap">{d.amount.toLocaleString()}</td>
                <td className="p-4 whitespace-nowrap">{d.date}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">No revenue data found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-3 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700 font-medium">Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SuperAdminRevenue;