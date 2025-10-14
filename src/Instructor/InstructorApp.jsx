import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import InstructorSidebar from "./Components/InstructorSidebar";
import InstructorHeader from "./Components/InstructorHeader";
import InstructorDashboard from "./Pages/InstructorDashboard";
import CreateCourse from "./Pages/CreateCourse";
import MyCourses from "./Pages/MyCourses";
import Students from "./Pages/Students";
import FAQ from "./Pages/FAQ";
import Settings from "./Pages/Settings";
import AddVideo from "./Pages/AddVideo"; // <-- import AddVideo page
import PreviewCourse from "./Pages/PreviewCourse";

const InstructorApp = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const instructor = { name: "John Doe", role: "Instructor" };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const sidebarWidth = isCollapsed ? 80 : 250;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <InstructorSidebar
        instructor={instructor}
        onLogout={handleLogout}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Section */}
      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Header */}
        <InstructorHeader
          instructor={instructor}
          onLogout={handleLogout}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Page Content */}
        <div className="p-6 mt-[60px]">
          <Routes>
            <Route path="/" element={<InstructorDashboard />} />
            <Route path="/create-course" element={<CreateCourse />} />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/students" element={<Students />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* New route for adding videos to a course */}
            <Route path="/add-video/:courseId" element={<AddVideo />} />
            <Route path="/preview-course/:courseId" element={<PreviewCourse />} />

          </Routes>
        </div>
      </div>
    </div>
  );
};

export default InstructorApp;
