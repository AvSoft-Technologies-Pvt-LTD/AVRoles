import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
// Public Pages
import Login from "./form/Login";
import RegisterSelect from "./form/RegisterSelect";
import Registration from "./form/Registration";
import Verification from "./form/Verification";
import Healthcard from "./components/Healthcard";
import BookApp from "./components/BookApp";
import Home from "./pages/Home";
// Dashboard Layout
import DashboardLayout from "./pages/layouts/DashboardLayout";
import Overview from "./pages/layouts/menu/DoctorDashboard/Overview";
import LabRoutes from "./pages/layouts/menu/LabDashboard/Ldroutes";
import Dashboard from "./pages/layouts/menu/LabDashboard/LabDashboard";
// Hospital Routing
import HospitalRoutes from "./pages/layouts/menu/HospitalDashboard/Hdroutes";
import AdminRoutes from "./pages/layouts/menu/SuperAdminDashboard/AdminRoute";
import AdminDashboard from "./pages/layouts/menu/SuperAdminDashboard/Dashboard";
import HospitalDashboard from "./pages/layouts/menu/HospitalDashboard/Dashboard";
import DrRoutes from "./pages/layouts/menu/DoctorDashboard/DrRoutes";
// Simulated localStorage-based auth
const getUser  = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
const PrivateRoute = ({ allowedType }) => {
  const user = getUser ();
  if (!user) return <Navigate to="/login" />;
  if (allowedType && user.userType !== allowedType) {
    return <Navigate to="/redirect" />;
  }
  return <Outlet />;
};
const RoleRedirect = () => {
  const user = getUser ();
  if (!user) return <Navigate to="/login" />;
  switch (user.userType) {
    case "doctor":
      return <Navigate to="/doctordashboard" />;
    case "lab":
      return <Navigate to="/labdashboard" />;
    case "hospital":
      return <Navigate to="/hospitaldashboard" />;
    case "freelancer":
      return <Navigate to="/freelancerdashboard" />;
      case "superadmin":
        return <Navigate to="/superadmindashboard" />;
    default:
      return <Navigate to="/" />;
  }
};
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterSelect />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/login" element={<Login />} />
        <Route path="/healthcard" element={<Healthcard />} />
        <Route path="/bookconsultation" element={<BookApp />} />
        {/* Role Redirect */}
        <Route path="/redirect" element={<RoleRedirect />} />
        {/* Doctor Dashboard */}
        <Route element={<PrivateRoute allowedType="doctor" />}>
          <Route path="/doctordashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} /> {/* /doctordashboard */}
            <Route path="*" element={<DrRoutes />} />
          </Route>
        </Route>
        {/* Lab Dashboard */}
        <Route element={<PrivateRoute allowedType="lab" />}>
          <Route path="/labdashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="*" element={<LabRoutes />} />
          </Route>
        </Route>
        {/* Hospital Dashboard */}
        <Route element={<PrivateRoute allowedType="hospital" />}>
          <Route path="/hospitaldashboard" element={<DashboardLayout />}>
            <Route index element={<HospitalDashboard/>} />
            <Route path="*" element={<HospitalRoutes />} />
          </Route>
        </Route>
        <Route element={<PrivateRoute allowedType="superadmin" />}>
  <Route path="/superadmindashboard" element={<DashboardLayout />}>
    <Route index element={<AdminDashboard/>} />
    <Route path="*" element={<AdminRoutes />} />
  </Route>
</Route>
        {/* Catch All */}
        <Route path="*" element ={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};
export default App;