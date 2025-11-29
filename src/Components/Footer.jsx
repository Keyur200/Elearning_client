import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#111827] text-gray-300 pt-14 pb-6 mt-20">
      {/* Top Section */}
      <div className="w-[90%] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* Column 1 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Top Categories</h3>
          <ul className="space-y-2">
            <li className="hover:text-white hover:translate-x-1 transition cursor-pointer">Web Development</li>
            <li className="hover:text-white hover:translate-x-1 transition cursor-pointer">Programming</li>
            <li className="hover:text-white hover:translate-x-1 transition cursor-pointer">Data Science</li>
            <li className="hover:text-white hover:translate-x-1 transition cursor-pointer">UI/UX Design</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li onClick={() => navigate("/about")} className="hover:text-white hover:translate-x-1 transition cursor-pointer">About Us</li>
            <li onClick={() => navigate("/courses")} className="hover:text-white hover:translate-x-1 transition cursor-pointer">Courses</li>
            <li onClick={() => navigate("/resources")} className="hover:text-white hover:translate-x-1 transition cursor-pointer">Resources</li>
            <li onClick={() => navigate("/support")} className="hover:text-white hover:translate-x-1 transition cursor-pointer">Support Center</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2">
            <li className="hover:text-white hover:translate-x-1 transition cursor-pointer">Careers</li>
            <li className="hover:text-white hover:translate-x-1 transition cursor-pointer">Contact</li>
            <li className="hover:text-white hover:translate-x-1 transition cursor-pointer">Terms of Use</li>
            <li className="hover:text-white hover:translate-x-1 transition cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Connect With Us</h3>
          <div className="flex items-center gap-5">
            <a className="p-3 rounded-full bg-gray-800 hover:bg-white hover:text-black transition cursor-pointer">
              <FaFacebookF size={18} />
            </a>
            <a className="p-3 rounded-full bg-gray-800 hover:bg-white hover:text-black transition cursor-pointer">
              <FaInstagram size={18} />
            </a>
            <a className="p-3 rounded-full bg-gray-800 hover:bg-white hover:text-black transition cursor-pointer">
              <FaLinkedin size={18} />
            </a>
            <a className="p-3 rounded-full bg-gray-800 hover:bg-white hover:text-black transition cursor-pointer">
              <FaYoutube size={18} />
            </a>
          </div>
        </div>

      </div>

      {/* Divider */}
      <div className="w-full border-t border-gray-600 mt-10 pt-6">
        <div className="w-[90%] mx-auto flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          
          <div className="font-semibold text-white text-xl mb-2 md:mb-0 cursor-pointer" onClick={() => navigate("/")}>
            ELearning
          </div>

          <p>© 2025 ELearning. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
