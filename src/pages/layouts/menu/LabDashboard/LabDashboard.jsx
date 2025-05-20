import { useState } from 'react';
import {
  TestTube2,
  Clock,
  Home,
  Building2,
  Microscope,
  Wallet,
  ArrowRight,
  Phone,
  MapPin,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const stats = [
    { title: 'Total Tests', value: '1,245', icon: <TestTube2 size={24} />, color: 'bg-[#E5B800]', path: '/tests' },
    { title: 'Pending Requests', value: '18', icon: <Clock size={24} />, color: 'bg-[#0e1630]', path: '/requests' },
    { title: 'Home Visits', value: '24', icon: <Home size={24} />, color: 'bg-[#E5B800]', path: '/home-visits' },
    { title: 'Lab Visits', value: '42', icon: <Building2 size={24} />, color: 'bg-[#0e1630]', path: '/lab-visits' }
  ];

  const todayVisits = [
    { name: 'John Smith', time: '10:00 AM', type: 'Lab Visit', status: 'Completed', path: '/visit/1' },
    { name: 'Maria Garcia', time: '11:30 AM', type: 'Home Sample', status: 'Pending', path: '/visit/2' },
    { name: 'David Wilson', time: '2:00 PM', type: 'Lab Visit', status: 'In Progress', path: '/visit/3' },
    { name: 'Sarah Johnson', time: '3:30 PM', type: 'Home Sample', status: 'Scheduled', path: '/visit/4' }
  ];

  const recentActivities = [
    {
      title: 'New Test Results Available',
      description: 'Blood work results for Patient #12458',
      time: '2 minutes ago',
      icon: <TestTube2 className="text-white" size={20} />,
      bg: 'bg-[#0e1630]',
      border: 'border-[#0e1630]',
      path: '/activity/test-results'
    },
    {
      title: 'Payment Received',
      description: '₹2,500 from Patient #12445',
      time: '15 minutes ago',
      icon: <Wallet className="text-white" size={20} />,
      bg: 'bg-[#E5B800]',
      border: 'border-[#E5B800]',
      path: '/activity/payment'
    },
    {
      title: 'Home Sample Collection',
      description: 'Scheduled for Patient #12460',
      time: '30 minutes ago',
      icon: <Home className="text-white" size={20} />,
      bg: 'bg-[#0e1630]',
      border: 'border-[#0e1630]',
      path: '/activity/home-collection'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#0e1630] text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="py-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-[#E5B800] p-3 rounded-lg">
                  <Microscope className="text-white" size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">ABC Lab</h1>
                  <p className="text-sm text-white/80">ISO 9001:2015 Certified</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">Dr. Rajesh Kumar</p>
                <p className="text-sm text-white/80">Laboratory Director, MD Pathology</p>
              </div>
            </div>
          </div>
          <div className="py-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-white/80">
                  <MapPin size={16} className="text-[#E5B800]" />
                  <span className="ml-2 text-sm">123 Healthcare Avenue, Hyderabad</span>
                </div>
                <div className="flex items-center text-white/80">
                  <Phone size={16} className="text-[#E5B800]" />
                  <span className="ml-2 text-sm">+91 98765-43210</span>
                </div>
                <div className="flex items-center text-white/80">
                  <Mail size={16} className="text-[#E5B800]" />
                  <span className="ml-2 text-sm">info@avdiagnostics.com</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <span className="px-3 py-1 bg-[#E5B800] text-white rounded-full text-sm font-medium">NABL Accredited</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-sm">24/7 Service</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link to={stat.path} key={index}>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border-t-4 border-t-[#E5B800] cursor-pointer">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <div className="text-white">{stat.icon}</div>
                </div>
                <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
                <p className="text-sm text-slate-500 mt-1">{stat.title}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Visits */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-t-[#0e1630]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800">Today's Schedule</h3>
              <Link to="/visits" className="text-[#E5B800] hover:text-[#0e1630] transition-colors text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {todayVisits.map((visit, index) => (
                <Link to={visit.path} key={index}>
                  <div className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border-l-4 border-[#E5B800] cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-800">{visit.name}</p>
                        <div className="flex items-center mt-1">
                          <Clock size={14} className="text-[#E5B800] mr-1" />
                          <p className="text-sm text-slate-500">{visit.time} - {visit.type}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        visit.status === 'Completed' ? 'bg-[#E5B800] text-white' :
                        visit.status === 'In Progress' || visit.status === 'Pending' ? 'bg-[#0e1630] text-white' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {visit.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-t-[#E5B800]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800">Recent Activity</h3>
              <Link to="/activities" className="text-[#E5B800] hover:text-[#0e1630] transition-colors text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <Link to={activity.path} key={index}>
                  <div className={`p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border-l-4 ${activity.border} cursor-pointer`}>
                    <div className="flex items-center">
                      <div className={`${activity.bg} p-2 rounded-lg`}>
                        {activity.icon}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-slate-800">{activity.title}</p>
                        <p className="text-sm text-slate-500">{activity.description}</p>
                        <p className="text-xs text-[#E5B800] mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
