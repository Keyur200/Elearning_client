import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../Context/UserContext";

import {
  CourseMeta,
  CourseContentList,
  CourseSidebar as Sidebar,
  VideoPreviewModal,
} from "../Components/CourseDetails";

import Login from "../Pages/Login"; // Login popup component

const CourseDetails = () => {
  const [user] = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [access, setAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const [openPreview, setOpenPreview] = useState(false);
  const [previewVideos, setPreviewVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showLogin, setShowLogin] = useState(false); // login popup state

  // ============ LOAD COURSE ============
  const getCourse = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/courses/details/${id}`
      );
      const data = await res.json();
      setCourseData(data);
    } catch (err) {
      console.error("Error loading course:", err);
      Swal.fire("Error", "Failed to load course", "error");
    } finally {
      setLoading(false);
    }
  };

  // ============ CHECK ACCESS ============
  const checkAccess = async () => {
    if (!user?._id) return; // only logged-in users
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/course/${id}/access`,
        {
          withCredentials: true, // send cookies
        }
      );
      setAccess(data.access);
    } catch (err) {
      console.error("Failed to check access:", err);
    }
  };

  // ============ PREVIEW HANDLERS ============
  const handleOpenPreview = (videos, index) => {
    const previews = videos.filter((v) => v.isPreview);
    const clickedId = videos[index]._id;
    const newIndex = previews.findIndex((v) => v._id === clickedId);

    setPreviewVideos(previews);
    setCurrentIndex(newIndex === -1 ? 0 : newIndex);
    setOpenPreview(true);
  };

  // ============ BUY NOW HANDLER ============
  const handleBuyNow = () => {
    if (!user?._id) {
      setShowLogin(true); // show login popup
      return;
    }
    Swal.fire("Payment", "Integrate Razorpay here...", "info");
  };

  // ============ LOAD ON MOUNT ============
  useEffect(() => {
    getCourse();
    checkAccess();
  }, [id, user]);

  if (loading) return <p>Loading...</p>;

  const { course, sections, totalDuration, totalSections, totalVideos } =
    courseData;

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT SIDE */}
          <div className="lg:flex-1">
            <CourseMeta course={course} />
            <CourseContentList
              sections={sections}
              handleOpenPreview={handleOpenPreview}
            />
          </div>

          {/* RIGHT SIDE (SIDEBAR) */}
          <Sidebar
            course={{ ...course, sections }}
            access={access}
            totalDuration={totalDuration}
            totalSections={totalSections}
            totalVideos={totalVideos}
            onContinue={() => navigate(`/enrolled-course/${course._id}`)}
            onBuyNow={handleBuyNow}
            openLoginModal={() => setShowLogin(true)} // triggers login popup
          />
        </div>
      </div>

      {/* VIDEO PREVIEW MODAL */}
      <VideoPreviewModal
        isOpen={openPreview}
        onClose={() => setOpenPreview(false)}
        video={previewVideos[currentIndex]}
        onNext={() =>
          setCurrentIndex((i) => Math.min(i + 1, previewVideos.length - 1))
        }
        onPrev={() => setCurrentIndex((i) => Math.max(i - 0, 0))}
      />

      {/* LOGIN POPUP */}
      {showLogin && (
        <Login
          closeModal={() => setShowLogin(false)}
          openRegister={() => setShowLogin(false)}
        />
      )}
    </>
  );
};

export default CourseDetails;
