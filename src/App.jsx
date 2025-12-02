import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CourseDetails from "./Pages/CourseDetails";

import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Courses from "./Pages/Courses";

import ProtectedRoute from "./Components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

// Sub-apps
import AdminApp from "./Admin/AdminApp";
import InstructorApp from "./Instructor/InstructorApp";

function AppWrapper() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const location = useLocation();

  // Hide navbar/footer on dashboards
  const hideBarPaths = ["/admin", "/instructor", "/profile"];
  const showBars = !hideBarPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const NAVBAR_HEIGHT = 80;

  return (
    <>
      {/* Toast */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* Navbar */}
      {showBars && (
        <Navbar
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          showRegister={showRegister}
          setShowRegister={setShowRegister}
        />
      )}

      {/* Pages */}
      <div style={{ paddingTop: showBars ? NAVBAR_HEIGHT : 0 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetails />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute role="admin">
                <AdminApp />
              </ProtectedRoute>
            }
          />

          {/* Instructor */}
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

      {/* Footer - Only user-side */}
      {showBars && <Footer />}

      {/* Auth Modals */}
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
