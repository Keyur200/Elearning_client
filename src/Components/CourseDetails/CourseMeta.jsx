import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import axios from "axios"; // Added axios

const CourseMeta = ({ course }) => {
  const [profileImage, setProfileImage] = useState(null);
  
  // 🟢 State for dynamic ratings
  const [ratingStats, setRatingStats] = useState({ average: 0, count: 0 });

  useEffect(() => {
    if (!course?._id) return;

    // 1. Fetch Instructor Profile Image
    const fetchInstructorProfile = async () => {
      if (!course?.instructorId?._id) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/profile/${course.instructorId._id}`
        );

        if (!res.ok) return;

        const data = await res.json();
        setProfileImage(data.image || null);
      } catch (error) {
        console.error("Failed to load instructor image", error);
      }
    };

    // 2. 🟢 Fetch Course Ratings from Database
    const fetchRatingStats = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/rating/average/${course._id}`
        );
        if (res.data.success) {
          setRatingStats({
            average: res.data.average || 0,
            count: res.data.totalRatings || 0,
          });
        }
      } catch (error) {
        console.error("Failed to load ratings", error);
      }
    };

    fetchInstructorProfile();
    fetchRatingStats();
  }, [course]);

  const instructorName = course?.instructorId?.name || "Unknown Instructor";

  // Fallback avatar
  const avatar =
    profileImage ||
    course.instructorId?.avatar ||
    "https://randomuser.me/api/portraits/lego/1.jpg";

  return (
    <>
      {/* Thumbnail */}
      <div className="rounded-2xl overflow-hidden mb-8 shadow-md border border-slate-100 relative group">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-[300px] md:h-[400px] object-cover group-hover:scale-105 transition"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      {/* Title & Description */}
      <h2 className="text-4xl font-bold mb-4">{course.title}</h2>
      <p className="text-lg text-slate-600 mb-6">{course.description}</p>

      {/* Instructor + Rating + Level */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 pb-8 border-b">

        {/* Instructor */}
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={instructorName}
            className="w-12 h-12 rounded-full object-cover border"
          />

          <div>
            <p className="text-xs text-slate-400">Instructor</p>
            <p className="font-bold">{instructorName}</p>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

        {/* 🟢 Rating (Fetched from DB) */}
        <div>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-slate-900 font-bold">
              {ratingStats.average.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            ({ratingStats.count} Reviews)
          </p>
        </div>

        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

        {/* Level */}
        <div>
          <p className="text-xs text-slate-400">Level</p>
          <p className="font-bold">{course.level}</p>
        </div>
      </div>
    </>
  );
};

export default CourseMeta;