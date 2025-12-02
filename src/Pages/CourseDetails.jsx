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

  // ============ LOAD COURSE ============
  const getCourse = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/courses/details/${id}`
      );
      const data = await res.json();
      setCourseData(data);
    } catch {
      Swal.fire("Error", "Failed to load course", "error");
    } finally {
      setLoading(false);
    }
  };

  // ============ CHECK ACCESS ============
  const checkAccess = async () => {
    if (!user?._id) return;
    const { data } = await axios.get(
      `http://localhost:5000/api/course/${id}/access`,
      { params: { userId: user._id } }
    );
    setAccess(data.access);
  };

  useEffect(() => {
    getCourse();
    checkAccess();
  }, [id, user]);

  // ============ PREVIEW HANDLERS ============
  const handleOpenPreview = (videos, index) => {
    const previews = videos.filter((v) => v.isPreview);
    const clickedId = videos[index]._id;
    const newIndex = previews.findIndex((v) => v._id === clickedId);

    setPreviewVideos(previews);
    setCurrentIndex(newIndex === -1 ? 0 : newIndex);
    setOpenPreview(true);
  };

  const handleBuyNow = () => {
    Swal.fire("Payment", "Integrate Razorpay here...", "info");
  };

  if (loading) return <p>Loading...</p>;

  const { course, sections, totalDuration, totalSections, totalVideos } =
    courseData;

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT */}
          <div className="lg:flex-1">
            <CourseMeta course={course} />
            <CourseContentList
              sections={sections}
              handleOpenPreview={handleOpenPreview}
            />
          </div>

          {/* RIGHT */}
          <Sidebar
            course={{ ...course, sections }} // merge sections into course
            access={access}
            totalDuration={totalDuration}
            totalSections={totalSections}
            totalVideos={totalVideos}
            onContinue={() => navigate(`/enrolled-course/${course._id}`)}
            onBuyNow={handleBuyNow}
          />
        </div>
      </div>

      <VideoPreviewModal
        isOpen={openPreview}
        onClose={() => setOpenPreview(false)}
        video={previewVideos[currentIndex]}
        onNext={() =>
          setCurrentIndex((i) => Math.min(i + 1, previewVideos.length - 1))
        }
        onPrev={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
      />
    </>
  );
};

export default CourseDetails;
