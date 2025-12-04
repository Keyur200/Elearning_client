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

  const [showLogin, setShowLogin] = useState(false);

  // =====================================================
  // LOAD RAZORPAY SCRIPT
  // =====================================================
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // =====================================================
  // BUY NOW → RAZORPAY PAYMENT
  // =====================================================
  const handlePayment = async () => {
    const sdk = await loadRazorpay();
    if (!sdk) {
      Swal.fire("Error", "Unable to load Razorpay", "error");
      return;
    }

    try {
      // 1. CREATE ORDER FROM BACKEND
      const { data } = await axios.post(
        "http://localhost:5000/api/createorder",
        {
          courseId: courseData.course._id,
          userId: user._id,
          amount: courseData.course.price,
        }
      );

      const options = {
        key: data.key,
        amount: data.razorpayOrder.amount,
        currency: "INR",
        name: "My Learning App",
        description: courseData.course.title,
        order_id: data.razorpayOrder.id,

        handler: async (response) => {
          await axios.post("http://localhost:5000/api/payment", {
            orderId: data.orderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          Swal.fire("Success", "Payment completed!", "success");
          navigate(`/enrolled-course/${courseData.course._id}`);
        },

        theme: { color: "#a435f0" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("PAYMENT ERROR:", err);
      Swal.fire("Error", err.response?.data?.message || "Payment failed!", "error");
    }
  };

  // =====================================================
  // BUY NOW CLICK HANDLER
  // =====================================================
  const handleBuyNow = () => {
    if (!user?._id) {
      setShowLogin(true);
      return;
    }

    if (access) {
      navigate(`/enrolled-course/${courseData.course._id}`);
      return;
    }

    handlePayment(); // Razorpay call
  };

  // =====================================================
  // LOAD COURSE
  // =====================================================
  const getCourse = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/courses/details/${id}`);
      const data = await res.json();
      setCourseData(data);
    } catch (err) {
      Swal.fire("Error", "Failed to load course", "error");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CHECK ACCESS (PURCHASED OR NOT)
  // =====================================================
  const checkAccess = async () => {
    if (!user?._id) return;

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/course/${id}/access`,
        { withCredentials: true }
      );
      setAccess(data.access);
    } catch (err) {
      console.error(err);
    }
  };

  // =====================================================
  // PREVIEW VIDEO HANDLERS
  // =====================================================
  const handleOpenPreview = (videos, index) => {
    const previews = videos.filter((v) => v.isPreview);

    const clickedId = videos[index]._id;
    const newIndex = previews.findIndex((v) => v._id === clickedId);

    setPreviewVideos(previews);
    setCurrentIndex(newIndex === -1 ? 0 : newIndex);
    setOpenPreview(true);
  };

  // =====================================================
  // LOAD EVERYTHING
  // =====================================================
  useEffect(() => {
    getCourse();
    checkAccess();
  }, [id, user]);

  if (loading) return <p>Loading...</p>;
  if (!courseData) return <p>Course not found</p>;

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

          {/* RIGHT SIDE - SIDEBAR */}
          <Sidebar
            course={{ ...course, sections }}
            access={access}
            totalDuration={totalDuration}
            totalSections={totalSections}
            totalVideos={totalVideos}
            onContinue={() => navigate(`/enrolled-course/${course._id}`)}
            onBuyNow={handleBuyNow}
            openLoginModal={() => setShowLogin(true)}
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
        onPrev={() =>
          setCurrentIndex((i) => Math.max(i - 1, 0))
        }
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
