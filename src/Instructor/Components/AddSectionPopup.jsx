import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AddSectionPopup = ({ courseId, onClose, onSectionAdded }) => {
  const [title, setTitle] = useState("");

  const handleAddSection = async () => {
    if (!title.trim()) {
      Swal.fire("Error", "Section title is required", "error");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/section", {
        title,
        order: Date.now(),
        courseId,
      });
      onSectionAdded(res.data.section);
      Swal.fire("Success", "Section added successfully", "success");
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Failed to add section", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-96 rounded-lg shadow-lg p-6 relative">
        <h3 className="text-xl font-semibold mb-4">Add New Section</h3>
        <input
          type="text"
          placeholder="Section Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleAddSection}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSectionPopup;
