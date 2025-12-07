import React from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export default function ProfileView({ profile, setActiveTab }) {
  if (!profile) return null;

  return (
    <Stack spacing={3} alignItems="center">
      <Typography variant="h5" fontWeight="bold" color="primary">
        My Profile
      </Typography>

      <Avatar
        src={profile.image}
        sx={{
          width: 140,
          height: 140,
          border: "4px solid #1976d2",
          boxShadow: 2,
        }}
      />

      <Paper
        elevation={0}
        sx={{
          p: 3,
          bgcolor: "#f5f5f5",
          width: "100%",
          maxWidth: 600,
          borderRadius: 2,
        }}
      >
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight="bold" color="text.secondary">
              Full Name:
            </Typography>
            <Typography>{profile.fullName || "Not set"}</Typography>
          </Box>
          <Divider />
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight="bold" color="text.secondary">
              Phone:
            </Typography>
            <Typography>{profile.phone || "Not set"}</Typography>
          </Box>
          <Divider />

          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight="bold" color="text.secondary">
              GitHub:
            </Typography>
            <Typography>{profile.gitHubUsername || "Not set"}</Typography>
          </Box>
          <Divider />

          <Box>
            <Typography fontWeight="bold" color="text.secondary">
              Bio:
            </Typography>
            <Typography>{profile.bio || "No bio added yet."}</Typography>
          </Box>
        </Stack>
      </Paper>

      <Button variant="contained" onClick={() => setActiveTab("update")}>
        Edit Profile
      </Button>
    </Stack>
  );
}
