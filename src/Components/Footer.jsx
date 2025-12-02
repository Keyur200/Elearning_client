import React from "react";
import {
  BookOpen,
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Mail,
  Phone
} from "lucide-react";

const Footer = () => (
  <footer className="bg-indigo-900 text-indigo-100 pt-16 pb-8">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-yellow-400 p-1.5 rounded-lg">
              <BookOpen className="text-indigo-900 w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              LearnHub
            </span>
          </div>

          <p className="text-indigo-200 text-sm leading-relaxed mb-6">
            LearnHub is your gateway to mastering new skills. We provide
            high-quality courses taught by industry experts.
          </p>

          <div className="flex gap-4">
            <div className="w-8 h-8 bg-indigo-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-indigo-900 transition-colors cursor-pointer">
              <Facebook className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 bg-indigo-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-indigo-900 transition-colors cursor-pointer">
              <Twitter className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 bg-indigo-800 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-indigo-900 transition-colors cursor-pointer">
              <Instagram className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-6">About</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Courses</a></li>
            <li><a href="#" className="hover:text-white">Instructor</a></li>
            <li><a href="#" className="hover:text-white">Events</a></li>
            <li><a href="#" className="hover:text-white">Become a Teacher</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-6">Links</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="hover:text-white">News & Blogs</a></li>
            <li><a href="#" className="hover:text-white">Library</a></li>
            <li><a href="#" className="hover:text-white">Gallery</a></li>
            <li><a href="#" className="hover:text-white">Partners</a></li>
            <li><a href="#" className="hover:text-white">Career</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold text-lg mb-6">Support</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="w-5 h-5 text-yellow-400" />
              <span>123 Education Street, Learning City</span>
            </li>
            <li className="flex gap-3">
              <Mail className="w-5 h-5 text-yellow-400" />
              <span>support@learnhub.com</span>
            </li>
            <li className="flex gap-3">
              <Phone className="w-5 h-5 text-yellow-400" />
              <span>+1 (555) 000-1234</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-indigo-800 pt-8 text-center text-sm text-indigo-300 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2024 LearnHub. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Use</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
