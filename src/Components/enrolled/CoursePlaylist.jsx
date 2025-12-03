import React, { useState } from "react";
import { CheckCircle, Circle, Play, X, ChevronDown, ChevronUp } from "lucide-react";
import { markVideoComplete } from "../../api/enrollmentApi"; // <-- import new API

const CoursePlaylist = ({ sections = [], activeVideoId, onSelect, progress, isOpen, onClose, onProgressUpdate }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const totalVideosCount = sections.reduce((acc, section) => acc + (section.videos?.length || 0), 0);
  let globalVideoIndex = 0;

  const handleVideoSelect = async (video) => {
    onSelect(video);

    // Mark video as complete in backend
    try {
      const data = await markVideoComplete(video._id);
      // Update progress in parent
      onProgressUpdate?.(data.progress);
    } catch (err) {
      console.error("Error marking video complete:", err);
    }

    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed inset-y-0 right-0 z-40 w-80 bg-white border-l border-slate-200 shadow-xl transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:shadow-none lg:z-0 lg:w-96 flex flex-col
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Playlist Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 flex-shrink-0">
          <div>
            <h3 className="font-bold text-slate-800">Course Content</h3>
            <p className="text-xs text-slate-500 mt-1">
              {progress?.watchedVideos || 0} / {totalVideosCount} completed
            </p>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-500 hover:bg-slate-200 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Sections List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          {sections.map((section, sectionIdx) => {
            const isExpanded = expandedSections[section._id] !== false; // Default Open

            return (
              <div key={section._id} className="border-b border-slate-100">
                {/* Section Header */}
                <button 
                  onClick={() => toggleSection(section._id)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-100 transition-colors text-left"
                >
                  <span className="font-bold text-slate-700 text-sm">
                    Section {sectionIdx + 1}: {section.title || "Untitled Section"}
                  </span>
                  {isExpanded ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
                </button>

                {/* Section Videos */}
                {isExpanded && (
                  <div className="bg-white">
                    {section.videos.map((v) => {
                      const isActive = activeVideoId === v._id;
                      const isCompleted = globalVideoIndex < (progress?.watchedVideos || 0);
                      globalVideoIndex++; 

                      return (
                        <div
                          key={v._id}
                          onClick={() => handleVideoSelect(v)}
                          className={`
                            group p-3 px-4 cursor-pointer flex gap-3 items-start transition-colors border-l-4
                            ${isActive 
                              ? "bg-indigo-50 border-l-indigo-600" 
                              : "hover:bg-slate-50 border-l-transparent"
                            }
                          `}
                        >
                          <div className="mt-0.5 flex-shrink-0">
                            {isActive ? (
                              <Play size={16} className="text-indigo-600 fill-indigo-600" />
                            ) : isCompleted ? (
                              <CheckCircle size={16} className="text-emerald-500" />
                            ) : (
                              <Circle size={16} className="text-slate-300 group-hover:text-slate-400" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-medium leading-snug truncate ${isActive ? "text-indigo-700" : "text-slate-700"}`}>
                              {v.order}. {v.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                                {v.duration || "10:00"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CoursePlaylist;
