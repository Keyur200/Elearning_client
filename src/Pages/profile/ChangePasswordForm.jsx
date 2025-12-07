import React, { useState } from "react";
import { Button, Divider, Stack, TextField, Typography } from "@mui/material";
import Swal from "sweetalert2";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/change-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire("Success", data.message, "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <>
      <Typography variant="h5" fontWeight={600}>Change Password</Typography>
      <Divider sx={{ my: 2 }} />

      <Stack spacing={3} sx={{ maxWidth: 500 }}>
        <TextField label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <TextField label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <TextField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <Button variant="contained" onClick={handleSubmit}>Update Password</Button>
      </Stack>
    </>
  );
}
