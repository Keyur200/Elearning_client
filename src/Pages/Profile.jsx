import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Divider,
  TextField,
  Button,
  Stack,
  Avatar,
  CircularProgress,
  Box,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  ListItemIcon,
} from "@mui/material";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import { MdLock, MdLogout, MdDashboard } from "react-icons/md";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gitHubUsername, setGitHubUsername] = useState("");
  const [bio, setBio] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserRole();
    fetchProfile();
  }, []);

  // Fetch role
  const fetchUserRole = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/user", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch user role");
      const data = await res.json();
      setRole(data.role);
    } catch (err) {
      console.error(err);
      setRole(null);
    }
  };

  // Fetch profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/profile", {
        credentials: "include",
      });
      if (res.status === 401) {
        Swal.fire("Unauthorized", "Please login to access this page.", "error");
        navigate("/login");
        return;
      }
      if (res.status === 404) {
        setProfile(null);
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setProfile(data);
      setFullName(data.fullName || "");
      setPhone(data.phone || "");
      setGitHubUsername(data.gitHubUsername || "");
      setBio(data.bio || "");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => setImageFile(e.target.files[0]);

  // Update profile
  const handleSubmit = async () => {
    try {
      setLoading(true);
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
      if (!res.ok) throw new Error(data.message || "Error saving profile");

      setProfile(data.profile);
      Swal.fire("Success", data.message, "success");
      setShowUpdateForm(false);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePasswordSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire("Error", "Please fill all password fields", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "New passwords do not match", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/auth/change-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error changing password");

      Swal.fire("Success", data.message, "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassword(false);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDashboardRedirect = () => {
    if (!role) return;
    if (role === "Admin") navigate("/admin");
    else if (role === "Instructor") navigate("/instructor");
    else navigate("/purchase-courses");
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("user");
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return <CircularProgress sx={{ mt: 10, ml: 5 }} size={50} color="primary" />;

  return (
    <>
      <Navbar />

      <Box sx={{ display: "flex", mt: 20, px: 2 }}>
        {/* Sidebar */}
        <Paper
          sx={{
            width: sidebarCollapsed ? 80 : 220,
            p: 2,
            mr: 3,
            transition: "width 0.3s",
            height: "fit-content",
            position: "sticky",
            top: 100,
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
            <IconButton
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              size="small"
            >
              <HiOutlineMenuAlt3 size={22} />
            </IconButton>
          </Stack>

          <List>
            {role && (
              <ListItemButton onClick={handleDashboardRedirect}>
                <ListItemIcon>
                  <MdDashboard size={22} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    !sidebarCollapsed &&
                    (role === "Admin"
                      ? "Admin Dashboard"
                      : role === "Instructor"
                      ? "Instructor Dashboard"
                      : "Purchase Courses")
                  }
                />
              </ListItemButton>
            )}

            <ListItemButton
              onClick={() => {
                setShowUpdateForm(true);
                setShowChangePassword(false);
              }}
            >
              <ListItemIcon>
                <HiOutlineUserCircle size={22} />
              </ListItemIcon>
              <ListItemText primary={!sidebarCollapsed && "Update Profile"} />
            </ListItemButton>

            <ListItemButton
              onClick={() => {
                setShowChangePassword(true);
                setShowUpdateForm(false);
              }}
            >
              <ListItemIcon>
                <MdLock size={22} />
              </ListItemIcon>
              <ListItemText primary={!sidebarCollapsed && "Change Password"} />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <MdLogout size={22} />
              </ListItemIcon>
              <ListItemText primary={!sidebarCollapsed && "Logout"} />
            </ListItemButton>
          </List>
        </Paper>

        {/* Main Content */}
        <Paper
          sx={{
            flexGrow: 1,
            p: 4,
            borderRadius: 3,
            boxShadow: 3,
            backgroundColor: "#f9f9f9",
          }}
        >
          {/* Show profile info */}
          {profile && !showUpdateForm && !showChangePassword && (
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Avatar
                src={profile.image}
                alt="Profile"
                sx={{ width: 120, height: 120, border: "2px solid #1976d2" }}
              />
              <Typography variant="h6">Full Name: {profile.fullName}</Typography>
              <Typography variant="body1">Phone: {profile.phone}</Typography>
              <Typography variant="body1">
                GitHub Username: {profile.gitHubUsername}
              </Typography>
              <Typography variant="body1">Bio: {profile.bio}</Typography>
            </Stack>
          )}

          {/* Update Profile Form */}
          {showUpdateForm && (
            <>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Update Profile
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={4}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Avatar
                  src={imageFile ? URL.createObjectURL(imageFile) : profile?.image}
                  alt="Profile"
                  sx={{ width: 120, height: 120, border: "2px solid #1976d2" }}
                />
                <Button variant="contained" component="label">
                  Upload Image
                  <input type="file" hidden onChange={handleImageChange} />
                </Button>
              </Stack>

              <Stack spacing={2}>
                <TextField
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="GitHub Username"
                  value={gitHubUsername}
                  onChange={(e) => setGitHubUsername(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{ mt: 2 }}
                >
                  Update Profile
                </Button>
              </Stack>
            </>
          )}

          {/* Change Password Form */}
          {showChangePassword && (
            <>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Change Password
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <TextField
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleChangePasswordSubmit}
                  sx={{ mt: 2 }}
                >
                  Change Password
                </Button>
              </Stack>
            </>
          )}
        </Paper>
      </Box>
    </>
  );
}
