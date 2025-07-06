import React, { useEffect, useRef } from "react";
import Navbar from "../pages/Navbar";
import gsap from "gsap";
import Hero from "./hero";
import Features from "./Feature";
import Doctors from "./Doctor";
import Footer from "./Footer";

const Landing = () => {
  const heroRef = useRef();
  const featureRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.from(heroRef.current, {
          opacity: 0,
          y: 40,
          duration: 1.2,
          ease: "power3.out",
        });
      }
  
      if (featureRef.current) {
        gsap.from(featureRef.current, {
          opacity: 0,
          y: 50,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.5,
        });
      }
    });
  
    return () => ctx.revert(); 
  }, []);
  

  return (
    <>
     <Navbar />
     <Hero />
     <Features />
     <Doctors />
     <Footer />
    </>
  );
};

export default Landing;
