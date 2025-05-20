import React from 'react';
import { CreditCard, Wallet, ShieldCheck, AlertCircle,FileText, Eye } from 'lucide-react';

const billingSummary = [
  {
    title: 'Total Billing',
    value: '₹ 12,50,000',
    icon: <Wallet className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
  },
  {
    title: 'Paid Amount',
    value: '₹ 9,80,000',
    icon: <CreditCard className="w-6 h-6" />,
    color: 'from-green-500 to-green-600',
    bgLight: 'bg-green-50',
  },
  {
    title: 'Pending Payments',
    value: '₹ 2,70,000',
    icon: <AlertCircle className="w-6 h-6" />,
    color: 'from-yellow-500 to-yellow-600',
    bgLight: 'bg-yellow-50',
  },
  {
    title: 'Insurance Covered',
    value: '₹ 6,40,000',
    icon: <ShieldCheck className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-600',
    bgLight: 'bg-purple-50',
  },
];

const invoiceData = [
  {
    invoice: 'INV-2023-001',
    patient: 'Amit Kumar',
    amount: '₹12,500',
    date: '12/05/2023',
    status: 'Paid',
    method: 'Insurance',
  },
  {
    invoice: 'INV-2023-002',
    patient: 'Priya Sharma',
    amount: '₹8,900',
    date: '15/05/2023',
    status: 'Pending',
    method: 'Cash',
  },
  {
    invoice: 'INV-2023-003',
    patient: 'Rahul Singh',
    amount: '₹15,200',
    date: '18/05/2023',
    status: 'Paid',
    method: 'UPI',
  },
  {
    invoice: 'INV-2023-004',
    patient: 'Sunita Patel',
    amount: '₹7,300',
    date: '10/05/2023',
    status: 'Overdue',
    method: 'Credit Card',
  },
];

const statusStyle = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Overdue: 'bg-red-100 text-red-700',
};

function BillingAndPayments() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold text-[#0E1630] mb-6 flex items-center">
        <span className="w-2 h-6 bg-[#F5CB5C] rounded-full inline-block mr-3"></span>
        Billing & Payments
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {billingSummary.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-[#0E1630]">{card.value}</p>
              </div>
              <div className={`${card.bgLight} p-3 rounded-full group-hover:bg-gradient-to-br ${card.color} group-hover:text-white transition-colors duration-300`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Payment Table */}
     <div className="overflow-auto rounded-lg border border-gray-200">
        <table className="min-w-full bg-white divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left p-4 font-medium">Invoice</th>
              <th className="text-left p-4 font-medium">Patient</th>
              <th className="text-left p-4 font-medium">Amount</th>
              <th className="text-left p-4 font-medium">Date</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Method</th>
              <th className="text-left p-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-4 text-blue-600 font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" /> {item.invoice}
                </td>
                <td className="p-4 text-gray-800">{item.patient}</td>
                <td className="p-4 text-gray-800">{item.amount}</td>
                <td className="p-4 text-gray-800">{item.date}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[item.status]}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-gray-700">{item.method}</td>
                <td className="p-4">
                  <button className="flex items-center px-3 py-1 text-sm text-blue-600 border border-blue-100 rounded-md hover:bg-blue-50 transition">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default BillingAndPayments;
