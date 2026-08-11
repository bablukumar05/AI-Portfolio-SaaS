import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState("default");
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring config for the outer ring (fast, subtle lag)
  const springConfig = { damping: 25, stiffness: 400, mass: 0.2 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Hide native cursor globally
    const style = document.createElement("style");
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);

    const updateMousePosition = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      if (!e.target) return;
      const tag = e.target.tagName;
      if (
        tag === 'A' || tag === 'BUTTON' || 
        e.target.closest('a') || e.target.closest('button') ||
        e.target.classList?.contains('cursor-pointer')
      ) {
        setCursorState("hover");
      } else if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'LI'].includes(tag)) {
        setCursorState("text");
      } else {
        setCursorState("default");
      }
    };

    const handleMouseDown = () => setCursorState("click");
    const handleMouseUp = () => setCursorState("default");

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.head.removeChild(style);
    };
  }, [cursorX, cursorY]);

  // Subtle outer ring
  const ringVariants = {
    default: {
      scale: 1,
      opacity: 1,
      backgroundColor: "rgba(102, 252, 241, 0)",
      border: "1px solid rgba(102, 252, 241, 0.4)",
    },
    hover: {
      scale: 1.5,
      opacity: 1,
      backgroundColor: "rgba(102, 252, 241, 0.1)",
      border: "1px solid rgba(102, 252, 241, 0)",
    },
    text: {
      scale: 0.5,
      opacity: 0,
    },
    click: {
      scale: 0.8,
      opacity: 1,
      backgroundColor: "rgba(102, 252, 241, 0.2)",
    }
  };

  // Tiny precision dot
  const dotVariants = {
    default: { scale: 1, opacity: 1 },
    hover: { scale: 0, opacity: 0 },
    text: { scale: 1, opacity: 0.5 },
    click: { scale: 0.5, opacity: 1 }
  };

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          marginLeft: "-12px",
          marginTop: "-12px",
        }}
        variants={ringVariants}
        animate={cursorState}
        transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
      />
      
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full pointer-events-none z-[10000] hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          marginLeft: "-3px",
          marginTop: "-3px",
        }}
        variants={dotVariants}
        animate={cursorState}
        transition={{ duration: 0.1 }}
      />
    </>
  );
}
