import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import AboutUs from "./Pages/AboutUs";
import Courses from "./Pages/Courses";
import Resources from "./Pages/Resources";
import SupportCenter from "./Pages/SupportCenter";

import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ProtectedRoute from "./Components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

// Import sub-apps
import AdminApp from "./Admin/AdminApp";
import InstructorApp from "./Instructor/InstructorApp";
import CourseDetails from "./Pages/CourseDetails";

function AppWrapper() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const location = useLocation();

  // ⛔ Hide Navbar AND Footer on dashboard pages  
  // ---- UPDATED LINE ----
  const hideUIPaths = ["/admin", "/instructor", "/profile"];

  // ---- UPDATED LINE ----
  const showUI = !hideUIPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const NAVBAR_HEIGHT = 80;

  return (
    <>
      {/* Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* ✅ SHOW NAVBAR ONLY IF ALLOWED — UPDATED */}
      {showUI && (
        <Navbar
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          showRegister={showRegister}
          setShowRegister={setShowRegister}
        />
      )}

      {/* Page Content — Adjusted padding when navbar is visible */}
      <div
        style={{
          minHeight: "80vh", // ✅ Ensures footer stays bottom of page
          paddingTop: showUI ? NAVBAR_HEIGHT : 0,
        }}
      >
        <Routes>
          {/* 🏠 Public/User Routes */}
          <Route path="/" element={<Home />} />

          {/* AboutUs Page Route */}
          <Route path="/AboutUs" element={<AboutUs />} />

          {/* Courses Page Route */}
          <Route path="/Courses" element={<Courses />} />

          {/* Resources Page Route */}
          <Route path="/Resources" element={<Resources />} />

          {/* SupportCenter Page Route */}
          <Route path="/SupportCenter" element={<SupportCenter />} />

          <Route path="/course/:id" element={<CourseDetails />} />

          {/* User Profile */}
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

      {/* Login & Register Modals */}
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

      {/* ✅ SHOW FOOTER ONLY IF ALLOWED — UPDATED */}
      {showUI && <Footer />} {/* <-- FOOTER NOW HIDDEN ON DASHBOARDS */}
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
