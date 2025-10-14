import React from "react";
import { Routes, Route } from "react-router-dom";
import CategoryList from "./Category/CategoryList";
import AddCategory from "./Category/AddCategory";
import EditCategory from "./Category/EditCategory";

const Category = () => {
  return (
    <Routes>
      <Route index element={<CategoryList />} /> {/* /admin/category */}
      <Route path="add" element={<AddCategory />} /> {/* /admin/category/add */}
      <Route path="edit/:id" element={<EditCategory />} /> {/* /admin/category/edit/:id */}
    </Routes>
  );
};

export default Category;
