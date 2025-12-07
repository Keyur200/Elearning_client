import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CourseDetails from "./Pages/CourseDetails";
import EnrolledCourse from "./Pages/EnrolledCourse";
// import Certificate from "./Pages/Certificate"; // 🟢 Import Certificate

import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Courses from "./Pages/Courses";
import FAQ from "./Pages/FAQ"; // 🟢 Import FAQ

import ProtectedRoute from "./Components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

// Sub-apps
import AdminApp from "./Admin/AdminApp";
import InstructorApp from "./Instructor/InstructorApp";

function AppWrapper() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const location = useLocation();

  // Hide navbar/footer on dashboards AND certificate page
  const hideBarPaths = ["/admin", "/instructor", "/profile", "/certificate"]; // 🟢 Added /certificate
  const showBars = !hideBarPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  const NAVBAR_HEIGHT = 80;

  return (
    <div className="flex flex-col min-h-screen">
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
      <main
        className="flex-1 overflow-auto"
        style={{ paddingTop: showBars ? NAVBAR_HEIGHT : 0 }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} /> {/* 🟢 FAQ Route */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetails />} />

          {/* Protected Routes */}
          <Route 
            path="/enrolled-course/:id" 
            element={
              <ProtectedRoute>
                <EnrolledCourse />
              </ProtectedRoute>
            } 
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 🟢 Certificate Route
          <Route
            path="/certificate"
            element={
              <ProtectedRoute>
                <Certificate />
              </ProtectedRoute>
            }
          /> */}

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
      </main>

      {/* Footer */}
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
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}