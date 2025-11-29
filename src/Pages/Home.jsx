import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// In Home.jsx
import heroImage from "./Home_Images/hero.png";
import genAiImage from "./Home_Images/ai.png";
import certiImage from "./Home_Images/certi.png";
import dsImage from "./Home_Images/data.png";
import webDevImage from "./Home_Images/web.png";

import aiImage from "./Home_Images/ai.png";


// Placeholder data for new sections
const TestimonialData = [
  { quote: "This platform changed my career path. The deep learning courses are exceptional.", author: "Sarah L.", role: "Data Scientist" },
  { quote: "The certifications gave me the confidence boost and knowledge I needed for a promotion.", author: "Mark J.", role: "Web Developer" },
  { quote: "The hands-on projects were directly applicable to my job. Highly recommend!", author: "Aisha K.", role: "Software Engineer" },
  { quote: "Excellent instructors and up-to-date content on AI and Machine Learning.", author: "David P.", role: "AI Engineer" },
];

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAllPublishedCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses/published");
      setCourses(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Populate courses with dummy data if API fails or returns too few for the new sections
    if (courses.length < 4 && !loading) {
      setCourses([
        { _id: '1', title: 'React JS Masterclass', price: 999, thumbnail: 'https://images.unsplash.com/photo-1633356122544-ad263c9b740b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhY3R8ZW58MHx8MHx8fDA%3D', description: 'Build modern applications with React and Hooks.' },
        { _id: '2', title: 'Python for Data Science', price: 1299, thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHB5dGhvbiUyMGNvZGV8ZW58MHx8MHx8fDA%3D', description: 'A comprehensive guide to Python data analysis.' },
        { _id: '3', title: 'AWS Certified Solutions Architect', price: 1999, thumbnail: 'https://images.unsplash.com/photo-1629854497184-486127117180?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YXdzfGVufDB8fDB8fHww', description: 'Prepare for the associate level certification.' },
        { _id: '4', title: 'UI/UX Design using Figma', price: 899, thumbnail: 'https://images.unsplash.com/photo-1626770020300-3532c1c68615?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHVpJTIwZGVzaWdufGVufDB8fDB8fHww', description: 'Master design principles and prototyping in Figma.' },
        ...courses, // Keep real courses if available
      ]);
    }
    getAllPublishedCourses();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="w-full">
      {/* ------------------------------------------------ HERO SECTION ------------------------------------------------ */}
      <div className="bg-gradient-to-r from-purple-700 to-blue-600 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h1 className="text-4xl font-extrabold leading-snug">
              Level up your skills with our best learning experience
            </h1>
            <p className="mt-4 text-lg opacity-90">
              Start learning today with expert-designed courses and real-world projects.
            </p>
            {/* Added hover interaction */}
            <button className="mt-6 px-6 py-3 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-100 transition transform hover:scale-[1.02]">
              Start Learning
            </button>
          </div>

          <img
            src={heroImage}
            className="rounded-xl shadow-xl w-full"
            alt="Learning banner"
          />
        </div>
      </div>

      {/* ------------------------------------------------ NEW SECTION: GROW YOUR TEAM'S SKILLS ------------------------------------------------ */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Grow your team's skills and your business</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Build your team with some of the best plans or programs for your business
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Team Plan - Added hover interaction */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col transition duration-300 hover:shadow-2xl transform hover:-translate-y-1">
              <h3 className="text-xl font-bold mb-2">Team Plan</h3>
              <p className="text-gray-500 text-sm mb-4">
                🧑‍🤝‍🧑 More than 20 people - For your team
              </p>
              {/* Added hover interaction to button */}
              <button className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition transform hover:scale-[1.02]">
                Start Subscription
              </button>
              <div className="mt-6">
                <p className="text-lg font-bold mb-2">₹12,000 a month per user</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> Access to 10,000+ top courses
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> Certification prep
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> Personalized recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> Hands-on projects
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> Analytics and adoption reports
                  </li>
                </ul>
              </div>
            </div>

            {/* Enterprise Plan - Added hover interaction */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col transition duration-300 hover:shadow-2xl transform hover:-translate-y-1">
              <h3 className="text-xl font-bold mb-2">Enterprise Plan</h3>
              <p className="text-gray-500 text-sm mb-4">
                🏢 More than 200 people - For your whole organization
              </p>
              {/* Added hover interaction to button */}
              <button className="w-full px-4 py-2 border border-purple-600 text-purple-600 font-semibold rounded-md hover:bg-purple-50 transition transform hover:scale-[1.02]">
                Request a demo
              </button>
              <div className="mt-6">
                <p className="text-lg font-bold mb-2">Contact sales for pricing</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> Access to 20,000+ top courses
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> Custom learning paths
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> Dedicated account manager
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> Advanced analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> Single sign-on (SSO)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> API integration
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> 24/7 priority support
                  </li>
                </ul>
              </div>
            </div>

            {/* AI Fluency / AI Readiness Collection - Added hover interaction */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col transition duration-300 hover:shadow-2xl transform hover:-translate-y-1">
              <h3 className="text-xl font-bold mb-2">AI Fluency</h3>
              <p className="text-gray-500 text-sm mb-4">
                🤖 AI Readiness for Enterprise Transformation
              </p>
              {/* Added hover interaction to button */}
              <button className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition transform hover:scale-[1.02]">
                Contact Us
              </button>
              <div className="mt-6">
                <p className="text-lg font-bold mb-2">AI Readiness Collection</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> More than 50+ courses
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> Hands-on AI projects
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> Custom AI workshops
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> Expert-led AI training
                  </li>
                </ul>
                <p className="text-lg font-bold mt-6 mb-2">AI Growth Collection</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> 100+ specialized courses
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✔</span> Advanced AI certifications
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ CATEGORIES ------------------------------------------------ */}
      <div className="max-w-6xl mx-auto mt-10 px-2"> {/* Reduced from mt-14 */}
        <h2 className="text-3xl font-bold mb-6">Learn essential skills</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Generative AI", img: genAiImage, description: "Explore the future of AI technology and tools." },
            { name: "IT Certifications", img: certiImage, description: "Validate your skills with industry-recognized certifications." },
            { name: "Data Science", img: dsImage, description: "Master data analysis, modeling, and interpretation." },
            { name: "Web Development", img: webDevImage, description: "Build modern, responsive websites and applications." },
          ].map((category, idx) => (
            <div key={idx}className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer overflow-hidden group border border-gray-100 transform hover:-translate-y-1"
            >
              <div className="relative h-44 overflow-hidden">
                {/* Zooming effect on image hover is already here (group-hover:scale-110) */}
                <img 
                  src={category.img} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-xl mb-1 text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------ NEW SECTION: TESTIMONIALS ------------------------------------------------ */}
      <div className="mt-10 py-16 px-4 bg-yellow-50"> {/* Reduced from mt-20 */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Hear from Our Learners 🗣️</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TestimonialData.map((testimonial, index) => (
              // Added hover interaction for testimonial card
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-purple-600 hover:shadow-2xl transition duration-300 transform hover:scale-[1.02]">
                <p className="text-lg italic text-gray-700 mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="pt-4 border-t border-gray-100">
                    <p className="font-semibold text-purple-600">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ FEATURED SECTION ------------------------------------------------ */}
      <div className="mt-10 bg-gray-100 py-12 px-4"> {/* Reduced from mt-20 */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold leading-snug">
              Reimagine your career in the AI era
            </h2>
            <p className="mt-3 text-gray-700">
              Build job-ready skills with hands-on training and guidance from experts.
            </p>

            <ul className="mt-5 space-y-3">
              <li className="flex items-center gap-2 text-gray-700"><span className="text-purple-600 font-bold">✔</span> Learn AI and more</li>
              <li className="flex items-center gap-2 text-gray-700"><span className="text-purple-600 font-bold">✔</span> Prepare for certifications</li>
              <li className="flex items-center gap-2 text-gray-700"><span className="text-purple-600 font-bold">✔</span> Advance your career</li>
            </ul>

            {/* Added hover interaction to button */}
            <button className="mt-6 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition transform hover:scale-[1.02]">
              Explore Programs
            </button>
          </div>

          <img
            src={aiImage}
            className="rounded-xl shadow-xl w-full"
            alt="AI Learning"
          />
        </div>
      </div>

      {/* ------------------------------------------------ PUBLISHED COURSES ------------------------------------------------ */}
      <div className="max-w-6xl mx-auto mt-10 px-4"> {/* Reduced from mt-20 */}
        <h2 className="text-3xl font-bold mb-6 text-center">Published Courses</h2>

        {loading ? (
          <p className="text-center text-lg font-semibold">Loading...</p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
              {courses.slice(0, visibleCount).map((course) => (
                <div
                  key={course._id}
                  // Added hover interaction for course card
                  className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden cursor-pointer transform hover:-translate-y-1 hover:scale-[1.01]"
                  onClick={() => navigate(`/course/${course._id}`)}
                >
                  <div className="relative">
                    <img
                      src={course.thumbnail || "/default-course.jpg"}
                      alt={course.title}
                      className="w-full h-48 object-cover hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-lg truncate">{course.title}</h3>
                    <p className="text-gray-600 h-12 overflow-hidden mt-2 text-sm">
                      {course.description}
                    </p>

                    <p className="mt-3 text-purple-600 font-bold text-lg">
                      ₹{course.price}
                    </p>

                    {/* Added hover interaction to button */}
                    <button
                      className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition transform hover:scale-[1.02]"
                    >
                      View Course
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < courses.length && (
              <div className="text-center mt-8">
                {/* Added hover interaction to button */}
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 border border-purple-500 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition transform hover:scale-[1.02]"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* ------------------------------------------------ NEW SECTION: CALL TO ACTION (CTA) ------------------------------------------------ */}
      <div className="mt-10 py-16 px-4 bg-purple-700 text-white"> {/* Reduced from mt-20 */}
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-3xl mx-auto">
            Get unlimited access to thousands of courses and job-ready certifications.
          </p>
          <div className="flex justify-center space-x-4">
            {/* Added hover interaction to button */}
            <button className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg shadow-lg hover:bg-yellow-300 transition transform hover:scale-105">
              Enroll Now
            </button>
            {/* Added hover interaction to button */}
            <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-purple-700 transition transform hover:scale-105">
              View All Courses
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ TRENDING COURSES (Added colored background) ------------------------------------------------ */}
      <div className="bg-blue-50 py-16 px-4"> {/* Removed mt-20 */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Trending Courses</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {courses.slice(0, 4).map((course) => (
              <div
                key={course._id}
                // Added hover interaction for course card
                className="bg-white rounded-xl shadow hover:shadow-xl p-4 transition cursor-pointer transform hover:-translate-y-1 hover:scale-[1.01]"
                onClick={() => navigate(`/course/${course._id}`)}
              >
                <img
                  src={course.thumbnail}
                  className="rounded-lg h-40 w-full object-cover"
                  alt={course.title}
                />
                <h4 className="mt-3 font-semibold truncate">{course.title}</h4>
                <p className="text-gray-500 text-sm mt-1">4.5 Rating | 12k Learners</p>
                <p className="text-purple-600 font-bold mt-1">₹{course.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ POPULAR SKILLS (Added colored background) ------------------------------------------------ */}
      {/* Reduced bottom padding to integrate better with an assumed Footer */}
      <div className="bg-indigo-50 py-16 px-4 pb-12"> 
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Popular Skills</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {["Python", "AI", "Web Development", "Data Science", "AWS", "UI/UX", "Machine Learning", "Cloud Computing"].map(
              (skill, idx) => (
                <div
                  key={idx}
                  // Added hover interaction for skill card
                  className="p-5 bg-white rounded-xl shadow  text-center cursor-pointer transition transform hover:scale-105 hover:shadow-xl"
                >
                  <h3 className="font-semibold text-lg text-indigo-700">{skill}</h3>
                  <p className="text-sm text-gray-500 mt-1">20+ Courses</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Placeholder for where your Footer component would typically go */}
      {/* <Footer /> */} 
    </div>
  );
};

export default Home;