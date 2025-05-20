import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Calendar, Users, DollarSign, CreditCard, Receipt,
  BarChart4, MapPin, Phone, Mail, Clock, Building2,
  Home, Hospital, BedDouble, Stethoscope, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function App() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    activeIPD: 0,
    availableBeds: 0
  });

  const navigate = useNavigate();

  const payments = [
    { id: 'INV-2023-001', patient: 'Amit Kumar', amount: '₹12,500', status: 'Paid', date: '12/05/2023' },
    { id: 'INV-2023-002', patient: 'Priya Sharma', amount: '₹8,900', status: 'Pending', date: '15/05/2023' },
    { id: 'INV-2023-003', patient: 'Rahul Singh', amount: '₹15,200', status: 'Paid', date: '18/05/2023' },
    { id: 'INV-2023-004', patient: 'Sunita Patel', amount: '₹7,300', status: 'Overdue', date: '10/05/2023' }
  ];

  const summaryCards = [
    { title: 'Total Revenue', value: '₹3,45,600', icon: <DollarSign className="w-5 h-5" />, color: 'bg-green-100 text-green-600' },
    { title: 'Pending', value: '₹48,200', icon: <CreditCard className="w-5 h-5" />, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Today', value: '₹12,500', icon: <Receipt className="w-5 h-5" />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Growth', value: '+15%', icon: <BarChart4 className="w-5 h-5" />, color: 'bg-purple-100 text-purple-600' }
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'overdue': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const StatCard = ({ title, value, icon, color, bgLight }) => (
    <div className="bg-white rounded-xl shadow-md p-6 group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-[#0E1630]">{value}</p>
        </div>
        <div className={`${bgLight} p-3 rounded-full group-hover:bg-gradient-to-br ${color} group-hover:text-white transition-colors duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('https://example.com/api/stats');
        const allAppointments = res.data || [];
        const today = new Date().toISOString().split('T')[0];

        const todayAppointments = allAppointments.filter(app => app.date === today);
        const ipdPatients = allAppointments.filter(app => app.status === 'IPD');

        setStats({
          totalPatients: allAppointments.length,
          todayAppointments: todayAppointments.length,
          activeIPD: ipdPatients.length,
          availableBeds: 100 - ipdPatients.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Patients", value: stats.totalPatients, icon: <Users className="w-6 h-6" />, color: "from-blue-500 to-blue-600", bgLight: "bg-blue-50" },
    { title: "Today's Appointments", value: stats.todayAppointments, icon: <Calendar className="w-6 h-6" />, color: "from-[#F5CB5C] to-[#F3B95F]", bgLight: "bg-yellow-50" },
    { title: "Active IPD", value: stats.activeIPD, icon: <Building2 className="w-6 h-6" />, color: "from-purple-500 to-purple-600", bgLight: "bg-purple-50" },
    { title: "Available Beds", value: stats.availableBeds, icon: <Home className="w-6 h-6" />, color: "from-green-500 to-green-600", bgLight: "bg-green-50" }
  ];

  const infrastructure = {
    departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology'],
    totalBeds: 200,
    icuBeds: 40,
    ventilators: 15,
    staffCount: 120
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-8">

        {/* Hospital Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#F5CB5C] opacity-20 rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#F5CB5C] opacity-10 rounded-tr-full" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
            <div>
              <h1 className="text-3xl font-bold text-[#0E1630] mb-2">AV Swasthya Health Center</h1>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-[#F5CB5C]" />123 Medical Plaza, Healthcare District</p>
                <p className="flex items-center"><Phone className="w-5 h-5 mr-2 text-[#F5CB5C]" />+91-1234567890</p>
                <p className="flex items-center"><Mail className="w-5 h-5 mr-2 text-[#F5CB5C]" />contact@avswasthya.com</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 bg-gradient-to-br from-[#F5CB5C] to-[#F3B95F] p-6 rounded-lg text-white shadow-lg">
              <Clock className="w-6 h-6 mb-2" />
              <p className="text-sm font-medium">Established</p>
              <p className="text-2xl font-bold">2010</p>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>

        {/* Infrastructure & Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Infrastructure */}
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
  <h2 className="text-2xl font-bold text-[#0E1630] flex items-center gap-3">
    <Hospital className="w-7 h-7 text-[#F5CB5C]" />
    <span>Hospital Infrastructure Overview</span>
  </h2>

  {/* Departments */}
  <div>
    <div className="flex items-center gap-3 mb-1">
      <Stethoscope className="w-5 h-5 text-[#F5CB5C]" />
      <span className="font-medium text-gray-700">Departments</span>
    </div>
    <div className="text-sm text-gray-500 ml-8">{infrastructure.departments.join(', ')}</div>
  </div>

  {/* Total Beds */}
  <div>
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center gap-3">
        <BedDouble className="w-5 h-5 text-[#F5CB5C]" />
        <span className="font-medium text-gray-700">Total Beds</span>
      </div>
      <span className="text-sm text-gray-600">{infrastructure.totalBeds} Beds</span>
    </div>
    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
      <div className="bg-[#6BCB77] h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(infrastructure.totalBeds / 10, 100)}%` }}></div>
    </div>
  </div>

  {/* ICU Beds */}
  <div>
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center gap-3">
        <Activity className="w-5 h-5 text-[#F5CB5C]" />
        <span className="font-medium text-gray-700">ICU Beds</span>
      </div>
      <span className="text-sm text-gray-600">{infrastructure.icuBeds} ICU</span>
    </div>
    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
      <div className="bg-[#FF6B6B] h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(infrastructure.icuBeds / 2, 100)}%` }}></div>
    </div>
  </div>

  {/* Ventilators */}
  <div>
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center gap-3">
        <Building2 className="w-5 h-5 text-[#F5CB5C]" />
        <span className="font-medium text-gray-700">Ventilators</span>
      </div>
      <span className="text-sm text-gray-600">{infrastructure.ventilators} Units</span>
    </div>
    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
      <div className="bg-[#4D96FF] h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(infrastructure.ventilators * 5, 100)}%` }}></div>
    </div>
  </div>

  {/* Staff Count */}
  <div>
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center gap-3">
        <Users className="w-5 h-5 text-[#F5CB5C]" />
        <span className="font-medium text-gray-700">Staff Count</span>
      </div>
      <span className="text-sm text-gray-600">{infrastructure.staffCount} Staff</span>
    </div>
    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
      <div className="bg-[#FFD93D] h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(infrastructure.staffCount / 2, 100)}%` }}></div>
    </div>
  </div>
</div>



          {/* Right: Payments */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#0E1630]">Recent Payments</h2>
              <button
                onClick={() => navigate('/hospitaldashboard/billing-payments')}
                className="text-[#F5CB5C] hover:underline font-semibold"
              >
                View All Payments
              </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {summaryCards.map((card, index) => (
                <div key={index} className="p-4 rounded-lg flex items-center space-x-3 bg-gray-50">
                  <div className={`p-3 rounded-full ${card.color}`}>
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="font-bold text-[#0E1630]">{card.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-left text-gray-600 text-sm border-b">
                    <th className="py-2">Invoice</th>
                    <th className="py-2">Patient</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Date</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b text-sm text-gray-700">
                      <td className="py-2">{payment.id}</td>
                      <td className="py-2">{payment.patient}</td>
                      <td className="py-2">{payment.amount}</td>
                      <td className="py-2">{payment.date}</td>
                      <td className="py-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
