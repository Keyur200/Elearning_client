import React, { useState } from "react";
import { Box, Button, Divider, Stack, TextField, Typography, Avatar } from "@mui/material";
import Swal from "sweetalert2";

export default function UpdateProfileForm({ profile, refresh }) {
  const [fullName, setFullName] = useState(profile?.fullName || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [gitHubUsername, setGitHubUsername] = useState(profile?.gitHubUsername || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("phone", phone);
      formData.append("gitHubUsername", gitHubUsername);
      formData.append("bio", bio);
      if (imageFile) formData.append("image", imageFile);

      const method = profile ? "PUT" : "POST";

      const res = await fetch("http://localhost:5000/api/profile", {
        method,
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire("Success", data.message, "success");
      refresh();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
        Update Profile
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Stack direction="row" spacing={4} alignItems="center">
        <Avatar
          src={imageFile ? URL.createObjectURL(imageFile) : profile?.image}
          sx={{ width: 100, height: 100, border: "2px solid #1976d2" }}
        />
        <Button variant="outlined" component="label">
          Upload New Image
          <input type="file" hidden onChange={(e) => setImageFile(e.target.files[0])} />
        </Button>
      </Stack>

      <Stack spacing={2} sx={{ mt: 3 }}>
        <TextField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <TextField label="GitHub Username" value={gitHubUsername} onChange={(e) => setGitHubUsername(e.target.value)} />
        <TextField multiline rows={3} label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} />

        <Button variant="contained" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Stack>
    </>
  );
}
