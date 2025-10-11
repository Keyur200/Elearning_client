import React, { useState } from "react";
import { MdOutlineEmail, MdKey } from "react-icons/md";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

const Login = ({ closeModal, openRegister }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [user, setUser] = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:5000/auth/login",
        { email, password: pass },
        { withCredentials: true }
      );

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Login successful!",{ position: "top-center" });
        setUser(data.user);
        closeModal();

        // Ensure lowercase comparison for routing
        const role = data.user.role.toLowerCase();

        if (role === "admin") {
          navigate("/admin");
        } else if (role === "instructor") {
          navigate("/instructor");
        } else {
          navigate("/"); // Normal user goes to home
        }
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

        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* Login Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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

          <button
            type="submit"
            className="bg-[#ff385c] hover:bg-[#fbdee2] hover:text-[#ff385c] transition-colors duration-300 text-white font-semibold rounded-full py-3 text-lg mt-2"
          >
            Login
          </button>
        </form>

        {/* Switch to Register */}
        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => {
              closeModal();
              openRegister();
            }}
            className="text-[#ff385c] cursor-pointer font-semibold"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
