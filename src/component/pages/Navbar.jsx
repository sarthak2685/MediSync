import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";

const Navbar = () => {
  const navRef = useRef();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (navRef.current) {
        gsap.from(navRef.current, {
          y: -80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });
      }
    });
  
    return () => ctx.revert(); // Clean up on route change or unmount
  }, [location.pathname]);
  

  return (
    <nav
      ref={navRef}
      className="w-full shadow-md bg-white px-6 py-4 flex justify-between items-center z-50"
    >
      <Link to="/" className="text-2xl font-bold text-[#2C7BE5]">
        MediSync
      </Link>

      <ul className="flex gap-6 text-[#1F2937] font-medium">
        <li>
          <Link to="/" className="hover:text-[#00B894] transition-all">
            Home
          </Link>
        </li>
        {user ? (
  user.role === "patient" && (
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#2C7BE5] mr-2">
        <img
          src={user.avatar?.url || "/default-profile.png"}
          alt="User Profile"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
) : (
  <li>
    <Link to="/login" className="hover:text-[#00B894] transition-all">
      Login
    </Link>
  </li>
)}
      </ul>
    </nav>
  );
};

export default Navbar;
