import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const PreviewCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCoursePreview = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/courses/preview/${courseId}`,
          { withCredentials: true }
        );

        if (!res.data?.course) {
          Swal.fire("Error", "Course not found", "error");
          navigate("/instructor/my-courses");
          return;
        }

        setCourse(res.data.course);
        setSections(res.data.sections || []);
      } catch (err) {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to load course preview",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCoursePreview();
  }, [courseId, navigate]);

  const handlePublishToggle = async () => {
    if (!course) return;

    const newStatus = !course.isPublished;
    setPublishing(true);

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/course/publish/${course._id}`,
        { isPublished: newStatus },
        { withCredentials: true }
      );

      Swal.fire("Success", res.data.message, "success");
      setCourse({ ...course, isPublished: newStatus });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update publish status",
        "error"
      );
    } finally {
      setPublishing(false);
    }
  };

  const handleSave = async () => {
    if (!course) return;
    setSaving(true);

    try {
      await axios.put(
        `http://localhost:5000/api/course/${course._id}`,
        {
          title: course.title,
          description: course.description,
        },
        { withCredentials: true }
      );

      Swal.fire("Success", "Course details saved successfully!", "success");
      navigate("/instructor/my-courses");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to save course changes",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-600">Loading course...</div>
    );

  if (!course)
    return (
      <div className="p-8 text-center text-red-600">Course not found.</div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
        <div className="flex space-x-2">
          <button
            onClick={handlePublishToggle}
            disabled={publishing}
            className={`px-4 py-2 rounded-md text-white ${
              course.isPublished
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {publishing
              ? "Updating..."
              : course.isPublished
              ? "Unpublish"
              : "Publish"}
          </button>

          {/* Show Save button always */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Course Details */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Thumbnail */}
        <div className="md:w-1/3">
          <img
            src={course.thumbnail}
            alt="Course Thumbnail"
            className="w-full h-60 object-cover rounded-md"
          />
        </div>

        {/* Info */}
        <div className="md:w-2/3 space-y-2">
          <p className="text-gray-700">{course.description}</p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Category:</span>{" "}
            {course.categoryId?.name || "N/A"} |{" "}
            <span className="font-semibold">Level:</span> {course.level}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Price:</span> ₹{course.price} |{" "}
            <span className="font-semibold">Estimated:</span> ₹
            {course.estimatedPrice}
          </p>
          <div>
            <span className="font-semibold text-gray-700">Tags:</span>{" "}
            {course.tags?.join(", ") || "N/A"}
          </div>
          <div>
            <span className="font-semibold text-gray-700">Benefits:</span>{" "}
            {course.benefits?.join(", ") || "N/A"}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Instructor:{" "}
            <span className="font-medium text-gray-800">
              {course.instructorId?.name}
            </span>{" "}
            ({course.instructorId?.email})
          </p>
        </div>
      </div>

      {/* Section & Video List */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
        {sections.length === 0 ? (
          <p className="text-gray-600">No sections or videos found.</p>
        ) : (
          sections
            .sort((a, b) => a.order - b.order)
            .map((section, i) => (
              <div
                key={section._id}
                className="border rounded-lg mb-6 bg-gray-50 shadow-sm"
              >
                <div className="px-4 py-3 bg-gray-200 rounded-t-lg flex justify-between items-center">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {i + 1}. {section.title}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {section.videos?.length || 0} video(s)
                  </span>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.videos?.length > 0 ? (
                    section.videos
                      .sort((a, b) => a.order - b.order)
                      .map((video, idx) => (
                        <div
                          key={video._id}
                          className="border rounded-md bg-white p-3"
                        >
                          <h4 className="font-medium text-gray-800 mb-1">
                            {idx + 1}. {video.title}{" "}
                            {video.isPreview && (
                              <span className="text-xs text-white bg-blue-500 px-2 py-1 rounded-full ml-2">
                                Preview
                              </span>
                            )}
                          </h4>
                          <video
                            src={video.videoUrl}
                            controls
                            className="w-full h-44 object-cover rounded-md"
                          />
                          <p className="text-sm text-gray-600 mt-2">
                            {video.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Duration: {video.duration}
                          </p>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-600 col-span-2">
                      No videos in this section.
                    </p>
                  )}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default PreviewCourse;
