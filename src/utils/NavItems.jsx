import React from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { id: 1, name: "Home", path: "/" },
  { id: 2, name: "AboutUs", path: "/AboutUs" },
  { id: 3, name: "Courses", path: "/Courses" },
  { id: 4, name: "Resources", path: "/Resources" },
  { id: 5, name: "SupportCenter", path: "/SupportCenter" },
];

const NavItems = ({ isMobile }) => {
  return (
    <div
      className={`${
        isMobile ? "flex flex-col gap-4" : "flex items-center gap-6"
      }`}
    >
      {navLinks.map((link) => (
        <Link
          key={link.id}
          to={link.path}
          className={`text-[18px] font-Poppins font-[500] ${
            isMobile
              ? "text-black hover:text-green-600" // mobile links
              : "text-black hover:text-green-600" // desktop links
          }`}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default NavItems;
