import React, { useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

const FAQ = () => {
  // State to track which accordion item is open
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I purchase a course?",
      answer:
        "Simply create an account, browse our catalog, and click the 'Buy Now' or 'Enroll' button on the course details page. We support secure payments via credit card and PayPal.",
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer:
        "Yes, we offer a 30-day money-back guarantee for most courses. If you are unsatisfied with the content, please contact support within 30 days of purchase.",
    },
    {
      question: "Do I get a certificate after completion?",
      answer:
        "Absolutely! Once you complete all the lessons and quizzes in a course, you will be able to download a verified certificate of completion from your dashboard.",
    },
    {
      question: "Are the courses lifetime access?",
      answer:
        "Yes! Once you purchase a course, you have unlimited lifetime access to the course materials, including any future updates added by the instructor.",
    },
    {
      question: "How can I become an instructor?",
      answer:
        "We are always looking for experts! Go to your profile menu and select 'Become an Instructor' to fill out an application. Once approved, you can start creating courses.",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 pt-28 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-lg">
            Have questions? We're here to help.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300"
            >
              {/* Question Header */}
              <button
                className={`w-full px-6 py-5 text-left flex justify-between items-center transition-colors duration-300 ${
                  activeIndex === index ? "bg-blue-50" : "bg-white hover:bg-gray-50"
                }`}
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium text-gray-800">
                  {item.question}
                </span>
                <span className="text-blue-600">
                  {activeIndex === index ? (
                    <HiChevronUp size={24} />
                  ) : (
                    <HiChevronDown size={24} />
                  )}
                </span>
              </button>

              {/* Answer Body */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Still have questions?{" "}
            <a href="/contact" className="text-blue-600 font-semibold hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;