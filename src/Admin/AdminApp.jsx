import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "./Components/AdminSidebar";
import AdminHeader from "./Components/AdminHeader";
import AdminDashboard from "./Pages/AdminDashboard";
import ManageUsers from "./Pages/ManageUsers";
import ManageCourses from "./Pages/AllCourses";
import Reports from "./Pages/Reports";
import FAQ from "./Pages/FAQ";

// 🟢 Category Pages
import CategoryList from "./Pages/Category/CategoryList";
import AddCategory from "./Pages/Category/AddCategory";
import EditCategory from "./Pages/Category/EditCategory";
import Category from "./Pages/Category";
import CourseWithEnroll from "./Pages/CourseWithEnroll";

const AdminApp = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const admin = { name: "Admin User", role: "Administrator" };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const sidebarWidth = isCollapsed ? 80 : 250;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar
        admin={admin}
        onLogout={handleLogout}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        <AdminHeader admin={admin} onLogout={handleLogout} />

        <div className="p-6 mt-[60px]">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/All-courses" element={<ManageCourses />} />
            <Route path="/category/*" element={<Category />} />
            <Route path="/enrolle" element={<CourseWithEnroll />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminApp;
