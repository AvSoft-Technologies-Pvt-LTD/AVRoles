import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowUpRight } from 'lucide-react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('https://681b32bd17018fe5057a8bcb.mockapi.io/paybook');
        setPayments(response.data);
      } catch (err) {
        setError('Failed to fetch payment data');
        console.error('Failed to fetch payment data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const totalAmount = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0e1630]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[#0E1630]">Payment Records</h2>
          <div className="bg-white rounded-lg shadow px-4 py-3">
            <span className="text-gray-500 text-sm">Total Revenue</span>
            <div className="text-xl font-bold text-[#0E1630]">₹{totalAmount.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#0E1630]">
                <tr>
                  {['Patient Name', 'Invoice No', 'Date', 'Service Type', 'Method', 'Amount', 'Actions'].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment, index) => (
                  <tr
                    key={payment.id || index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.invoiceNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.serviceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {payment.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#F4C430]">
                      ₹{Number(payment.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-[#0E1630] hover:text-[#F4C430] transition-colors duration-150"
                        onClick={() => window.open(`/billing/${payment.id}`, '_blank')}
                      >
                        <ArrowUpRight className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;