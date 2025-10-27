import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EditVideo = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [courseTitle, setCourseTitle] = useState("");
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch course + sections
  const fetchCourseData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/course/content/${courseId}`,
        { withCredentials: true }
      );
      setCourseTitle(res.data.courseTitle);
      setSections(res.data.content || []);
    } catch (err) {
      console.error("❌ Error fetching course data:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to fetch course or sections.",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  // ✅ Add Section
  const handleAddSection = async () => {
    const { value: title } = await Swal.fire({
      title: "Add New Section",
      input: "text",
      inputLabel: "Enter section title",
      inputPlaceholder: "e.g., Introduction, Module 1",
      showCancelButton: true,
      confirmButtonText: "Create",
      inputValidator: (value) => {
        if (!value) return "Section title cannot be empty!";
      },
    });

    if (!title) return;

    try {
      setLoading(true);
      const order = sections.length + 1;
      await axios.post(
        "http://localhost:5000/api/section",
        { title, courseId, order },
        { withCredentials: true }
      );

      Swal.fire("Success", "New section added!", "success");
      await fetchCourseData();
    } catch (err) {
      console.error("❌ Error adding section:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to add section.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit Section Title
  const handleEditSectionTitle = async (sectionId, oldTitle, oldOrder) => {
    const { value: newTitle } = await Swal.fire({
      title: "Edit Section Title",
      input: "text",
      inputLabel: "Enter a new section title",
      inputValue: oldTitle,
      showCancelButton: true,
      confirmButtonText: "Save",
      inputValidator: (value) => {
        if (!value) return "Section title cannot be empty!";
      },
    });

    if (!newTitle || newTitle === oldTitle) return;

    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/section/${sectionId}`,
        { title: newTitle, order: oldOrder },
        { withCredentials: true }
      );

      Swal.fire("Success", "Section title updated!", "success");
      await fetchCourseData();
    } catch (err) {
      console.error("❌ Error updating section title:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update section title.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Section (and reassign videos)
  const handleDeleteSection = async (sectionId) => {
    const confirm = await Swal.fire({
      title: "Delete this section?",
      text: "Videos will move to the previous section if available.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/section/${sectionId}`, {
        withCredentials: true,
      });

      Swal.fire("Deleted!", "Section deleted successfully.", "success");
      await fetchCourseData();
    } catch (err) {
      console.error("❌ Error deleting section:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to delete section.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add Video
  const handleAddVideo = (sectionIndex) => {
    const updated = [...sections];
    updated[sectionIndex].videos.push({
      _id: null,
      title: "",
      description: "",
      file: null,
      videoUrl: "",
      isPreview: false,
      order: updated[sectionIndex].videos.length + 1,
    });
    setSections(updated);
  };

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

  // ✅ Delete Video
  const handleDeleteVideo = async (videoId, sIndex, vIndex) => {
    const confirm = await Swal.fire({
      title: "Delete this video?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/video/${videoId}`, {
        withCredentials: true,
      });
      handleRemoveVideo(sIndex, vIndex);
      Swal.fire("Deleted!", "Video deleted successfully.", "success");
    } catch (err) {
      console.error("❌ Error deleting video:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to delete video.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Move section up/down and update order in DB
  const moveSection = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const updated = [...sections];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

    updated.forEach((s, i) => (s.order = i + 1));
    setSections(updated);

    try {
      await axios.put(
        `http://localhost:5000/api/section/${updated[index].sectionId}`,
        { title: updated[index].sectionTitle, order: updated[index].order },
        { withCredentials: true }
      );
      await axios.put(
        `http://localhost:5000/api/section/${updated[newIndex].sectionId}`,
        { title: updated[newIndex].sectionTitle, order: updated[newIndex].order },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("❌ Failed to update section order:", err);
    }
  };

  // ✅ Move video up/down
  const moveVideo = (sIndex, vIndex, direction) => {
    const updated = [...sections];
    const videos = updated[sIndex].videos;
    const newIndex = vIndex + direction;
    if (newIndex < 0 || newIndex >= videos.length) return;
    [videos[vIndex], videos[newIndex]] = [videos[newIndex], videos[vIndex]];
    videos.forEach((v, i) => (v.order = i + 1));
    updated[sIndex].videos = videos;
    setSections(updated);
  };

  // ✅ Save all videos
  const handleUpdateAll = async () => {
    try {
      setLoading(true);
      for (const section of sections) {
        for (const [index, video] of (section.videos || []).entries()) {
          const formData = new FormData();
          formData.append("title", video.title);
          formData.append("description", video.description || "");
          formData.append("courseId", courseId);
          formData.append("sectionId", section.sectionId);
          formData.append("order", index + 1);
          formData.append("isPreview", video.isPreview);
          if (video.file) formData.append("video", video.file);
          else if (video.videoUrl)
            formData.append("videoUrl", video.videoUrl);

          if (video._id) {
            await axios.put(
              `http://localhost:5000/api/video/${video._id}`,
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
              }
            );
          } else {
            await axios.post("http://localhost:5000/api/video", formData, {
              headers: { "Content-Type": "multipart/form-data" },
              withCredentials: true,
            });
          }
        }
      }

      Swal.fire("✅ Success!", "All videos updated successfully!", "success");
      navigate(`/instructor/preview-course/${courseId}`);
    } catch (err) {
      console.error("❌ Error updating videos:", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update videos.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ UI
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-10">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Sections & Videos in{" "}
            <span className="text-blue-600">"{courseTitle}"</span>
          </h2>
          <button
            onClick={handleAddSection}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            ➕ Add New Section
          </button>
        </div>

        {sections.map((section, sIndex) => (
          <div
            key={section.sectionId || sIndex}
            className="border border-gray-300 rounded-lg mb-6 bg-gray-50 shadow-sm p-5"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">
                📘 {section.sectionTitle}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleEditSectionTitle(
                      section.sectionId,
                      section.sectionTitle,
                      section.order
                    )
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  ✏️ Rename
                </button>
                <button
                  onClick={() => moveSection(sIndex, -1)}
                  className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400"
                >
                  ⬆️
                </button>
                <button
                  onClick={() => moveSection(sIndex, 1)}
                  className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400"
                >
                  ⬇️
                </button>
                <button
                  onClick={() => handleDeleteSection(section.sectionId)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  🗑️ Delete
                </button>
                <button
                  onClick={() => handleAddVideo(sIndex)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  ➕ Add Video
                </button>
              </div>
            </div>

            {section.videos?.map((video, vIndex) => (
              <div
                key={video._id || vIndex}
                className="bg-white p-4 rounded-lg border border-gray-200 mb-4 shadow-sm"
              >
                <div className="flex justify-between mb-2 items-center">
                  <h4 className="font-medium">
                    🎬 Video {video.order}: {video.title || "(Untitled)"}
                  </h4>
                  <div className="flex gap-2 items-center">
                    <button onClick={() => moveVideo(sIndex, vIndex, -1)}>⬆️</button>
                    <button onClick={() => moveVideo(sIndex, vIndex, 1)}>⬇️</button>
                    <button
                      onClick={() =>
                        handleVideoChange(
                          sIndex,
                          vIndex,
                          "isPreview",
                          !video.isPreview
                        )
                      }
                      className={`px-2 py-1 rounded ${
                        video.isPreview
                          ? "bg-green-600 text-white"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {video.isPreview ? "Preview ✅" : "Set Preview"}
                    </button>
                    {video._id && (
                      <button
                        onClick={() =>
                          handleDeleteVideo(video._id, sIndex, vIndex)
                        }
                        className="text-red-500 font-semibold"
                      >
                        🗑️
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveVideo(sIndex, vIndex)}
                      className="text-gray-500 font-semibold"
                    >
                      ✖
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={video.title || ""}
                    placeholder="Video Title"
                    onChange={(e) =>
                      handleVideoChange(sIndex, vIndex, "title", e.target.value)
                    }
                    className="border rounded-lg p-2"
                  />
                  <input
                    type="text"
                    value={video.description || ""}
                    placeholder="Description"
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
                    value={video.videoUrl || ""}
                    placeholder="Video URL"
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
                </div>
              </div>
            ))}
          </div>
        ))}

        {sections.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={handleUpdateAll}
              disabled={loading}
              className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? "Updating..." : "💾 Save All Changes & Preview"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditVideo;

// http://localhost:5173/68ffb0a5806357eed7c7f83b