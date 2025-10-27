/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const AddVideo = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [courseTitle, setCourseTitle] = useState("");
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch course and sections
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseRes, sectionRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/course/${courseId}`, {
            withCredentials: true,
          }),
          axios.get(`http://localhost:5000/api/course/sections/${courseId}`, {
            withCredentials: true,
          }),
        ]);

        setCourseTitle(courseRes.data.title);
        setSections(sectionRes.data.sections || []);
      } catch (err) {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to load course details.",
          "error"
        );
      }
    };
    fetchCourseData();
  }, [courseId]);

  // ✅ Add Section
  const handleAddSection = async () => {
    const { value: sectionTitle } = await Swal.fire({
      title: "Add New Section",
      input: "text",
      inputLabel: "Enter Section Title",
      inputPlaceholder: "e.g. Introduction, Basics, etc.",
      showCancelButton: true,
    });

    if (!sectionTitle) return;
    try {
      setLoading(true);
      const newSection = {
        title: sectionTitle,
        order: sections.length + 1,
        courseId,
      };
      const res = await axios.post(
        "http://localhost:5000/api/section",
        newSection,
        { withCredentials: true }
      );
      setSections([...sections, { ...res.data.section, videos: [] }]);
      Swal.fire("Success", "Section created successfully!", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to add section.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Rename Section
  const handleRenameSection = async (sectionId, oldTitle, currentOrder) => {
    const { value: newTitle } = await Swal.fire({
      title: "Rename Section",
      input: "text",
      inputValue: oldTitle,
      inputPlaceholder: "Enter new section name",
      showCancelButton: true,
    });

    if (!newTitle || newTitle === oldTitle) return;
    try {
      await axios.put(
        `http://localhost:5000/api/section/${sectionId}`,
        { title: newTitle, order: currentOrder },
        { withCredentials: true }
      );

      setSections((prev) =>
        prev.map((s) =>
          s._id === sectionId ? { ...s, title: newTitle } : s
        )
      );

      Swal.fire("Updated!", "Section renamed successfully!", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to rename section.", "error");
    }
  };

  // ✅ Delete Section
  const handleDeleteSection = async (sectionId) => {
    const confirm = await Swal.fire({
      title: "Delete this section?",
      text: "All videos in this section will also be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/section/${sectionId}`, {
        withCredentials: true,
      });

      const updated = sections
        .filter((s) => s._id !== sectionId)
        .map((s, i) => ({ ...s, order: i + 1 }));

      // Persist order update
      for (const s of updated) {
        await axios.put(
          `http://localhost:5000/api/section/${s._id}`,
          { title: s.title, order: s.order },
          { withCredentials: true }
        );
      }

      setSections(updated);
      Swal.fire("Deleted!", "Section removed successfully!", "success");
    } catch {
      Swal.fire("Error", "Failed to delete section.", "error");
    }
  };

  // ✅ Move Section Up/Down + persist order
  const moveSection = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    [updated[index], updated[targetIndex]] = [
      updated[targetIndex],
      updated[index],
    ];

    // Update order numbers
    const reordered = updated.map((s, i) => ({ ...s, order: i + 1 }));
    setSections(reordered);

    // Persist to backend
    try {
      for (const s of reordered) {
        await axios.put(
          `http://localhost:5000/api/section/${s._id}`,
          { title: s.title, order: s.order },
          { withCredentials: true }
        );
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update section order.", "error");
    }
  };

  // ✅ Add Video
  const handleAddVideo = (sectionIndex) => {
    const updated = [...sections];
    updated[sectionIndex].videos.push({
      title: "",
      description: "",
      file: null,
      videoUrl: "",
      order: updated[sectionIndex].videos.length + 1,
      isPreview: false,
    });
    setSections(updated);
  };

  // ✅ Move Video Up/Down
  const moveVideo = (sectionIndex, videoIndex, direction) => {
    const updated = [...sections];
    const videos = updated[sectionIndex].videos;
    const targetIndex = videoIndex + direction;

    if (targetIndex < 0 || targetIndex >= videos.length) return;

    [videos[videoIndex], videos[targetIndex]] = [
      videos[targetIndex],
      videos[videoIndex],
    ];

    videos.forEach((v, i) => (v.order = i + 1));
    setSections(updated);
  };

  // ✅ Change Inputs
  const handleVideoChange = (sIndex, vIndex, field, value) => {
    const updated = [...sections];
    updated[sIndex].videos[vIndex][field] = value;
    setSections(updated);
  };

  const handleFileChange = (sIndex, vIndex, file) => {
    const updated = [...sections];
    updated[sIndex].videos[vIndex].file = file;
    updated[sIndex].videos[vIndex].videoUrl = "";
    setSections(updated);
  };

  const handleRemoveVideo = (sIndex, vIndex) => {
    const updated = [...sections];
    updated[sIndex].videos.splice(vIndex, 1);
    updated[sIndex].videos.forEach((v, i) => (v.order = i + 1));
    setSections(updated);
  };

  // ✅ Upload All
  const handleSubmitAll = async () => {
    try {
      setLoading(true);

      for (const section of sections) {
        for (const video of section.videos || []) {
          if (!video.title || (!video.file && !video.videoUrl)) {
            Swal.fire(
              "Error",
              "Each video needs a title and file or URL.",
              "error"
            );
            setLoading(false);
            return;
          }

          const formData = new FormData();
          formData.append("title", video.title);
          formData.append("description", video.description);
          formData.append("courseId", courseId);
          formData.append("sectionId", section._id);
          formData.append("order", video.order);
          formData.append("isPreview", video.isPreview);
          if (video.file)
            formData.append("video", video.file);
          else formData.append("videoUrl", video.videoUrl);

          await axios.post("http://localhost:5000/api/video", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          });
        }
      }

      Swal.fire("✅ Success!", "All videos uploaded successfully!", "success");
      navigate(`/instructor/preview-course/${courseId}`);
    } catch (err) {
      Swal.fire("Error", "Failed to upload videos.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-10">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Manage Course: <span className="text-blue-600">"{courseTitle}"</span>
          </h2>
          <button
            onClick={handleAddSection}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            ➕ Add Section
          </button>
        </div>

        {sections.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            No sections yet. Click “Add Section” to start building your course.
          </p>
        )}

        {sections.map((section, sIndex) => (
          <div
            key={section._id || sIndex}
            className="border border-gray-300 rounded-lg mb-6 bg-gray-50 shadow-sm p-5"
          >
            {/* Section Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                📘 {section.title}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => moveSection(sIndex, -1)}
                  className="bg-gray-300 hover:bg-gray-400 px-2 rounded"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveSection(sIndex, 1)}
                  className="bg-gray-300 hover:bg-gray-400 px-2 rounded"
                >
                  ↓
                </button>
                <button
                  onClick={() =>
                    handleRenameSection(section._id, section.title, section.order)
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  ✏️ Rename
                </button>
                <button
                  onClick={() => handleAddVideo(sIndex)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  ➕ Add Video
                </button>
                <button
                  onClick={() => handleDeleteSection(section._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>

            {/* Videos */}
            {section.videos?.length === 0 && (
              <p className="text-gray-500 ml-3">No videos yet.</p>
            )}

            {section.videos?.map((video, vIndex) => (
              <div
                key={vIndex}
                className="bg-white p-4 rounded-lg border border-gray-200 mb-4 shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">🎬 Video {video.order}</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveVideo(sIndex, vIndex, -1)}
                      className="text-gray-600 hover:text-black"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveVideo(sIndex, vIndex, 1)}
                      className="text-gray-600 hover:text-black"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleRemoveVideo(sIndex, vIndex)}
                      className="text-red-500 font-semibold"
                    >
                      ✖ Remove
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={video.title}
                    onChange={(e) =>
                      handleVideoChange(sIndex, vIndex, "title", e.target.value)
                    }
                    className="border rounded-lg p-2"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={video.description}
                    onChange={(e) =>
                      handleVideoChange(
                        sIndex,
                        vIndex,
                        "description",
                        e.target.value
                      )
                    }
                    className="border rounded-lg p-2"
                  />

                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      handleFileChange(sIndex, vIndex, e.target.files[0])
                    }
                    className="border rounded-lg p-2"
                  />
                  <input
                    type="text"
                    placeholder="Video URL"
                    value={video.videoUrl}
                    onChange={(e) =>
                      handleVideoChange(
                        sIndex,
                        vIndex,
                        "videoUrl",
                        e.target.value
                      )
                    }
                    className="border rounded-lg p-2"
                  />

                  <div className="flex items-center gap-2">
                    <label>Preview Video?</label>
                    <input
                      type="checkbox"
                      checked={video.isPreview}
                      onChange={(e) =>
                        handleVideoChange(
                          sIndex,
                          vIndex,
                          "isPreview",
                          e.target.checked
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {sections.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={handleSubmitAll}
              disabled={loading}
              className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? "Uploading..." : "🚀 Upload All Videos"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddVideo;
