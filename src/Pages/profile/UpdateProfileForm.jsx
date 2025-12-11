import React, { useState, useEffect } from "react";
import { Paper, Typography, TextField, Button, Stack, Avatar, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";

export default function UpdateProfileForm({ profile, refreshProfile, setActiveTab }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gitHubUsername, setGitHubUsername] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setPhone(profile.phone || "");
      setGitHubUsername(profile.gitHubUsername || "");
      setBio(profile.bio || "");
      setImagePreview(profile.image || "");
    }
  }, [profile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("phone", phone);
    formData.append("gitHubUsername", gitHubUsername);
    formData.append("bio", bio);

    // Only append file if user selected a new image
    if (image) formData.append("image", image);

    const method = profile ? "PUT" : "POST";

    const res = await fetch("http://localhost:5000/api/profile", {
      method,
      credentials: "include",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to save profile");

    Swal.fire("Success", data.message, "success");

    if (refreshProfile) refreshProfile();
    setActiveTab("view");
  } catch (err) {
    console.error("Error saving profile:", err);
    Swal.fire("Error", err.message, "error");
  } finally {
    setLoading(false);
  }
};

  return (
    <Paper sx={{ width: "50%", p: 4, mx: "auto", mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {profile ? "Update Profile" : "Save Profile"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={4} alignItems="center">
            <Avatar
              src={imagePreview}
              sx={{ width: 100, height: 100, border: "2px solid #1976d2" }}
            />
            <Button variant="contained" component="label">
              {imagePreview ? "Change Image" : "Upload Image"}
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
          </Stack>

          <TextField
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <TextField label="GitHub Username" value={gitHubUsername} onChange={(e) => setGitHubUsername(e.target.value)} />
          <TextField label="Bio" multiline rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : profile ? "Update Profile" : "Save Profile"}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
