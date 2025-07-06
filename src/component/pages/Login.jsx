import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Login = () => {
  const formRef = useRef();
  const bgAnimRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Animate form entrance
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
    }

    // Animate background blobs
    bgAnimRef.current.forEach((el, i) => {
      gsap.to(el, {
        y: i % 2 === 0 ? 25 : -25,
        repeat: -1,
        yoyo: true,
        duration: 4 + i,
        ease: "sine.inOut",
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      console.log(res.data);
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
  
      // Redirect based on role
      const role = res.data.user.role;
      if (role === "admin") navigate("/admin");
      else if (role === "doctor") navigate("/doctor/dashboard");
      else navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen flex items-center justify-center bg-[#F9FAFB] overflow-hidden px-4">
        {/* Floating animated blobs */}
        <div
          ref={(el) => (bgAnimRef.current[0] = el)}
          className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#2C7BE5] opacity-30 rounded-full blur-3xl z-0"
        />
        <div
          ref={(el) => (bgAnimRef.current[1] = el)}
          className="absolute bottom-[-120px] right-[-100px] w-[400px] h-[400px] bg-[#00B894] opacity-20 rounded-full blur-3xl z-0"
        />
        <div
          ref={(el) => (bgAnimRef.current[2] = el)}
          className="absolute top-[30%] left-[50%] w-[200px] h-[200px] bg-[#FFD166] opacity-25 rounded-full blur-2xl transform -translate-x-1/2 z-0"
        />

        {/* Login Card */}
        <div
          ref={formRef}
          className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-2xl px-10 py-12"
        >
          <h2 className="text-3xl font-bold text-[#2C7BE5] mb-8 text-center">
            Welcome Back 👋
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative mb-8">
              <input
                type="email"
                id="email"
                className="block w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:border-[#2C7BE5] focus:ring-0 outline-none"
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-[#2C7BE5]"
              >
                Email Address
              </label>
            </div>

            {/* Password Input */}
            <div className="relative mb-8">
              <input
                type="password"
                id="password"
                className="block w-full px-0 py-2 border-0 border-b-2 border-gray-300 focus:border-[#2C7BE5] focus:ring-0 outline-none"
                placeholder=" "
                required
              />
              <label
                htmlFor="password"
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-[#2C7BE5]"
              >
                Password
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#2C7BE5] hover:bg-[#1a5fd1] transition-all text-white py-3 rounded-md font-semibold mt-4"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-500">
            Don't have an account?{" "}
            <a href="/register" className="text-[#00B894] hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;