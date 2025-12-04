import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, AlertCircle, User as UserIcon } from "lucide-react";

import VideoPlayer from "../Components/enrolled/VideoPlayer";
import CoursePlaylist from "../Components/enrolled/CoursePlaylist";
import CommentSection from "../Components/enrolled/CommentSection";
import CourseHeader from "../Components/enrolled/CourseHeader";

// Assuming these are your existing API functions
import { getEnrolledCourse, markVideoComplete } from "../api/enrollmentApi";
import { useAuth } from "../Context/UserContext";

const EnrolledCourse = () => {
  const { id } = useParams();
  const { user } = useAuth(); // Logged-in user

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [progress, setProgress] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // ───────────────────────────────────────────
  // Fetch profile image for logged-in user
  // ───────────────────────────────────────────
// ───────────────────────────────────────────
// Fetch profile image for logged-in user
// ───────────────────────────────────────────
useEffect(() => {
  const fetchProfileImage = async () => {
    if (!user) return;
    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        credentials: "include",
      });
      if (!res.ok) return;

      const data = await res.json();
      // data.image contains the profile image URL
      // data.userId contains the logged-in user info from DB
      if (data.userId && data.userId._id === user._id) {
        setProfileImage(data.image || null);
      }
    } catch (err) {
      console.error("Failed to fetch profile image", err);
    }
  };

  fetchProfileImage();
}, [user]);

  // ───────────────────────────────────────────
  // Load enrolled course
  // ───────────────────────────────────────────
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const data = await getEnrolledCourse(id);

        setCourse(data.course);
        setSections(data.sections || []);
        setProgress(data.progress);

        // Set initial video if available
        if (data.sections?.length > 0 && data.sections[0].videos?.length > 0) {
          setActiveVideo(data.sections[0].videos[0]);
        }
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // ───────────────────────────────────────────
  // Mark video complete
  // ───────────────────────────────────────────
  const handleVideoComplete = async (video) => {
    if (!video?._id) return;
    try {
      const data = await markVideoComplete(video._id);
      // Update progress state with new percentage from backend
      setProgress(data.progress);
    } catch (err) {
      console.error("Error marking video complete:", err);
    }
    handleNextVideo();
  };

  // ───────────────────────────────────────────
  // Auto-play next video logic
  // ───────────────────────────────────────────
  const handleNextVideo = () => {
    if (!activeVideo || !sections.length) return;

    for (let secIndex = 0; secIndex < sections.length; secIndex++) {
      const sec = sections[secIndex];
      for (let vidIndex = 0; vidIndex < sec.videos.length; vidIndex++) {
        // Find current video
        if (sec.videos[vidIndex]._id === activeVideo._id) {
          // Check for next video in SAME section
          if (sec.videos[vidIndex + 1]) {
            setActiveVideo(sec.videos[vidIndex + 1]);
            return;
          }
          // Check for first video in NEXT section
          if (sections[secIndex + 1]?.videos?.[0]) {
            setActiveVideo(sections[secIndex + 1].videos[0]);
            return;
          }
        }
      }
    }
  };

  // ───────────────────────────────────────────
  // Helper: Get user avatar (for comments/playlist UI)
  // ───────────────────────────────────────────
const getUserAvatar = (u) => {
  // If it's the logged-in user, use the fetched profileImage
  if (u?._id === user?._id && profileImage) {
    return (
      <img
        src={profileImage}
        alt={u?.name || "User"}
        className="w-full h-full object-cover"
      />
    );
  }

  // Other user profile image (from comments or sections)
  if (u?.profileImage) {
    return (
      <img
        src={u.profileImage}
        alt={u?.name || "User"}
        className="w-full h-full object-cover"
      />
    );
  }

  // Fallback to first letter
  if (u?.name) {
    return (
      <div className="w-full h-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">
        {u.name.charAt(0)}
      </div>
    );
  }

  return <UserIcon size={20} className="text-slate-500 p-1" />;
};

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 text-indigo-600">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-medium">Loading your course...</p>
      </div>
    );

  if (!course)
    return (
      <div className="h-screen flex flex-col items-center justify-center text-red-500 bg-slate-50">
        <AlertCircle size={48} className="mb-4" />
        <p className="text-xl font-bold">Course not found</p>
      </div>
    );

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header receives:
         - Title
         - User object merged with the fetched profile image
         - Progress percentage for the bar
      */}
      <CourseHeader
        title={course.title}
        user={{
          ...user,
          profileImage: profileImage,
        }}
        progress={progress?.percentage || 0}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
          <div className="max-w-5xl mx-auto">
            
            {/* Video Player */}
            <div className="bg-black w-full aspect-video shadow-lg relative">
              <VideoPlayer 
                video={activeVideo} 
                onComplete={() => handleVideoComplete(activeVideo)} 
              />
            </div>

            {/* Video Details & Comments */}
            <div className="p-4 md:p-6 pb-20">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
                {activeVideo?.title || "Select a video"}
              </h2>

              <p className="text-sm md:text-base text-slate-500 mb-8 pb-8 border-b border-slate-200">
                {activeVideo?.description || `Lesson from section: ${course.title}`}
              </p>

              <CommentSection
                videoId={activeVideo?._id}
                user={user}
                reviews={activeVideo?.reviews}
                isInstructor={user?.role === "instructor"}
                getAvatar={getUserAvatar}
              />
            </div>
          </div>
        </div>

        {/* Sidebar / Playlist */}
        <CoursePlaylist
          sections={sections}
          activeVideoId={activeVideo?._id}
          onSelect={setActiveVideo}
          progress={progress}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
    </div>
  );
};

export default EnrolledCourse;