import React, { useEffect, useState } from "react";
import { Box, Paper, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";

import ProfileSidebar from "./profile/ProfileSidebar";
import ProfileView from "./profile/ProfileView";
import UpdateProfileForm from "./profile/UpdateProfileForm";
import ChangePasswordForm from "./profile/ChangePasswordForm";
import EnrolledCourses from "./profile/EnrolledCourses";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);

  const [activeTab, setActiveTab] = useState("view");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserRole();
    fetchProfile();
  }, []);

  const fetchUserRole = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/user", {
        credentials: "include",
      });
      const data = await res.json();
      setRole(data.role);
    } catch {
      setRole(null);
    }
  };

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

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile)
    return (
      <CircularProgress size={50} sx={{ mt: 10, ml: 5 }} color="primary" />
    );

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", mt: 15, px: 2 }}>
        <ProfileSidebar
          role={role}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <Paper
          sx={{
            flexGrow: 1,
            p: 4,
            borderRadius: 3,
            boxShadow: 3,
            backgroundColor: "#fff",
          }}
        >
          {activeTab === "view" && (
            <ProfileView profile={profile} setActiveTab={setActiveTab} />
          )}

          {activeTab === "update" && (
            <UpdateProfileForm profile={profile} refresh={fetchProfile} />
          )}

          {activeTab === "password" && <ChangePasswordForm />}

          {activeTab === "courses" && <EnrolledCourses />}
        </Paper>
      </Box>
    </>
  );
}
