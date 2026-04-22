import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
      aria-label="Toggle Dark Mode"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
         {theme === "dark" ? (
          <FiSun className="text-xl text-yellow-400 hover:text-yellow-300" />
        ) : (
          <FiMoon className="text-xl text-slate-800 hover:text-slate-600" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
