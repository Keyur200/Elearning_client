import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Menu, Award, X } from "lucide-react";
import { useAuth } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Certificate from "./Certificate"; // Certificate component

const CourseHeader = ({ title, courseId, onToggleSidebar, progress = 0 }) => {
  const isCompleted = progress === 100;

  const [user, setUser] = useAuth();
  const [profileImage, setProfileImage] = useState(null);

  const [openRating, setOpenRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  // Certificate states
  const [certData, setCertData] = useState(null);
  const certificateRef = useRef(null);
  const [openCertDialog, setOpenCertDialog] = useState(false);
  const [certName, setCertName] = useState("");

  const navigate = useNavigate();

  // Fetch profile image on mount or user change
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!user) return;
      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setProfileImage(data.profile?.image || null);
      } catch (err) {
        console.error("Failed to fetch profile image", err);
      }
    };
    fetchProfileImage();
  }, [user]);

  // Submit course rating
  const submitRating = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:5000/api/rating/${courseId}/${user?._id}`,
        { rating, review }
      );
      setOpenRating(false);
      setRating(0);
      setReview("");
    } catch (err) {
      console.error("Failed to submit rating", err);
    } finally {
      setLoading(false);
    }
  };

  // Open certificate dialog
  const handleOpenCertDialog = () => {
    setCertName(user?.fullName || "Student Name");
    setOpenCertDialog(true);
  };

  // Generate PDF certificate
  const generateCertificate = async () => {
    setOpenCertDialog(false);
    if (!courseId) return;

    setCertData({
      studentName: certName,
      courseName: title,
      date: new Date().toLocaleDateString(),
    });

    setTimeout(async () => {
      if (certificateRef.current) {
        try {
          const canvas = await html2canvas(certificateRef.current, { scale: 2 });
          const imgData = canvas.toDataURL("image/png");

          const pdf = new jsPDF("landscape", "px", "a4");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();

          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save(`${title}_Certificate.pdf`);
        } catch (error) {
          console.error("Certificate generation failed", error);
        } finally {
          setCertData(null);
        }
      }
    }, 500);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 z-30 shrink-0 gap-4">

      {/* Left: Back & Title */}
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

      {/* Center: Progress Bar */}
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

      {/* Right: Profile & Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Certificate Button */}
        {isCompleted && (
          <button
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
            onClick={handleOpenCertDialog}
          >
            <Award size={16} />
            <span>Get Certificate</span>
          </button>
        )}

        {/* Rating Button */}
        <button
          onClick={() => setOpenRating(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
        >
          <Award size={16} />
          <span>Add Rating</span>
        </button>

        {/* User Avatar */}
        <div className="relative group cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-white overflow-hidden">
            {profileImage ? (
              <img
                src={profileImage}
                alt={user?.name || "User"}
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

      {/* Rating Modal */}
      {openRating && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md mx-4 rounded-xl shadow-xl p-6 relative">
            <button
              onClick={() => setOpenRating(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-4">Add Rating</h2>
            <div className="flex gap-1 mb-4 text-2xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer ${
                    (hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review..."
              className="w-full border rounded-lg p-3 h-28 focus:ring-2 focus:ring-emerald-400 outline-none"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setOpenRating(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                disabled={loading}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate Dialog */}
      {openCertDialog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <h2 className="text-lg font-semibold mb-3">Certificate Details</h2>
            <input
              type="text"
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Full Name on Certificate"
            />
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setOpenCertDialog(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={generateCertificate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={!certName.trim()}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Certificate Render */}
      {certData && (
        <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
          <Certificate
            ref={certificateRef}
            studentName={certData.studentName}
            courseName={certData.courseName}
            date={certData.date}
            profileImage={profileImage}
          />
        </div>
      )}
    </header>
  );
};

export default CourseHeader;
