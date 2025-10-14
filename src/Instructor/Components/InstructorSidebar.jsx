import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaQuestionCircle,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../styles/InstructorSidebar.css";

const InstructorSidebar = ({ instructor, onLogout, isCollapsed, setIsCollapsed }) => {
  const [selected, setSelected] = React.useState("Dashboard");

  const firstLetter = instructor?.name
    ? instructor.name.charAt(0).toUpperCase()
    : "I";

  // Sidebar Menu Items
  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/instructor" },
    { name: "My Courses", icon: <FaBookOpen />, path: "/instructor/my-courses" },
    { name: "Create Course", icon: <FaChalkboardTeacher />, path: "/instructor/create-course" },
    { name: "Students", icon: <FaUserGraduate />, path: "/instructor/students" },
    { name: "FAQ", icon: <FaQuestionCircle />, path: "/instructor/faq" },
    { name: "Settings", icon: <FaCog />, path: "/instructor/settings" },
  ];

  return (
    <div
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
        backgroundColor: "#fff",
        boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
        transition: "width 0.3s ease",
      }}
    >
      <Sidebar collapsed={isCollapsed} backgroundColor="#ffffff">
        <Menu>
          {/* Collapse Toggle */}
          <MenuItem
            icon={
              isCollapsed ? (
                <FaChevronRight color="#000" />
              ) : (
                <FaChevronLeft color="#000" />
              )
            }
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ color: "#000", margin: "10px 0 20px 0" }}
          >
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-black text-center">
                Instructor
              </h2>
            )}
          </MenuItem>

          {/* Instructor Profile */}
          {!isCollapsed && (
            <div className="text-center mb-5 text-black">
              <div
                className="mx-auto flex items-center justify-center rounded-full border-4 border-black w-20 h-20 text-3xl font-bold bg-gray-200"
                style={{ color: "#000" }}
              >
                {firstLetter}
              </div>
              <h3 className="mt-2 text-base font-semibold">
                {instructor?.name || "Instructor"}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {instructor?.role || "Instructor"}
              </p>
            </div>
          )}

          {/* Menu Links */}
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={{ textDecoration: "none" }}
            >
              <MenuItem
                icon={item.icon}
                active={selected === item.name}
                onClick={() => setSelected(item.name)}
                style={{
                  color: "#000",
                  fontWeight: selected === item.name ? "bold" : "normal",
                  backgroundColor:
                    selected === item.name ? "rgba(0,0,0,0.05)" : "transparent",
                }}
              >
                {item.name}
              </MenuItem>
            </Link>
          ))}

          {/* Logout */}
          <MenuItem
            icon={<FaSignOutAlt color="#000" />}
            onClick={onLogout}
            style={{ color: "#000", marginTop: "20px" }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default InstructorSidebar;
