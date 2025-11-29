import React from "react";
import { motion } from "framer-motion";
import "./SupportCenter.css";

const SupportCenter = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="support-container">
      {/* Hero */}
      <motion.div
        className="support-hero"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
      >
        <h1>Support Center 💬</h1>
        <p>Your questions matter. We’re here to help you learn smoothly.</p>
      </motion.div>

      {/* FAQ */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>

        <details>
          <summary>How do I reset my password?</summary>
          <p>You can reset it from the Login page → Forgot Password.</p>
        </details>

        <details>
          <summary>How do I download course materials?</summary>
          <p>Visit the Resources page and find downloadable files.</p>
        </details>

        <details>
          <summary>Why is my video not loading?</summary>
          <p>
            Check your internet connection or clear browser cache. If issue
            persists, contact support.
          </p>
        </details>
      </div>

      {/* Contact Section */}
      <motion.div
        className="contact-box"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
      >
        <h2>Still need help?</h2>
        <p>Our support team replies within 24 hours.</p>

        <form className="support-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Email Address" required />
          <textarea placeholder="Describe your issue..." required></textarea>
          <button type="submit">Submit Ticket</button>
        </form>
      </motion.div>
    </div>
  );
};

export default SupportCenter;
