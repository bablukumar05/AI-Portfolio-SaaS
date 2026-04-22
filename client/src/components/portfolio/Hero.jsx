import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import profileImg from "./profile.png";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden w-full pt-20">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-secondary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-left"
        >
          <span className="text-secondary font-medium tracking-wider uppercase text-sm mb-4 block">Welcome to my world</span>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            Hi, I'm <br />
            <span className="text-gradient">A Developer</span>
          </h1>
          <p className="text-lg md:text-xl text-textMuted mb-10 max-w-lg">
            I craft responsive, scalable, and dynamic web applications. Explore my projects and contact me to build something amazing.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a href="#projects" className="px-8 py-4 bg-primary text-dark-900 rounded-full font-semibold hover:bg-white transition-colors duration-300 shadow-[0_0_20px_rgba(102,252,241,0.4)]">
              View My Work
            </a>
            <a href="#contact" className="px-8 py-4 glass text-white rounded-full font-medium hover:bg-white/10 transition-colors duration-300">
              Contact Me
            </a>
          </div>
        </motion.div>

        {/* Right Image Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative flex justify-center md:justify-end"
        >
          {/* Image Wrapper */}
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl z-10 bg-dark-800 flex items-center justify-center">
            <img
              src={profileImg}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 right-10 w-20 h-20 border-2 border-primary rounded-full animate-pulse z-0 hidden md:block"></div>
          <div className="absolute bottom-10 left-10 w-12 h-12 bg-secondary rounded-full animate-bounce z-20 opacity-80 hidden md:block"></div>
        </motion.div>
      </div>
    </section>
  );
}