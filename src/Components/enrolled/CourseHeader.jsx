import React from "react";
import { ArrowLeft, Menu, Award } from "lucide-react";

const CourseHeader = ({ title, onToggleSidebar, user, progress = 0 }) => {
  const isCompleted = progress === 100;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 z-30 shrink-0 gap-4">
      
      {/* --- Left: Back & Title --- */}
      <div className="flex items-center gap-4 min-w-0 shrink">
        <button
          onClick={() => window.history.back()}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
        <h1 className="font-bold text-slate-800 truncate text-lg hidden md:block">
          {title}
        </h1>
      </div>

      {/* --- Center: Progress Bar --- */}
      <div className="flex-1 max-w-md mx-auto hidden sm:flex flex-col justify-center">
        <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
          <span className="truncate">{title}</span>
          <span>{progress}% Complete</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* --- Right: Profile & Actions --- */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* Certificate Button (only if course completed) */}
        {isCompleted && (
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors animate-fade-in">
            <Award size={16} />
            <span>Get Certificate</span>
          </button>
        )}

        {/* User Avatar */}
        <div className="relative group cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-white overflow-hidden">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
            )}
          </div>
        </div>

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden ml-1 p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
};

export default CourseHeader;
