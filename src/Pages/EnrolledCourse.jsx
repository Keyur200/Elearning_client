import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";

import VideoPlayer from "../Components/enrolled/VideoPlayer";
import CoursePlaylist from "../Components/enrolled/CoursePlaylist";
import CommentSection from "../Components/enrolled/CommentSection";
import CourseHeader from "../Components/enrolled/CourseHeader";
import { getEnrolledCourse } from "../api/enrollmentApi";

const useAuth = () => [{ _id: "user_123", name: "Demo Student" }];

const EnrolledCourse = () => {
  const { id } = useParams();
  const [user] = useAuth();

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]); // Changed from 'videos' to 'sections'
  const [progress, setProgress] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const data = await getEnrolledCourse(id);
        
        setCourse(data.course);
        setSections(data.sections || []);
        setProgress(data.progress);

        // Auto-select the first video of the first section if activeVideo is null
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
      <CourseHeader
        title={course.title}
        user={user}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
          <div className="max-w-5xl mx-auto">
            {/* Video Container - Relative positioning so it scrolls */}
            <div className="bg-black w-full aspect-video shadow-lg relative">
              <VideoPlayer
                video={activeVideo}
                onComplete={() => console.log("Video Completed")}
              />
            </div>

            <div className="p-4 md:p-6 pb-20">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
                {activeVideo?.title || "Select a video"}
              </h2>
              <p className="text-sm md:text-base text-slate-500 mb-8 pb-8 border-b border-slate-200">
                 {/* Fallback description since specific video descriptions aren't in your API snippet yet */}
                 {activeVideo?.description || `Lesson from section: ${course.title}`}
              </p>

              <CommentSection videoId={activeVideo?._id} user={user} />
            </div>
          </div>
        </div>

        {/* Pass 'sections' instead of 'videos' */}
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