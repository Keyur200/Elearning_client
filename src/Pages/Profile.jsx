import React, { useState, useEffect } from "react";
import { Box, Paper, CircularProgress, Typography, Button, Stack } from "@mui/material";
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
  const [isNewProfile, setIsNewProfile] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserRole();
    fetchProfile();
  }, []);

  const fetchUserRole = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/user", { credentials: "include" });
      if (res.status === 401) {
        setRole(null);
        return;
      }
      const data = await res.json();
      setRole(data.role);
    } catch (err) {
      console.error(err);
      setRole(null);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/profile", { credentials: "include" });

      if (res.status === 401) {
        Swal.fire("Unauthorized", "Please login to access this page.", "error");
        navigate("/login");
        return;
      }

      if (res.status === 404) {
        // Profile does not exist → show create option
        setProfile(null);
        setIsNewProfile(true);
        return;
      }

      const data = await res.json();
      setProfile(data.profile || data);
      setIsNewProfile(false);
    } catch (err) {
      console.error(err);
      setProfile(null);
      setIsNewProfile(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress size={60} />
      </Box>
    );

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", mt: 15, px: 2 }}>
        <ProfileSidebar role={role} activeTab={activeTab} setActiveTab={setActiveTab} />

        <Paper sx={{ flexGrow: 1, p: 4, borderRadius: 3, boxShadow: 3, backgroundColor: "#fff" }}>
          {activeTab === "view" && (
            <>
              {profile ? (
                <ProfileView profile={profile} setActiveTab={setActiveTab} />
              ) : (
                <Stack spacing={2} alignItems="center" sx={{ mt: 5 }}>
                  <Typography variant="h6" color="text.secondary">
                    No profile found.
                  </Typography>
                  <Button variant="contained" onClick={() => setActiveTab("update")}>
                    Create Profile
                  </Button>
                </Stack>
              )}
            </>
          )}

          {activeTab === "update" && (
            <UpdateProfileForm
              profile={profile}
              refreshProfile={fetchProfile}
              setActiveTab={setActiveTab}
              isNewProfile={isNewProfile} // Pass this flag
            />
          )}

          {activeTab === "password" && <ChangePasswordForm />}
          {activeTab === "courses" && <EnrolledCourses />}
        </Paper>
      </Box>
    </>
  );
}
