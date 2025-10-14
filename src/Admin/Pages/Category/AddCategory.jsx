import React, { useState } from "react";
import { Paper, Typography, TextField, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return Swal.fire("Error", "Category name is required.", "error");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (image) formData.append("image", image);

      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        credentials: "include", // important for HttpOnly cookie
        body: formData
      });

      if (res.status === 401) {
        Swal.fire("Unauthorized", "Please login.", "error");
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to add category");

      Swal.fire("Success", "Category added successfully.", "success");
      navigate("/admin/category"); // Redirect to list
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <Paper sx={{ width: "50%", p: 4, mx: "auto", mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Add Category</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
          />
          <Button variant="contained" component="label">
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Button>
          {image && <Typography>Selected: {image.name}</Typography>}
          <Button type="submit" variant="contained">Add Category</Button>
          <Button variant="outlined" onClick={() => navigate("/category")}>Cancel</Button>
        </Stack>
      </form>
    </Paper>
  );
}
