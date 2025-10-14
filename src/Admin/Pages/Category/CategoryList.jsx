import React, { useEffect, useState, useCallback } from "react";
import {
  Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, Typography,
  Divider, Box, Stack, Button, TextField, MenuItem, InputAdornment
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";

export default function CategoryList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");

  const navigate = useNavigate();

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "GET",
        credentials: "include", // Send HttpOnly cookie automatically
      });

      if (res.status === 401) {
        Swal.fire("Unauthorized", "Please login to access this page.", "error");
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch categories");

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setRows(data);
        setFilteredRows(data);
      } else {
        setRows([]);
        setFilteredRows([]);
        setMessage("No categories found.");
      }
    } catch (err) {
      setMessage(err.message || "Error fetching categories");
    }
  };

  // Search and sort
  const handleSearchAndSort = useCallback(() => {
    let temp = [...rows];
    if (searchTerm) {
      temp = temp.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (sortKey === "name") {
      temp.sort((a, b) => a.name.localeCompare(b.name));
    }
    setFilteredRows(temp);
    setPage(0);
  }, [rows, searchTerm, sortKey]);

  useEffect(() => handleSearchAndSort(), [handleSearchAndSort]);

  // Pagination handlers
  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  // Delete category
  const deleteCategory = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the category permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5000/api/categories/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (res.status === 401) {
          Swal.fire("Unauthorized", "Please login again.", "error");
          navigate("/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to delete category");

        Swal.fire("Deleted!", "Category deleted successfully.", "success");
        setRows(prev => prev.filter(c => c._id !== id));
      } catch (err) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  // Export CSV
  const exportToCSV = () => {
    const data = filteredRows.map(c => ({
      ID: c._id,
      Name: c.name,
      Description: c.description || "No Description",
      Image: c.image || "No Image"
    }));
    const csv = Papa.unparse(data);
    saveAs(new Blob([csv], { type: "text/csv;charset=utf-8;" }), "categories.csv");
  };

  // Image URL helper
  const getImageSrc = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return img.startsWith("/") ? `http://localhost:5000${img}` : `http://localhost:5000/${img}`;
  };

  return (
    <Paper sx={{ width: "98%", p: 2, overflow: "hidden" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Categories List</Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Top controls */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search by name"
          size="small"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />
        <TextField
          select
          label="Sort by"
          size="small"
          value={sortKey}
          onChange={e => setSortKey(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="name">Name (A-Z)</MenuItem>
        </TextField>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" onClick={exportToCSV}>Export</Button>
        <Button
          variant="contained"
          endIcon={<AddCircleIcon />}
          onClick={() => navigate("/admin/category/add")}
        >
          Add
        </Button>
      </Stack>

      {message && <Typography color="error">{message}</Typography>}

      {/* Categories table */}
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No categories found.</TableCell>
              </TableRow>
            ) : (
              filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((c, i) => (
                <TableRow key={c._id}>
                  <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.description || "No Description"}</TableCell>
                  <TableCell>
                    {c.image ? <img src={getImageSrc(c.image)} alt={c.name} width={80} height={50} style={{ objectFit: "cover", borderRadius: 4 }} /> : "No Image"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      sx={{ mr: 1 }}
                      onClick={() => navigate(`/admin/category/edit/${c._id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteCategory(c._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 25, 100]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
