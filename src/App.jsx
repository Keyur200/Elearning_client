import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ProtectedRoute from "./Components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

// Import sub-apps
import AdminApp from "./Admin/AdminApp";
import InstructorApp from "./Instructor/InstructorApp";

function AppWrapper() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const location = useLocation();

  // Hide navbar on dashboards
  const hideNavbarPaths = ["/admin", "/instructor", "/profile"];
  const showNavbar = !hideNavbarPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const NAVBAR_HEIGHT = 80;

  return (
    <>
      {/* Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Navbar */}
      {showNavbar && (
        <Navbar
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          showRegister={showRegister}
          setShowRegister={setShowRegister}
        />
      )}

      {/* Page Content */}
      <div style={{ paddingTop: showNavbar ? NAVBAR_HEIGHT : 0 }}>
        <Routes>
          {/* 🏠 Public/User Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 🧑‍💼 Admin Sub-App */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute role="admin">
                <AdminApp />
              </ProtectedRoute>
            }
          />

          {/* 🧑‍🏫 Instructor Sub-App */}
          <Route
            path="/instructor/*"
            element={
              <ProtectedRoute role="instructor">
                <InstructorApp />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* Modals */}
      {showLogin && (
        <Login
          closeModal={() => setShowLogin(false)}
          openRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}

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
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
