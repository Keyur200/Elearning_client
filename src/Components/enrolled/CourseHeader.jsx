import React from "react";
import { ArrowLeft, Menu, Award, Share2 } from "lucide-react";

const CourseHeader = ({ title, onToggleSidebar, user }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 z-30 shrink-0">
      <div className="flex items-center gap-4 flex-1 overflow-hidden">
        <button 
          onClick={() => window.history.back()} 
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
          title="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
        <h1 className="font-bold text-slate-800 truncate text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-2 mr-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Share2 size={14}/> Share
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors">
                <Award size={14}/> Get Certificate
            </button>
        </div>

        {/* User Profile */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-white">
            {user?.name?.charAt(0)}
        </div>

        {/* Mobile Playlist Toggle */}
        <button 
            onClick={onToggleSidebar} 
            className="lg:hidden ml-2 p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
};

export default CourseHeader;