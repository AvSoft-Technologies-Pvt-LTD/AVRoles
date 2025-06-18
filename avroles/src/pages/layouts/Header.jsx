import React, { useState, useEffect } from "react";
import { Search, Bell, User, LogOut, Settings, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ModulesMenu from "../../components/microcomponents/ModulesMenu"; // adjust path if needed

const HeaderWithNotifications = () => {
  const [showDropdown, setShowDropdown] = useState(false), [notifications, setNotifications] = useState([]), [showNotifications, setShowNotifications] = useState(false), navigate = useNavigate(), user = JSON.parse(localStorage.getItem("user"));
  const getUserName = () => {
    if (!user) return null;
    switch (user?.userType?.toLowerCase()) {
      case "doctor": case "freelancer": return `Dr. ${user.firstName || "Sheetal"} ${user.lastName || "S. Shelke"}`;
      case "hospital": return user.hospitalName || "City Hospital";
      case "lab": return user.labName || "ABC Lab";
      case "pharmacy": return user.pharmacyName || "AV Pharmacy";
      case "patient": return `${user.firstName || "Anjali"} ${user.lastName || "Mehra"}`;
      case "superadmin": return `${user.firstName || "Dr.Shrinivas"} ${user.lastName || "Shelke"}`;
      default: return `${user.firstName || "Anjali"} ${user.lastName || "Mehra"}`;
    }
  };
  const getRoleLabel = () => {
    if (!user) return null;
    switch (user?.userType?.toLowerCase()) {
      case "doctor": return "Hospital-Associated Doctor";
      case "freelancer": return "Freelancer Doctor";
      case "hospital": return "Hospital Admin";
      case "pharmacy": return "Pharmacy Manager";
      case "lab": return "Lab Technician";
      case "patient": return "Patient";
      case "superadmin": return "Super Admin";
      default: return "User";
    }
  };
  const userName = getUserName(), roleLabel = getRoleLabel();
  const fetchNotifications = async () => {
    try {
      const res = await axios.get('https://67e631656530dbd3110f0322.mockapi.io/drnotifiy');
      const sorted = res.data.map(n => ({ ...n, unread: n.unread ?? true, message: n.message || "You have a new notification" })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sorted);
    } catch (err) { console.error('Fetch error:', err); }
  };
  useEffect(() => {
    fetchNotifications(); const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);
  const unreadCount = notifications.filter(n => n.unread).length, displayNotifications = notifications.slice(0, 2);
  const getTimeAgo = (time) => {
    const diff = (Date.now() - new Date(time)) / 1000;
    if (diff < 60) return 'Just now'; if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`;
  };
  return (
    <nav className="sticky top-0 mt-2 z-50 bg-gray-50 py-2 mx-4 shadow-md rounded-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {userName && roleLabel && (
            <div className="flex items-start px-4 py-2">
              <h2 className="text-[var(--primary-color)] font-bold text-xl">{userName} / {roleLabel}</h2>
            </div>
          )}
          <div className="flex items-center space-x-4 text-[#021630]">
            {/* Show ModulesMenu and TeleConsultModal only for doctor */}
            {user?.userType?.toLowerCase() === "doctor" && (
              <>
                <ModulesMenu />
                
              </>
            )}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative group">
                <Bell className="h-6 w-6 group-hover:text-[var(--accent-color)] cursor-pointer" />
                {unreadCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 text-xs rounded-full flex items-center justify-center">{unreadCount}</span>}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-[24rem] bg-white rounded-2xl shadow-2xl border max-h-[80vh] overflow-y-auto z-50">
                  <div className="sticky top-0 bg-[var(--primary-color)] px-5 py-4 border-b flex justify-between items-center rounded-t-2xl">
                    <h3 className="text-lg font-bold text-white">Notifications</h3>
                    {notifications.length > 2 && (<Link to="/dashboard/notifications" onClick={() => setShowNotifications(false)} className="text-sm text-[var(--accent-color)] hover:underline">View All</Link>)}
                  </div>
                  {displayNotifications.length === 0 ? (<div className="px-5 py-6 text-center text-gray-500 text-sm">You're all caught up 🎉</div>) :
                    displayNotifications.map(n => (
                      <div key={n.id} onClick={() => setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, unread: false } : notif))} className={`group px-5 py-4 border-b cursor-pointer transition ${n.unread ? 'bg-[var(--accent-color)]/20' : 'bg-white'} hover:bg-[var(--accent-color)]/10`}>
                        <div className="flex justify-between gap-3">
                          <div className="flex-1"><p className="text-sm">{n.message}</p><span className="text-xs text-gray-500 block mt-1">{getTimeAgo(n.createdAt)}</span></div>
                          {n.unread && <div className="w-2 h-2 mt-1 bg-[var(--accent-color)] rounded-full group-hover:opacity-80" />}
                        </div>
                        {n.showPayButton && (<button onClick={e => { e.stopPropagation(); console.log("Pay now clicked for", n.id); }} className="mt-3 bg-[var(--accent-color)] hover:bg-[#E0B320] text-[var(--primary-color)] text-xs px-4 py-1.5 rounded-full">Pay Now</button>)}
                      </div>
                    ))}
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default HeaderWithNotifications;