import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#1F2937] text-gray-300 pt-12 pb-6 px-6 md:px-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h3 className="text-white text-2xl font-bold mb-3">MediCare+</h3>
          <p className="text-sm">
            Your trusted partner in digital healthcare management.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/register" className="hover:underline">Register</a></li>
            <li><a href="/login" className="hover:underline">Login</a></li>
            <li><a href="#services" className="hover:underline">Services</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <p className="text-sm">📍 New Delhi, India</p>
          <p className="text-sm">📞 +91 9876543210</p>
          <p className="text-sm">📧 support@medicareplus.com</p>
        </div>

        {/* Social (optional) */}
        <div>
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-4 text-white text-lg">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-600 mt-10 pt-4 text-center text-sm">
        © {new Date().getFullYear()} MediCare+. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
