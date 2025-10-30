import React, { useState, useEffect } from "react";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import { FaBell } from "react-icons/fa";
import { useAuth } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import NavItems from "../utils/NavItems";
import Login from "../Pages/Login";
import Register from "../Pages/Register";

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // <-- new state

  const [user, setUser] = useAuth();
  const navigate = useNavigate();

  // Scroll effect for shadow
  useEffect(() => {
    const handleScroll = () => setActive(window.scrollY > 85);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch profile image whenever user changes
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!user) return;
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

    fetchProfileImage();
  }, [user]);

  // Close sidebar on overlay click
  const handleSidebarClose = (e) => {
    if (e.target.id === "overlay") setOpenSidebar(false);
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setUserDropdown(false);
      navigate("/"); // Redirect to home after logout
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Redirect to dashboard based on role
  const handleDashboardRedirect = () => {
    if (user.role === "Admin") navigate("/admin");
    else if (user.role === "Instructor") navigate("/instructor");
    else navigate("/profile");
    setUserDropdown(false);
    setOpenSidebar(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className={`w-full top-0 fixed z-50 bg-white transition-all ${
          active ? "shadow-lg" : "shadow-md"
        }`}
      >
        <div className="w-[95%] 800px:w-[90%] mx-auto flex items-center justify-between h-20 px-4 text-black">
          {/* Logo */}
          <div
            className="text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            ELearning
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <NavItems isMobile={false} />
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            {/* Notification Icon */}
            <div className="relative cursor-pointer">
              <FaBell size={22} />
              <span className="absolute top-0 right-0 w-5 h-5 text-xs flex items-center justify-center rounded-full bg-green-500 text-white">
                0
              </span>
            </div>

            {/* User Dropdown */}
            <div className="relative">
              {user ? (
                <div
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="w-10 h-10 rounded-full cursor-pointer overflow-hidden"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-black text-white flex items-center justify-center font-bold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              ) : (
                <HiOutlineUserCircle
                  size={28}
                  className="cursor-pointer"
                  onClick={() => setUserDropdown(!userDropdown)}
                />
              )}

              {userDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-xl shadow-lg flex flex-col z-50">
                  {user ? (
                    <>
                      {(user.role === "Admin" || user.role === "Instructor") && (
                        <button
                          className="px-4 py-2 text-left hover:bg-gray-100"
                          onClick={handleDashboardRedirect}
                        >
                          {user.role === "Admin"
                            ? "Admin Dashboard"
                            : "Instructor Dashboard"}
                        </button>
                      )}

                      <button
                        className="px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => {
                          navigate("/profile");
                          setUserDropdown(false);
                        }}
                      >
                        Profile
                      </button>

                      <button
                        className="px-4 py-2 text-left hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => {
                          setShowLogin(true);
                          setUserDropdown(false);
                        }}
                      >
                        Login
                      </button>
                      <button
                        className="px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => {
                          setShowRegister(true);
                          setUserDropdown(false);
                        }}
                      >
                        Register
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden">
              <HiOutlineMenuAlt3
                size={28}
                className="cursor-pointer"
                onClick={() => setOpenSidebar(true)}
              />
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {openSidebar && (
          <div
            id="overlay"
            className="fixed inset-0 bg-black/30 z-50 flex justify-end"
            onClick={handleSidebarClose}
          >
            <div className="w-[70%] h-full bg-white p-6 flex flex-col gap-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setOpenSidebar(false)}
                  className="text-black font-bold text-xl"
                >
                  ✕
                </button>
              </div>

              {user && (user.role === "Admin" || user.role === "Instructor") && (
                <button
                  className="px-4 py-2 hover:bg-gray-100 rounded-lg text-black"
                  onClick={handleDashboardRedirect}
                >
                  {user.role === "Admin"
                    ? "Admin Dashboard"
                    : "Instructor Dashboard"}
                </button>
              )}

              <NavItems isMobile={true} />

              <div className="mt-auto text-black">
                <p className="text-sm">© 2025 ELearning</p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <Login
          closeModal={() => setShowLogin(false)}
          openRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

      {/* Register Modal */}
      {showRegister && (
        <Register
          closeModal={() => setShowRegister(false)}
          openLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
};

export default Navbar;
