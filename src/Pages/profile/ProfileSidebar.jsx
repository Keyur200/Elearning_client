import React, { useState } from "react";
import {
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import { MdLock, MdLogout, MdDashboard, MdSchool } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function ProfileSidebar({ role, activeTab, setActiveTab }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

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

  return (
    <Paper
      sx={{
        width: collapsed ? 80 : 250,
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
      {/* Collapse Toggle */}
      <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        <IconButton onClick={() => setCollapsed(!collapsed)} size="small">
          <HiOutlineMenuAlt3 size={22} />
        </IconButton>
      </Stack>

      <List>
        {/* 1. Dashboard Logic based on Role */}
        {role === "Admin" ? (
          <ListItemButton onClick={() => navigate("/admin")}>
            <ListItemIcon>
              <MdDashboard size={22} />
            </ListItemIcon>
            <ListItemText primary={!collapsed && "Admin Dashboard"} />
          </ListItemButton>
        ) : role === "Instructor" ? (
          <ListItemButton onClick={() => navigate("/instructor")}>
            <ListItemIcon>
              <MdDashboard size={22} />
            </ListItemIcon>
            <ListItemText primary={!collapsed && "Instructor Dashboard"} />
          </ListItemButton>
        ) : (
          // 🟢 Student: Show "My Enrolled Courses"
          // This sets the activeTab to "courses" in the parent component
          <ListItemButton
            selected={activeTab === "courses"}
            onClick={() => setActiveTab("courses")}
          >
            <ListItemIcon>
              <MdSchool size={22} />
            </ListItemIcon>
            <ListItemText primary={!collapsed && "My Enrolled Courses"} />
          </ListItemButton>
        )}

        {/* 2. Update Profile Tab */}
        <ListItemButton
          selected={activeTab === "update" || activeTab === "view"}
          onClick={() => setActiveTab("view")} // Or 'update' depending on preference
        >
          <ListItemIcon>
            <HiOutlineUserCircle size={22} />
          </ListItemIcon>
          <ListItemText primary={!collapsed && "My Profile"} />
        </ListItemButton>

        {/* 3. Change Password Tab */}
        <ListItemButton
          selected={activeTab === "password"}
          onClick={() => setActiveTab("password")}
        >
          <ListItemIcon>
            <MdLock size={22} />
          </ListItemIcon>
          <ListItemText primary={!collapsed && "Change Password"} />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />

        {/* 4. Logout */}
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <MdLogout size={22} />
          </ListItemIcon>
          <ListItemText primary={!collapsed && "Logout"} />
        </ListItemButton>
      </List>
    </Paper>
  );
}