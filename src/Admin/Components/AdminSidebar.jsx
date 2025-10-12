import React, { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  FaHome,
  FaUsers,
  FaBookOpen,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaQuestionCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../styles/AdminSidebar.css";

const AdminSidebar = ({ admin }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const firstLetter = admin?.name
    ? admin.name.charAt(0).toUpperCase()
    : "A";

  // Menu Items
  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/admin" },
    { name: "Manage Users", icon: <FaUsers />, path: "/admin/manage-users" },
    { name: "Manage Courses", icon: <FaBookOpen />, path: "/admin/manage-courses" },
    { name: "Reports", icon: <FaChartBar />, path: "/admin/reports" },
    { name: "FAQ", icon: <FaQuestionCircle />, path: "/admin/faq" },
  ];

  // Logout function
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
        backgroundColor: "#ffffff",
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Sidebar collapsed={isCollapsed} backgroundColor="#ffffff">
        <Menu>
          {/* Collapse Toggle */}
          <MenuItem
            icon={isCollapsed ? <FaChevronRight color="#000" /> : <FaChevronLeft color="#000" />}
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ color: "#000", margin: "10px 0 20px 0" }}
          >
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-black text-center">
                Admin
              </h2>
            )}
          </MenuItem>

          {/* Profile Section */}
          {!isCollapsed && (
            <div className="text-center mb-5 text-black">
              <div
                className="mx-auto flex items-center justify-center rounded-full border-4 border-black w-20 h-20 text-3xl font-bold bg-gray-200"
                style={{ color: "#000" }}
              >
                {firstLetter}
              </div>
              <h3 className="mt-2 text-base font-semibold">
                {admin?.name || "Admin"}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {admin?.role || "Administrator"}
              </p>
            </div>
          )}

          {/* Dynamic Menu Items */}
          {menuItems.map((item) => (
            <Link key={item.name} to={item.path} style={{ textDecoration: "none" }}>
              <MenuItem
                icon={item.icon}
                active={selected === item.name}
                onClick={() => setSelected(item.name)}
                style={{ color: "#000" }}
              >
                {item.name}
              </MenuItem>
            </Link>
          ))}

          {/* Logout */}
          <MenuItem
            icon={<FaSignOutAlt color="#000" />}
            onClick={handleLogout}
          >
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default AdminSidebar;
