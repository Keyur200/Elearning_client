import React from "react";
import { Routes, Route } from "react-router-dom";
import InstructorSidebar from "./Components/InstructorSidebar";
import InstructorHeader from "./Components/InstructorHeader";
import InstructorDashboard from "./Pages/InstructorDashboard";
import CreateCourse from "./Pages/CreateCourse";
import MyCourses from "./Pages/MyCourses";
import Students from "./Pages/Students";
import FAQ from "./Pages/FAQ";
import Settings from "./Pages/Settings";

const InstructorApp = () => {
  const instructor = {
    name: "John Doe",
    role: "Instructor",
    // avatar: "/images/instructor.jpg", // optional
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <InstructorSidebar instructor={instructor} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 ml-[250px]">
        {/* Header */}
        <InstructorHeader instructor={instructor} onLogout={handleLogout} />

        {/* Page Content */}
        <div className="p-6 mt-[60px]"> {/* mt-[60px] to push below header */}
          <Routes>
            <Route path="/" element={<InstructorDashboard />} />
            <Route path="/create-course" element={<CreateCourse />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/students" element={<Students />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default InstructorApp;
