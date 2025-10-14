import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const PreviewCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false); // for button loading

  useEffect(() => {
    const fetchPreviewCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/preview/${courseId}`, {
          withCredentials: true,
        });

        if (!res.data || !res.data.course) {
          Swal.fire("Error", "Course not found or not published", "error");
          navigate("/instructor/my-courses");
          return;
        }

        setCourse(res.data.course);
        setVideos(res.data.videos || []);
        setLoading(false);
      } catch (err) {
        Swal.fire(
          "Error",
          `Failed to fetch course: ${err.response?.data?.message || err.message}`,
          "error"
        );
        setLoading(false);
      }
    };

    fetchPreviewCourse();
  }, [courseId, navigate]);

  const handlePublishToggle = async () => {
    if (!course) return;

    const newStatus = !course.isPublished;
    setPublishing(true);

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/coursepublish/${course._id}`,
        { isPublished: newStatus },
        { withCredentials: true }
      );

      Swal.fire("Success", res.data.message, "success");
      // Redirect to My Courses page after publishing/unpublishing
      navigate("/instructor/my-courses");
    } catch (err) {
      Swal.fire(
        "Error",
        `Failed to update course: ${err.response?.data?.message || err.message}`,
        "error"
      );
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading course...</div>;
  if (!course)
    return <div className="p-6 text-center text-red-600">Course not found.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-md mt-6">
      {/* Course Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <button
          onClick={handlePublishToggle}
          disabled={publishing}
          className={`px-4 py-2 rounded-md text-white ${
            course.isPublished ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {publishing
            ? "Updating..."
            : course.isPublished
            ? "Unpublish"
            : "Publish"}
        </button>
      </div>

      <p className="text-gray-700 mb-2">{course.description}</p>
      <p className="text-sm text-gray-500 mb-1">
        Category: {course.categoryId?.name || "N/A"} | Level: {course.level}
      </p>
      <p className="text-sm text-gray-500 mb-2">
        Price: ₹{course.price} | Estimated: ₹{course.estimatedPrice}
      </p>
      <div className="mb-2">Tags: {course.tags?.join(", ") || "N/A"}</div>
      <div className="mb-4">Benefits: {course.benefits?.join(", ") || "N/A"}</div>

      {/* Thumbnail */}
      {course.thumbnail && (
        <img
          src={course.thumbnail}
          alt="Course Thumbnail"
          className="w-full h-64 object-cover rounded-md mb-6"
        />
      )}

      {/* Videos */}
      <h2 className="text-2xl font-semibold mb-4">Course Videos</h2>
      {videos.length === 0 ? (
        <p className="text-gray-600">No videos available for this course.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos
            .sort((a, b) => a.order - b.order)
            .map((video, idx) => (
              <div key={video._id} className="border rounded-md p-2">
                <h3 className="font-medium mb-2">
                  {idx + 1}. {video.title}{" "}
                  {video.isPreview && (
                    <span className="text-xs text-white bg-blue-500 px-2 py-1 rounded-full ml-2">
                      Preview
                    </span>
                  )}
                </h3>
                <video
                  src={video.videoUrl}
                  controls
                  className="w-full h-48 object-cover rounded-md"
                />
                <p className="text-gray-500 text-sm mt-1">{video.description}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default PreviewCourse;
