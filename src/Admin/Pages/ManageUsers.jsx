import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleName, setRoleName] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/auth/users", {
        method: "GET",
        credentials: "include",
      });

      if (res.status === 401) {
        Swal.fire("Unauthorized", "Please login first.", "error");
        return;
      }

      if (!res.ok) throw new Error("Failed to load users");

      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open popup with selected user
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setRoleName(user.role);
    setOpen(true);
  };

  // Close popup
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  // Change user role
  const handleChangeRole = async () => {
    if (!selectedUser || !roleName) return;

    try {
      const res = await fetch("http://localhost:5000/auth/change-role", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser._id,
          roleName,
        }),
      });

      if (res.status === 401) {
        Swal.fire("Unauthorized", "Please login first.", "error");
        return;
      }

      if (!res.ok) throw new Error("Failed to change user role");

      handleClose();

      Swal.fire({
        icon: "success",
        title: "Role Updated!",
        text: "User role changed successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchUsers();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Manage Users
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {/* Only show Edit button if user is not admin */}
                    {user.role !== "Admin" && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Popup */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit User Role</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          {selectedUser && (
            <>
              <TextField
                label="Name"
                value={selectedUser.name}
                fullWidth
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                value={selectedUser.email}
                fullWidth
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                select
                label="Role"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                fullWidth
              >
                <MenuItem value="Instructor">Instructor</MenuItem>
                <MenuItem value="User">User</MenuItem>
              </TextField>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleChangeRole}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ManageUsers;
