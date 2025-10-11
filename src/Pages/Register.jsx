import React, { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdKey, MdOutlineEmail } from "react-icons/md";
import axios from "axios";
import { toast } from "react-hot-toast";

const Register = ({ closeModal, openLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:5000/auth/register",
        { name, email, password: pass }
      );

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Registration successful! Please login.",{ position: "top-center" });
        // Close register modal and open login modal
        closeModal();
        openLogin();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.",{ position: "top-center" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl w-full max-w-md relative shadow-lg text-black">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-black font-bold text-xl"
          onClick={closeModal}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {/* Register Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#ff385c]">
            <FaRegUser className="text-[#ff385c] text-xl" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="outline-none w-full py-2 text-gray-700"
              required
            />
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#ff385c]">
            <MdOutlineEmail className="text-[#ff385c] text-xl" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="outline-none w-full py-2 text-gray-700"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[#ff385c]">
            <MdKey className="text-[#ff385c] text-xl" />
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Password"
              className="outline-none w-full py-2 text-gray-700"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[#ff385c] hover:bg-[#fbdee2] hover:text-[#ff385c] transition-colors duration-300 text-white font-semibold rounded-full py-3 text-lg mt-2"
          >
            Register
          </button>
        </form>

        {/* Switch to Login */}
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => {
              closeModal();
              openLogin();
            }}
            className="text-[#ff385c] cursor-pointer font-semibold"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
