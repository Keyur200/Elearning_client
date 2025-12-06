import React, { useEffect, useState } from 'react';
import { BookOpen, Clock, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false); // 🔥 NEW
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  // ===========================
  // CHECK IF USER IS ENROLLED
  // ===========================
  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/course/${course._id}/access`,
          { credentials: "include" }
        );

        const data = await res.json();
        if (data?.access) setIsEnrolled(true);
      } catch (error) {
        console.error("Failed to check enrollment", error);
      }
    };

    const fetchAverage = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/rating/average/${course._id}`
        );

        setAvgRating(data.average);
        setTotalRatings(data.totalRatings);

      } catch (error) {
        console.log("Error fetching avg rating:", error);
      }
    };

    fetchAverage();
    checkEnrollment();
  }, [course]);

  // ===========================
  // FETCH Instructor Profile Image
  // ===========================
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!course?.instructorId?._id) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/profile/${course.instructorId._id}`,
          { credentials: "include" }
        );

        if (!res.ok) return;
        const data = await res.json();
        setProfileImage(data.image || null);
      } catch (err) {
        console.error("Failed to fetch instructor profile image", err);
      }
    };

    fetchProfileImage();
  }, [course]);

  const categoryName = course.categoryId?.name || "General";
  const instructorName = course.instructorId?.name || "Unknown Instructor";

  const instructorAvatar =
    profileImage ||
    course.instructorId?.avatar ||
    "https://randomuser.me/api/portraits/lego/1.jpg";

  // ===========================
  // BUTTON LOGIC
  // ===========================
  const handleEnroll = () => {
    if (isEnrolled) {
      navigate(`/enrolled-course/${course._id}`);
    } else {
      navigate(`/course/${course._id}`);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full group">

      {/* Thumbnail Section */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail || "https://via.placeholder.com/400x225?text=No+Image"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          // onError={(e) => { e.target.src = "https://via.placeholder.com/400x225?text=Course+Image"; }}
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-indigo-700 uppercase tracking-wide shadow-sm">
          {categoryName}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2 text-yellow-400 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="text-slate-700">{avgRating || 4.5}</span>
          <span className="text-slate-400 font-normal">({totalRatings || 0})</span>
        </div>

        <h3 className="font-bold text-lg text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2" title={course.title}>
          {course.title}
        </h3>

        <p className="text-sm text-slate-500 mb-4 line-clamp-2" title={course.description}>
          {course.description || "No description available."}
        </p>

        {/* Lesson + Duration */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>{course.totalVideos || 0} Lessons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{course.totalDuration || "0m"}</span>
          </div>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-4">
          <img
            src={instructorAvatar}
            alt={instructorName}
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
          <span className="text-xs font-semibold text-slate-700 truncate max-w-[150px]">
            {instructorName}
          </span>
        </div>

        {/* Price + Button */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">₹{course.price}</span>
            {course.estimatedPrice && (
              <span className="text-xs text-slate-400 line-through decoration-slate-400">
                ₹{course.estimatedPrice}
              </span>
            )}
          </div>

          <button
            onClick={handleEnroll}
            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
          >
            {isEnrolled ? "Continue Learning" : "Enroll"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
