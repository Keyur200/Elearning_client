import React from "react";
import { motion } from "framer-motion";
import "./AboutUs.css";

// 🖼 Existing images
import img1 from "./About_Images/1.png";
import img2 from "./About_Images/2.png";
import img3 from "./About_Images/3.png";
import img4 from "./About_Images/4.png";

// 🆕 New Section Images (replace URLs as per your assets)
// 👉 Paste your actual category image URLs in these 4 placeholders
import img5 from "./About_Images/5.png"; // AI
import img6 from "./About_Images/6.png"; // Web Dev
import img7 from "./About_Images/7.png"; // Data Science
import img8 from "./About_Images/8.png"; // UI/UX

// 👉 Partner logos (replace with your actual or brand logos)
import logo1 from "./About_Images/logo1.png";
import logo2 from "./About_Images/logo2.png";
import logo3 from "./About_Images/logo3.png";
import logo4 from "./About_Images/logo4.png";
import logo5 from "./About_Images/logo5.png";

const AboutUs = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="aboutus-container">
      {/* 🌍 Hero Section */}
      <motion.div
        className="aboutus-hero"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
      >
        <h1>Empowering Learners Worldwide 🌍</h1>
        <p>
          Our mission is to bring high-quality education to every learner and
          educator. Learn at your own pace with top instructors and real-world
          projects.
        </p>
      </motion.div>

      {/* 📸 Gallery Section */}
      <motion.div
        className="aboutus-gallery"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
      >
        {[img1, img2, img3, img4].map((img, i) => (
          <motion.div
            key={i}
            className="aboutus-card"
            whileHover={{ scale: 1.05 }}
          >
            <img src={img} alt={`About ${i}`} />
            <div className="aboutus-text">
              <h3>Transform Your Learning</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 📊 Stats Section */}
      <motion.div
        className="aboutus-stats"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
      >
        <div>
          <h2>10K+</h2>
          <p>Students Enrolled</p>
        </div>
        <div>
          <h2>500+</h2>
          <p>Courses Available</p>
        </div>
        <div>
          <h2>300+</h2>
          <p>Expert Instructors</p>
        </div>
        <div>
          <h2>95%</h2>
          <p>Learner Satisfaction</p>
        </div>
      </motion.div>

      {/* 📚 Learning Categories */}
      <motion.div
        className="learning-categories"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
      >
        <h2>Explore Our Learning Categories</h2>
        <p>
          Discover trending topics designed to boost your skills and career
          growth.
        </p>
        <div className="category-grid">
          {[img5, img6, img7, img8].map((cat, index) => (
            <motion.div
              className="category-card"
              key={index}
              whileHover={{ scale: 1.05 }}
            >
              <img src={cat} alt={`Category ${index}`} />
              <h3>
                {
                  [
                    "Artificial Intelligence",
                    "Web Development",
                    "Data Science",
                    "UI/UX Design",
                  ][index]
                }
              </h3>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 🚀 Career Growth */}
      <motion.div
        className="career-growth"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
      >
        <h2>Reimagine Your Career in the AI Era</h2>
        <p>Upgrade your skills with expert mentorship and job-ready programs.</p>
        <div className="career-box">
          <motion.h3 whileHover={{ scale: 1.1 }}>🚀 Learn AI and more</motion.h3>
          <motion.h3 whileHover={{ scale: 1.1 }}>
            🎯 Prep for Certifications
          </motion.h3>
          <motion.h3 whileHover={{ scale: 1.1 }}>
            💼 Advance Your Career
          </motion.h3>
        </div>
      </motion.div>

      {/* 💬 Testimonials */}
      <motion.div
        className="testimonials"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
      >
        <h2>What Our Learners Say</h2>
        <div className="testimonial-grid">
          <motion.div
            className="testimonial-card"
            whileHover={{ scale: 1.05 }}
          >
            <p>"This platform helped me transition into tech with confidence!"</p>
            <h4>- Priya Sharma</h4>
          </motion.div>
          <motion.div
            className="testimonial-card"
            whileHover={{ scale: 1.05 }}
          >
            <p>
              "Instructors are truly experts — every course is practical and
              engaging."
            </p>
            <h4>- Rohan Patel</h4>
          </motion.div>
          <motion.div
            className="testimonial-card"
            whileHover={{ scale: 1.05 }}
          >
            <p>
              "The AI Career Accelerator program completely transformed my
              learning journey."
            </p>
            <h4>- Neha Joshi</h4>
          </motion.div>
        </div>
      </motion.div>

      {/* 🤝 Our Partners */}
     {/* 🤝 Our Partners / Trusted By (Continuous Scroll Version) */}
      <motion.div
        className="partners"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
      >
        <h2>Our Partners / Trusted By</h2>

        <div className="partner-slider">
          <div className="partner-track">
            {[logo1, logo2, logo3, logo4, logo5, logo1, logo2, logo3, logo4, logo5].map(
              (logo, i) => (
                <img key={i} src={logo} alt={`Partner ${i}`} />
              )
            )}
          </div>

          {/* Duplicate for seamless infinite effect */}
          <div className="partner-track">
            {[logo1, logo2, logo3, logo4, logo5, logo1, logo2, logo3, logo4, logo5].map(
              (logo, i) => (
                <img key={`dup-${i}`} src={logo} alt={`Partner duplicate ${i}`} />
              )
            )}
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default AboutUs;
