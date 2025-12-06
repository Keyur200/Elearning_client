import React from "react";
import { ArrowLeft, Menu, Award, X } from "lucide-react";
import { useState } from "react";
import axios from 'axios'
import { useAuth } from "../../Context/UserContext";
const CourseHeader = ({ title,courseId, onToggleSidebar, progress = 0 }) => {
  const isCompleted = progress === 100;

  const [ user, setUser ] = useAuth();

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(user)
  const submitRating = async () => {

    setLoading(true);

    try {
      const res = await axios.post(`http://localhost:5000/api/rating/${courseId}/${user?._id}`,
        {
          rating,
          review
        }
      );

      console.log("API Response:", res.data);

      setOpen(false);
      setRating(0);
      setReview("");

    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };
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

        <button onClick={() => setOpen(true)} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors animate-fade-in">
          <Award size={16} />
          <span>Add Rating</span>
        </button>

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
      {open && (
        <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">

          <div className="bg-white w-full max-w-md mx-4 rounded-xl shadow-xl p-6 relative animate-scale-in">

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-4">Add Rating</h2>

            {/* Stars */}
            <div className="flex gap-1 mb-4 text-2xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer ${(hover || rating) >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                    }`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Review */}
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review..."
              className="w-full border rounded-lg p-3 h-28 focus:ring-2 focus:ring-emerald-400 outline-none"
            />

            {/* Buttons */}
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={submitRating}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      )}
    </header>


  );
};

export default CourseHeader;
