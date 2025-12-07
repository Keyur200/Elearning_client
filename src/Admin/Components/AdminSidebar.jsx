import React, { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  FaHome,
  FaUsers,
  FaBookOpen,
  FaChartBar,
  FaSignOutAlt,
  FaQuestionCircle,
  FaChevronLeft,
  FaChevronRight,
  FaLayerGroup,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../styles/AdminSidebar.css";

const AdminSidebar = ({ admin, isCollapsed, setIsCollapsed }) => {
  const [selected, setSelected] = useState("Dashboard");
  const [profileImage, setProfileImage] = useState(null); // <-- Profile image state

  const firstLetter = admin?.name ? admin.name.charAt(0).toUpperCase() : "A";

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/admin" },
    { name: "Manage Users", icon: <FaUsers />, path: "/admin/manage-users" },
    { name: "All Courses", icon: <FaBookOpen />, path: "/admin/All-courses" },
    { name: "Category", icon: <FaLayerGroup />, path: "/admin/category" },
    { name: "All Course with Enrolls", icon: <FaChartBar />, path: "/admin/enrolle" },
    // { name: "Reports", icon: <FaChartBar />, path: "/admin/reports" },
    // { name: "FAQ", icon: <FaQuestionCircle />, path: "/admin/faq" },
  ];

  // Fetch admin profile image dynamically
  useEffect(() => {
    const fetchProfile = async () => {
      if (!admin) return;
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setProfileImage(data.image || null);
      } catch (err) {
        console.error("Failed to fetch profile image", err);
      }
    };
    fetchProfile();
  }, [admin]);

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
        backgroundColor: "#fff",
        boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        transition: "width 0.3s ease",
      }}
    >
      <Sidebar collapsed={isCollapsed} backgroundColor="#fff">
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

          {/* Admin Profile */}
          {!isCollapsed && (
            <div className="text-center mb-5 text-black">
              <div
                className="mx-auto flex items-center justify-center rounded-full border-4 border-black w-20 h-20 bg-gray-200 overflow-hidden"
                style={{ color: "#000" }}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Admin"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold">{firstLetter}</span>
                )}
              </div>
              <h3 className="mt-2 text-base font-semibold">
                {admin?.name || "Admin"}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {admin?.role || "Administrator"}
              </p>
            </div>
          )}

          {/* Menu Items */}
          {menuItems.map((item) => (
            <Link key={item.name} to={item.path} style={{ textDecoration: "none" }}>
              <MenuItem
                icon={item.icon}
                active={selected === item.name}
                onClick={() => setSelected(item.name)}
                style={{
                  color: "#000",
                  fontWeight: selected === item.name ? "bold" : "normal",
                  backgroundColor: selected === item.name ? "rgba(0,0,0,0.05)" : "transparent",
                }}
              >
                {item.name}
              </MenuItem>
            </Link>
          ))}

          {/* Logout */}
          <MenuItem
            icon={<FaSignOutAlt color="#000" />}
            onClick={handleLogout}
            style={{ color: "#000", marginTop: "20px" }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default AdminSidebar;
