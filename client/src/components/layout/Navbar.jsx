import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { HiMenuAlt3, HiX, HiSun, HiMoon } from "react-icons/hi";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { token, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", path: "/" },
    { name: "Features", path: "#features" },
    { name: "Blog", path: "/blog" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-heading font-black tracking-tighter text-slate-900 dark:text-white">
          Portify  <span className="text-primary">AI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            link.path.startsWith("#") ? (
              <a
                key={link.name}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-textMuted'}`}
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-textMuted'}`}
              >
                {link.name}
              </Link>
            )
          ))}
          {token ? (
            <button
              onClick={logout}
              className="px-5 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full text-sm font-medium hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="px-5 py-2 glass text-slate-800 dark:text-white rounded-full text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              Login
            </Link>
          )}
          
          <button 
            onClick={toggleTheme} 
            className="p-2 glass rounded-full text-slate-800 dark:text-white hover:text-primary transition-colors"
          >
            {theme === "dark" ? <HiSun size={20} /> : <HiMoon size={20} />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="text-slate-800 dark:text-white hover:text-primary transition-colors"
          >
            {theme === "dark" ? <HiSun size={24} /> : <HiMoon size={24} />}
          </button>
          <button
            className="text-slate-800 dark:text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden glass border-t border-white/10 mt-3"
        >
          <div className="flex flex-col p-6 gap-4">
            {links.map((link) => (
              link.path.startsWith("#") ? (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-slate-600 dark:text-textMuted hover:text-primary dark:hover:text-white"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-slate-600 dark:text-textMuted hover:text-primary dark:hover:text-white"
                >
                  {link.name}
                </Link>
              )
            ))}
            <hr className="border-white/10 my-2" />
            {token ? (
              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }} 
                className="text-lg text-red-500 text-left font-medium"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="text-lg text-slate-900 dark:text-white" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}