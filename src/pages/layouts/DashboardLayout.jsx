
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header"
const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex flex-col py-4">
      <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
      <Header/>
      <div className="flex-1 px-6  rounded-lg overflow-auto h-screen">
        <Outlet /> 
      </div>
    </div>
    </div>
  );
};
export default DashboardLayout;
