// App.jsx
import { useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home.jsx";
import AdminDashboard from "./Admin/Pages/AdminDashboard.jsx";
import InstructorDashboard from "./Instructor/Pages/InstructorDashboard.jsx";
import Profile from "./Pages/Profile.jsx";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import { Toaster } from "react-hot-toast";

function AppWrapper() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const location = useLocation();

  // Pages where Navbar should be hidden
  const hideNavbarPaths = ["/admin", "/instructor", "/profile"];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  // Navbar height for padding
  const NAVBAR_HEIGHT = 80; // matches h-20 (20*4=80px)

  return (
    <>
      {/* Navbar */}
      {showNavbar && (
        <Navbar
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          showRegister={showRegister}
          setShowRegister={setShowRegister}
        />
      )}

      {/* Main Content */}
      <div style={{ paddingTop: showNavbar ? NAVBAR_HEIGHT : 0 }}>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Home />} />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Instructor Dashboard */}
          <Route
            path="/instructor"
            element={
              <ProtectedRoute role="instructor">
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          {/* User Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

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

      {/* Toasts */}
      <Toaster position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
