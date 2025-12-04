import React, { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/InstructorHeader.css"; // Can rename to Header.css

const AdminHeader = ({ admin }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  const firstLetter = admin?.name ? admin.name.charAt(0).toUpperCase() : "A";

  // Fetch admin profile image
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

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/notifications", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      localStorage.removeItem("user"); // remove token or user info

      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/";
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) setNotifOpen(false);
  };

  const toggleNotif = () => {
    setNotifOpen(!notifOpen);
    if (!notifOpen) setDropdownOpen(false);
  };

  // Delete notification
  const handleDeleteNotification = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  return (
    <header
      className="admin-header"
      style={{
        height: "60px",
        width: "100%",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 999,
      }}
    >
      {/* Notification Icon */}
      <div
        ref={notifRef}
        style={{ marginRight: "20px", position: "relative", cursor: "pointer" }}
        onClick={toggleNotif}
      >
        <FaBell size={20} color="#000" />
        {notifications.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              width: "10px",
              height: "10px",
              backgroundColor: "red",
              borderRadius: "50%",
            }}
          />
        )}

        {notifOpen && (
          <div
            style={{
              position: "absolute",
              top: "25px",
              right: 0,
              width: "250px",
              maxHeight: "300px",
              overflowY: "auto",
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              borderRadius: "5px",
              zIndex: 1000,
              padding: "10px",
            }}
          >
            {notifications.length === 0 ? (
              <p className="text-black text-sm">No new notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "5px 0",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <span className="text-sm text-black">{n.message || "Notification"}</span>
                  <button
                    onClick={() => handleDeleteNotification(n._id)}
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      cursor: "pointer",
                      border: "none",
                      background: "transparent",
                    }}
                  >
                    X
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Admin Avatar + Name */}
      <div
        ref={dropdownRef}
        className="admin-dropdown"
        style={{ position: "relative", cursor: "pointer" }}
        onClick={toggleDropdown}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              overflow: "hidden",
              backgroundColor: "#2563eb",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Admin"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{firstLetter}</span>
            )}
          </div>
          <span style={{ color: "#000", fontWeight: 500 }}>
            {admin?.name || "Admin"}
          </span>
        </div>

        {dropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "45px",
              right: 0,
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              borderRadius: "5px",
              overflow: "hidden",
              width: "180px",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                padding: "10px",
                cursor: "pointer",
                color: "#000",
                borderBottom: "1px solid #e5e7eb",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f3f4f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#fff")
              }
              onClick={() => navigate("/profile")}
            >
              Profile
            </div>
            <div
              onClick={handleLogout}
              style={{
                padding: "10px",
                cursor: "pointer",
                color: "#000",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f3f4f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#fff")
              }
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
