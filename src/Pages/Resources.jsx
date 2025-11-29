import React from "react";
import { motion } from "framer-motion";
import "./Resources.css";

const Resources = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const resourceCategories = [
    {
      title: "E-Books & PDFs",
      desc: "Download free high-quality e-books, notes, and course modules.",
      icon: "📘",
    },
    {
      title: "Coding Practice Files",
      desc: "Starter templates, datasets, and project source files.",
      icon: "💻",
    },
    {
      title: "Cheat Sheets",
      desc: "One-page summaries for quick revision — AI, Web Dev, Python, etc.",
      icon: "📄",
    },
    {
      title: "Video Resources",
      desc: "Short concept videos & external curated playlists.",
      icon: "🎥",
    },
    {
      title: "Interview Kits",
      desc: "HR questions, coding patterns, resume templates, and more.",
      icon: "📝",
    },
    {
      title: "Community Links",
      desc: "Join Discord groups, forums, and support communities.",
      icon: "🌐",
    },
  ];

  return (
    <div className="resources-container">
      {/* Hero */}
      <motion.div
        className="resources-hero"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
      >
        <h1>Learning Resources Library 📚</h1>
        <p>
          Access curated study materials, templates, cheat sheets, and tools to
          support your learning journey.
        </p>
      </motion.div>

      {/* Categories */}
      <div className="resources-grid">
        {resourceCategories.map((item, index) => (
          <motion.div 
            key={index} 
            className="resource-card"
            whileHover={{ scale: 1.05 }}
          >
            <div className="resource-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <button>Explore</button>
          </motion.div>
        ))}
      </div>

      {/* Download Section */}
      <motion.div 
        className="download-section"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
      >
        <h2>Popular Downloads</h2>

        <div className="download-list">
          <div className="download-item">
            <span>📘 Python Basics Notes (PDF)</span>
            <button>Download</button>
          </div>

          <div className="download-item">
            <span>💻 React Starter Template (ZIP)</span>
            <button>Download</button>
          </div>

          <div className="download-item">
            <span>📄 AI Cheat Sheet (One-Page)</span>
            <button>Download</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Resources;
