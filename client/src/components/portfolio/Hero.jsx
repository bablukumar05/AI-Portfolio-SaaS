import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import profileImg from "./profile.png";

export default function Hero({ data = {} }) {
  const {
    subheading = "Welcome to my world",
    heading = "Hi, I'm <br /> <span class='text-gradient'>A Developer</span>",
    description = "I craft responsive, scalable, and dynamic web applications. Explore my projects and contact me to build something amazing.",
    primaryButton = "View My Work",
    secondaryButton = "Contact Me"
  } = data;

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 10]);

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden w-full pt-20"
      style={{ position: "relative" }}
    >
      {/* Dynamic Background Blobs */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-0 right-[-5%] w-[600px] h-[600px] bg-secondary/5 dark:bg-secondary/10 rounded-full blur-[150px] pointer-events-none"
      />

      {/* Animated Mesh Grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(var(--primary) 0.5px, transparent 0.5px)", backgroundSize: "30px 30px" }}>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-left"
          style={{ y: y2 }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-secondary font-medium tracking-wider uppercase text-sm mb-4 block"
          >
            {subheading}
          </motion.span>
          <h1
            className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight"
            dangerouslySetInnerHTML={{ __html: heading }}
          />
          <p className="text-lg md:text-xl text-slate-600 dark:text-textMuted mb-10 max-w-lg">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a href="#projects" className="group relative px-8 py-4 bg-primary text-slate-900 dark:text-dark-900 rounded-full font-semibold overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(102,252,241,0.4)]">
              <span className="relative z-10">{primaryButton}</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </a>
            <a href="#contact" className="px-8 py-4 glass text-slate-800 dark:text-white rounded-full font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 border border-white/20">
              {secondaryButton}
            </a>
          </div>
        </motion.div>

        {/* Right Image Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative flex justify-center md:justify-end"
          style={{ y: y1, rotate }}
        >
          {/* Main Image with floating effect */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl z-10 bg-slate-100 dark:bg-dark-800"
          >
            <img
              src={profileImg}
              alt="Profile"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            {/* Glass Overlay on image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
          </motion.div>

          {/* Abstract Shapes */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 border-2 border-secondary/30 rounded-full z-0"></div>

          {/* Feature Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 -right-4 glass px-4 py-2 rounded-lg border border-white/20 z-20 shadow-xl hidden md:block"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span className="text-xs font-semibold text-white">Available for Work</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Modern Scroll Indicator */}
      <motion.div
        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer z-20"
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-primary to-transparent"></div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-textMuted mt-4 font-bold">Explore</span>
      </motion.div>
    </motion.section>
  );
}
