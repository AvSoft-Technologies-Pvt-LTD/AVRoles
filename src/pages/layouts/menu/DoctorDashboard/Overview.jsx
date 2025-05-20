import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Users, UserPlus, Video, UserCheck, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import DoctorAppointments from "./Appointments";

const Overview = () => {
  
  const [doctor, setDoctor] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    opdPatients: 0,
    ipdPatients: 0,
    virtualPatients: 0,
  });
  
  const [appointments, setAppointments] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);  
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/payments'); // change this path based on your actual route
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch doctor profile
        const doctorResponse = await axios.get('https://mocki.io/v1/6fabb29a-df50-4849-b8f4-6b3d5397b4a8');
        setDoctor(doctorResponse.data.doctor);

        // Fetch payments for revenue calculation
        const paymentsResponse = await axios.get('https://681b32bd17018fe5057a8bcb.mockapi.io/paybook');
        const payments = paymentsResponse.data;

        // Calculate revenue
        const total = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
        const breakdown = calculateRevenueBreakdown(payments);
        setRevenue({ total, breakdown });

        // Calculate patient stats from payments
        const patientStats = calculatePatientStats(payments);
        setStats(patientStats);

        // Fetch appointments
        const appointmentsResponse = await axios.get('https://mocki.io/v1/8d78cf31-d476-4c56-ac4b-095f5d0b7e3f');
        setAppointments(appointmentsResponse.data.appointments);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculatePatientStats = (payments) => {
    const stats = {
      totalPatients: new Set(payments.map(p => p.patientName)).size,
      opdPatients: 0,
      ipdPatients: 0,
      virtualPatients: 0,
    };

    payments.forEach(payment => {
      if (payment.serviceType?.toLowerCase().includes('opd')) {
        stats.opdPatients++;
      } else if (payment.serviceType?.toLowerCase().includes('ipd')) {
        stats.ipdPatients++;
      } else if (payment.serviceType?.toLowerCase().includes('virtual')) {
        stats.virtualPatients++;
      }
    });

    return stats;
  };

  const calculateRevenueBreakdown = (payments) => {
    const serviceGroups = {};
    
    payments.forEach(payment => {
      const serviceType = payment.serviceType || 'Other';
      if (!serviceGroups[serviceType]) {
        serviceGroups[serviceType] = { count: 0, amount: 0 };
      }
      serviceGroups[serviceType].count++;
      serviceGroups[serviceType].amount += Number(payment.amount);
    });

    const colors = {
      'Virtual Consultation': 'text-purple-600',
      'Physical Consultation': 'text-amber-600',
      'IPD Treatment': 'text-green-600',
      'OPD Treatment': 'text-blue-600',
      'Lab Tests': 'text-red-600',
      'Other': 'text-gray-600'
    };

    return Object.entries(serviceGroups).map(([type, data]) => ({
      type,
      count: data.count,
      amount: data.amount,
      color: colors[type] || 'text-gray-600'
    }));
  };

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
    <div className="min-h-screen bg-gray-50">
     <div className="bg-[#0e1630] text-white px-6 py-5 rounded-lg shadow-md">
           <div className="container mx-auto">
             <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
               <div className="flex items-center mb-4 md:mb-0">
                 <div className="relative">
                   <img
                     src={doctor.profileImage}
                     alt={doctor.name}
                     className="w-20 h-20 rounded-full border-2 border-[#F4C430]"
                   />
                   <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0e1630]"></div>
                 </div>
                 <div className="ml-4">
                   <div className="text-sm font-medium text-gray-300">
                     Good Morning
                   </div>
                   <h2 className="text-2xl font-bold">{doctor.name}</h2>
                   <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-300">
                     <span className="mr-2">{doctor.specialty}</span>
                     <span className="hidden sm:inline">•</span>
                     <span className="mr-2 ml-0 sm:ml-2">
                       {doctor.qualifications}
                     </span>
                     <span className="hidden sm:inline">•</span>
                     <span className="ml-0 sm:ml-2">
                       Reg: {doctor.registrationId}
                     </span>
                   </div>
                   <div className="flex items-center mt-1">
                     <div className="flex items-center">
                       {[...Array(5)].map((_, index) => (
                         <svg
                           key={index}
                           className={`w-4 h-4 ${
                             index < Math.floor(doctor.rating)
                               ? "text-[#F4C430]"
                               : "text-gray-400"
                           }`}
                           fill="currentColor"
                           viewBox="0 0 20 20"
                         >
                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                         </svg>
                       ))}
                       <span className="ml-1 text-sm text-gray-300">
                         {doctor.rating} ({doctor.reviewCount} reviews)
                       </span>
                     </div>
                   </div>
                 </div>
               </div>
               <div className="flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-4">
                 <div className="text-right">
                   <div className="text-lg font-medium">{doctor.currentDate}</div>
                 </div>
                 <button className="flex items-center bg-[#F4C430] text-[#0e1630] px-4 py-2 rounded font-medium hover:bg-opacity-90 transition-all duration-300 shadow-md">
                   <Calendar className="w-5 h-5 mr-2" />
                   <span>{doctor.appointmentsToday} appointments today</span>
                 </button>
               </div>
             </div>
           </div>
         </div>

      <div className="container mx-auto px-2 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Patients", count: stats.totalPatients, icon: <Users className="h-6 w-6 text-blue-600" />, color: "border-blue-500" },
            { label: "OPD Patients", count: stats.opdPatients, icon: <Users Plus className="h-6 w-6 text-green-600" />, color: "border-green-500" },
            { label: "IPD Patients", count: stats.ipdPatients, icon: <Users Check className="h-6 w-6 text-amber-600" />, color: "border-amber-500" },
            { label: "Virtual Patients", count: stats.virtualPatients, icon: <Video className="h-6 w-6 text-purple-600" />, color: "border-purple-500" },
          ].map(({ label, count, icon, color }) => (
            <Link key={label} to={`/doctordashboard/patients?tab=${label.toLowerCase().replace(" ", "")}`}>
              <div className={`bg-white rounded-lg shadow-md p-5 border-l-4 ${color}`}>
                <div className="flex justify-between">
                  <div>
                    <p className="text-gray-500 font-medium">{label}</p>
                    <h3 className="text-3xl font-bold text-[#0e1630] mt-2">
                      {count.toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full h-12 w-12 flex items-center justify-center">
                    {icon}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      <div className="mt-8 grid grid-cols-1 gap-4">
  <div className="grid grid-cols-[70%_30%] gap-4">
    <div className="">
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-120">
        <div className="px-6 py-4 bg-[#0e1630] text-white">
          <h3 className="text-lg font-semibold">Recent Appointments</h3>
        </div>
        <div className="p-2">
          <DoctorAppointments appointments={appointments.slice(0, 4)} />
          <div className="px-4 py-2 bg-gray-50">
            <Link to="/doctordashboard/appointments" className="text-[#0e1630] hover:text-blue-800 flex items-center text-sm font-medium transition-colors duration-300">
              View All Appointments
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-[#0e1630] text-white">
          <h3 className="text-lg font-semibold">Revenue Generated</h3>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <h4 className="text-2xl font-bold text-[#0e1630]">
              ₹{revenue?.total.toLocaleString()}
            </h4>
          </div>
          <div className="space-y-6">
            {revenue?.breakdown.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${item.color}`}>
                      {item.type.includes("Virtual") ? (
                        <Video className="h-5 w-5" />
                      ) : item.type.includes("Physical") ? (
                        <UserCheck className="h-5 w-5" />
                      ) : (
                        <Users className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.count} consultations
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    ₹{item.amount.toLocaleString()}
                  </p>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color.replace(
                      "text-",
                      "bg-"
                    )}`}
                    style={{
                      width: `${(item.amount / revenue.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link to="/doctordashboard/billing" className="text-[#0e1630] hover:text-blue-800 flex items-center text-sm font-medium transition-colors duration-300">
                   View Billing & Payments

              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};
export default Overview;