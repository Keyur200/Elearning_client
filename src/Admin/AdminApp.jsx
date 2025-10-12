import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "./Components/AdminSidebar";
import AdminHeader from "./Components/AdminHeader";
import AdminDashboard from "./Pages/AdminDashboard";
import ManageUsers from "./Pages/ManageUsers";
import ManageCourses from "./Pages/ManageCourses";
import Reports from "./Pages/Reports";
import FAQ from "./Pages/FAQ";

const AdminApp = () => {
  const admin = {
    name: "Admin User",
    role: "Administrator",
    // avatar: "/images/admin.jpg", // optional
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar admin={admin} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 ml-[250px]">
        {/* Header */}
        <AdminHeader admin={admin} onLogout={handleLogout} />

        {/* Page Content */}
        <div className="p-6 mt-[60px]"> {/* mt-[60px] to push below header */}
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/manage-courses" element={<ManageCourses />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminApp;
