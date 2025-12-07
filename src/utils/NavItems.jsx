import React from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { id: 1, name: "Home", path: "/" },
  { id: 2, name: "About Us", path: "/about" },
  { id: 3, name: "Courses", path: "/courses" },
  // 👇 Updated: Changed "Resources" to "FAQ"
  { id: 4, name: "FAQ", path: "/faq" }, 
  { id: 5, name: "Support Center", path: "/contact" }, // Optional: You might want to point this to a contact page
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
          className={`text-[18px] font-Poppins font-[500] transition-colors duration-300 ${
            isMobile
              ? "text-black hover:text-indigo-600" // Mobile hover color
              : "text-black hover:text-indigo-600" // Desktop hover color
          }`}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default NavItems;