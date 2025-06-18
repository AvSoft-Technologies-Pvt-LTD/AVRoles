import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Payments = () => {
  const [payments, setPayments] = useState([]), [isLoading, setIsLoading] = useState(true), [error, setError] = useState(null), [selectedPatient, setSelectedPatient] = useState(null), [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('https://681b32bd17018fe5057a8bcb.mockapi.io/paybook');
        setPayments(res.data);
      } catch {
        setError('Failed to fetch payment data');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const formatDate = d => new Date(d).toLocaleDateString();
  const closeModal = () => setSelectedPatient(null);
  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const currentData = payments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevPage = () => currentPage > 1 && setCurrentPage(prev => prev - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(prev => prev + 1);

  if (isLoading) return <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-color)]"></div>
                  </div>;
  if (error) return <div className="min-h-screen flex items-center justify-center "><div className="text-red-500">{error}</div></div>;

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="h3-heading mb-6">Payment Records</h2>
        <div className="overflow-x-auto">
          <table className="table-container w-full">
            <thead>
              <tr className="table-head bg-gray-100 text-center">
                {['Patient Name', 'Invoice No', 'Date', 'Amount'].map((h) => (
                  <th key={h} className="p-3 font-semibold text-sm"><h4>{h}</h4></th>
                ))}
              </tr>
            </thead>
            <tbody className="table-body">
              {currentData.map((p, i) => (
                <tr key={p.id || i} className="tr-style text-center">
                  <td className="py-3">
                    <button onClick={() => setSelectedPatient(p)} className="text-[var(--primary-color)] hover:text-[var(--accent-color)] font-semibold">{p.patientName}</button>
                  </td>
                  <td className="py-3">{p.invoiceNo}</td>
                  <td className="py-3">{formatDate(p.date)}</td>
                  <td className="py-3">₹{Number(p.amount).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <div className="flex items-center space-x-2">
            <button onClick={handlePrevPage} disabled={currentPage === 1} className={`edit-btn${currentPage === 1 ? ' btn-disabled' : ''}`}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className={`edit-btn${currentPage === totalPages ? ' btn-disabled' : ''}`}>Next</button>
          </div>
        </div>

        {selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-center relative">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Details</h2>
              <div className="space-y-4 text-left text-gray-700">
                <p><span className="font-semibold">👤 Name:</span> {selectedPatient.patientName}</p>
                <p><span className="font-semibold">🩺 Service Type:</span> {selectedPatient.serviceType}</p>
                <p><span className="font-semibold">📅 Date:</span> {formatDate(selectedPatient.date)}</p>
                <p><span className="font-semibold">💳 Payment Method:</span> {selectedPatient.method}</p>
              </div>
              <button onClick={closeModal} className="mt-6 inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
